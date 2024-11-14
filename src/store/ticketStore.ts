import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TicketItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
}

interface TicketStore {
  tickets: Record<string, TicketItem>;
  updateQuantity: (eventId: string, ticketId: string, quantity: number) => void;
  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: {},
      updateQuantity: (eventId: string, ticketId: string, quantity: number) =>
        set((state) => {
          const key = `${eventId}-${ticketId}`;

          if (quantity === 0) {
            const { [key]: _, ...remainingTickets } = state.tickets;
            return { tickets: remainingTickets };
          }

          return {
            tickets: {
              ...state.tickets,
              [key]: {
                id: ticketId,
                quantity,
                price: state.tickets[key]?.price || 0,
                name: state.tickets[key]?.name || "",
              },
            },
          };
        }),
      clearTickets: () => set({ tickets: {} }),
    }),
    {
      name: "ticket-storage",
    }
  )
);
