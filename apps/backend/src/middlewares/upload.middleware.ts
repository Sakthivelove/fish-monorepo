import multer from "multer";

// memoryStorage buffers the WHOLE file in RAM before it's even sent
// to Cloudinary — with no limit set, a big-enough file could crash
// the process on a small Render instance. 20MB is generous for a
// phone photo while still bounding memory use.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB — keep in sync with upload.controller.ts
  },
});
