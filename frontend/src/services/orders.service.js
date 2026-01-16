import { api } from "@/lib/api";

export const ordersService = {
  create(payload) {
    return api.post("/orders", payload).then(r => r.data);
  },
  list({ customerId } = {}) {
    return api.get("/orders", { params: { customerId } }).then(r => r.data);
  },
  quickAddPoint({ customerId, qrCodeValue } = {}) {
    // One-tap +1 point without creating an order (cashier shortcut)
    return api.post("/orders/quick-add", { customerId, qrCodeValue }).then(r => r.data);
  },
};
