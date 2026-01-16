import { api } from "@/lib/api";

export const productsService = {
  list() {
    return api.get("/products").then(r => r.data);
  },
  create(payload) {
    return api.post("/products", payload).then(r => r.data);
  },
  update(id, payload) {
    return api.put(`/products/${id}`, payload).then(r => r.data);
  },
};
