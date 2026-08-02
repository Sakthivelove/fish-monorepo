import cloudinary from "../lib/cloudinary";

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

    const base64 =
      `data:${file.mimetype};base64,` +
      file.buffer.toString("base64");

    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder: "fish-store",
        }
      );

    return {
      status: 200,
      body: {
        imageUrl: result.secure_url,
      },
    } as const;
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      body: {
        message: "Upload failed",
      },
    } as const;
  }
};