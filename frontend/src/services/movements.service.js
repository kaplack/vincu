import { api } from "@/lib/api";

export const movementsService = {
  list({ customerId } = {}) {
    return api.get("/movements", { params: { customerId } }).then(r => r.data);
  },
};
