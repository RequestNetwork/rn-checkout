import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

interface StoredTicket {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TicketStore {
  tickets: Record<string, StoredTicket>;
  incrementQuantity: (key: string, ticket: TicketTier) => void;
  decrementQuantity: (key: string) => void;
  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: {},
      incrementQuantity: (key: string, ticket: TicketTier) =>
        set((state) => {
          const ticketExists = state.tickets[key];

          return {
            tickets: {
              ...state.tickets,
              [key]: {
                id: key,
                quantity: ticketExists ? ticketExists.quantity + 1 : 1,
                price: ticket.price,
                name: ticket.name,
              },
            },
          };
        }),
      decrementQuantity: (key: string) =>
        set((state) => {
          if (state.tickets[key].quantity === 1) {
            const { [key]: _, ...remainingTickets } = state.tickets;
            return { tickets: remainingTickets };
          }

          return {
            tickets: {
              ...state.tickets,
              [key]: {
                ...state.tickets[key],
                quantity: state.tickets[key].quantity - 1,
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
