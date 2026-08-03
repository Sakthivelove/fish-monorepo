import { tsr } from "./tsr";

export const useUploadImage = () => {
  return tsr.uploadImage.useMutation();
};