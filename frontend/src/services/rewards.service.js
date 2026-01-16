import { api } from "@/lib/api";

export const rewardsService = {
  list() {
    return api.get("/rewards").then(r => r.data);
  },
  create(payload) {
    return api.post("/rewards", payload).then(r => r.data);
  },
  update(id, payload) {
    return api.put(`/rewards/${id}`, payload).then(r => r.data);
  },
};
