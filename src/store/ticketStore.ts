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
  addTicket: (
    eventId: string,
    ticketId: string,
    price: number,
    name: string
  ) => void;
  removeTicket: (eventId: string, ticketId: string) => void;
  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: {},
      addTicket: (eventId, ticketId, price, name) =>
        set((state) => {
          const key = `${eventId}-${ticketId}`;
          const currentQuantity = state.tickets[key]?.quantity || 0;
          return {
            tickets: {
              ...state.tickets,
              [key]: {
                id: ticketId,
                quantity: currentQuantity + 1,
                price,
                name,
              },
            },
          };
        }),
      removeTicket: (eventId, ticketId) =>
        set((state) => {
          const key = `${eventId}-${ticketId}`;
          const currentQuantity = state.tickets[key]?.quantity || 0;
          if (currentQuantity <= 1) {
            const { [key]: _, ...rest } = state.tickets;
            return { tickets: rest };
          }
          return {
            tickets: {
              ...state.tickets,
              [key]: {
                ...state.tickets[key],
                quantity: currentQuantity - 1,
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
