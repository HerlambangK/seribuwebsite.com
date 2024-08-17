// stores/order.ts
import { defineStore } from "pinia";
import type { Order } from "~/utils/types";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [] as Order[],
  }),
  actions: {
    async updateOrder(orderId: number, packageId: number | null) {
      const { data } = await useFetch<{ updatedOrder: Order }>("/api/order/" + orderId, {
        method: "PUT",
        body: JSON.stringify({ packageId }),
      });

      if (data.value) {
        const index = this.orders.findIndex((order: Order) => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = data.value.updatedOrder;
        }
      }
    },
  },
});
