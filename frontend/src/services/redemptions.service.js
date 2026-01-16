import { api } from "@/lib/api";

export const redemptionsService = {
  create(payload) {
    return api.post("/redemptions", payload).then(r => r.data);
  },
  list({ customerId } = {}) {
    return api.get("/redemptions", { params: { customerId } }).then(r => r.data);
  },
};
