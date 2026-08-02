import { tsr } from "./tsr";

export const useReports = () => {
  return tsr.getSummary.useQuery({
    queryKey: ["reports"],
  });
};