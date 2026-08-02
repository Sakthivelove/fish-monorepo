import { Readable } from "stream";
import cloudinary from "../lib/cloudinary";

// Cloudinary's plain `upload()` call sends the whole file as one
// base64 payload in a single request, which hits a hard file-size
// ceiling on Cloudinary's end (commonly ~10MB on free/unsigned
// accounts) — that's why small images worked but larger camera
// photos silently failed. `upload_stream` with a chunk_size instead
// streams the file in chunks, which supports much larger files and
// avoids holding a ~33%-larger base64 string in memory.
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB — keep in sync with upload.middleware.ts

function uploadBufferToCloudinary(
  buffer: Buffer
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "fish-store",
        chunk_size: 6 * 1024 * 1024, // 6MB chunks
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export const uploadImage = async ({
  req,
}: any) => {
  try {
    const file = req.file;

    if (!file) {
      return {
        status: 400,
        body: {
          message: "No file uploaded",
        },
      } as const;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return {
        status: 400,
        body: {
          message: `Image is ${(file.size / 1024 / 1024).toFixed(1)}MB — max allowed is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`,
        },
      } as const;
    }

    const result = await uploadBufferToCloudinary(
      file.buffer
    );

    return {
      status: 200,
      body: {
        imageUrl: result.secure_url,
      },
    } as const;
  } catch (error: any) {
    // Log the REAL cause (was previously swallowed into a generic
    // "Upload failed" — impossible to diagnose from the client side).
    console.error(
      "[uploadImage] Cloudinary upload failed:",
      error?.message ?? error
    );

    return {
      status: 500,
      body: {
        message:
          error?.message ??
          "Upload failed. Please try a smaller image or try again.",
      },
    } as const;
  }
};
