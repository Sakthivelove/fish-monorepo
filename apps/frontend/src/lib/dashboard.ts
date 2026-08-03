import { tsr } from "./tsr";

export const useDashboardStats =
  () => {
    return tsr.getStats.useQuery({
      queryKey: [
        "dashboard-stats",
      ],
    });
  };