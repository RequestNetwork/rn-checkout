"use client";

import { useState, useEffect } from "react";
import { useTicketStore } from "@/store/ticketStore";

interface TicketSelectorProps {
  event: any; // Type this properly based on your data structure
}

export function TicketSelector({ event }: TicketSelectorProps) {
  const { tickets, addTicket, removeTicket } = useTicketStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let newTotal = 0;
    Object.entries(tickets).forEach(([key, ticket]) => {
      if (key.startsWith(event.id)) {
        newTotal += ticket.price * ticket.quantity;
      }
    });
    setTotal(newTotal);
  }, [tickets, event.id]);

  const getTicketQuantity = (ticketId: string) => {
    const key = `${event.id}-${ticketId}`;
    return tickets[key]?.quantity || 0;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
      <h2 className="text-2xl font-semibold mb-6">Select Tickets</h2>

      <div className="space-y-6">
        {event.ticketTiers.map((tier: any) => (
          <div
            key={tier.id}
            className="border-b border-gray-100 pb-6 last:border-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="text-lg font-medium text-[#099C77]">
                  ${tier.price}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => removeTicket(event.id, tier.id)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                  disabled={getTicketQuantity(tier.id) === 0}
                >
                  -
                </button>
                <span className="w-8 text-center">
                  {getTicketQuantity(tier.id)}
                </span>
                <button
                  onClick={() =>
                    addTicket(event.id, tier.id, tier.price, tier.name)
                  }
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                  disabled={getTicketQuantity(tier.id) === tier.available}
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{tier.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${total}</span>
        </div>

        <button
          className="w-full bg-[#099C77] text-white py-3 rounded-lg font-medium hover:bg-[#078665] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={total === 0}
        >
          Buy Tickets
        </button>
      </div>
    </div>
  );
}
