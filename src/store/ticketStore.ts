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
  incrementQuantity: (eventId: string, ticket: TicketTier) => void;
  decrementQuantity: (eventId: string, ticket: TicketTier) => void;
  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: {},
      incrementQuantity: (eventId: string, ticket: TicketTier) =>
        set((state) => {
          const key = `${eventId}-${ticket.id}`;

          const ticketExists = state.tickets[key];

          return {
            tickets: {
              ...state.tickets,
              [key]: {
                id: ticket.id,
                quantity: ticketExists ? ticketExists.quantity + 1 : 1,
                price: ticket.price,
                name: ticket.name,
              },
            },
          };
        }),
      decrementQuantity: (eventId: string, ticket: TicketTier) =>
        set((state) => {
          const key = `${eventId}-${ticket.id}`;

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
