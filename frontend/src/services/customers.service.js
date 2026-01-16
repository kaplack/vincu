import { api } from "@/lib/api";

export const customersService = {
  list({ search = "" } = {}) {
    return api.get("/customers", { params: { search } }).then(r => r.data);
  },
  get(id) {
    return api.get(`/customers/${id}`).then(r => r.data);
  },
  balance(id) {
    return api.get(`/customers/${id}/balance`).then(r => r.data);
  },
  create(payload) {
    return api.post("/customers", payload).then(r => r.data);
  },
  findOrCreateByPhone(phone) {
    return api.post("/customers/find-or-create", { phone }).then(r => r.data);
  },
  byQr(qrCodeValue) {
    return api.post("/customers/by-qr", { qrCodeValue }).then(r => r.data);
  },
};
