import { api } from "@/lib/api";

export const reportsService = {
  summary() {
    return api.get("/reports/summary").then(r => r.data);
  },
  topCustomers() {
    return api.get("/reports/top-customers").then(r => r.data);
  },
  rewardsUsage() {
    return api.get("/reports/rewards-usage").then(r => r.data);
  },
};
