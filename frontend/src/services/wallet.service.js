import { api } from "@/lib/api";

export const walletService = {
  // Generates Add-to-Google-Wallet link for a customer
  addLink(customerId) {
    return api.get(`/wallet/add-link/${customerId}`).then(r => r.data);
  },
  // Forces a sync of customer points into the pass
  syncCustomer(customerId) {
    return api.post(`/wallet/sync-customer/${customerId}`).then(r => r.data);
  },
};
