"use client";

import { useTicketStore } from "@/store/ticketStore";
import { useEffect, useState } from "react";

export function CartReview() {
  const { tickets, incrementQuantity, decrementQuantity, clearTickets } =
    useTicketStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = Object.values(tickets).reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
    setTotal(newTotal);
  }, [tickets]);

  const groupedTickets = Object.entries(tickets).map(([key, ticket]) => ({
    eventId: key.split("-")[0],
    ...ticket,
  }));

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      role="region"
      aria-label="Shopping Cart"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cart Review</h2>
        {groupedTickets.length > 0 && (
          <button
            onClick={clearTickets}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
            aria-label="Clear all items from cart"
          >
            Clear Cart
          </button>
        )}
      </div>

      {groupedTickets.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div>
          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {groupedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-100 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{ticket.name}</h3>
                    <p className="text-[#099C77] font-medium">
                      ${ticket.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(ticket.id)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                      aria-label={`Decrease quantity for ${ticket.name}`}
                    >
                      -
                    </button>
                    <span
                      className="w-8 text-center font-medium"
                      aria-label={`${ticket.quantity} tickets selected`}
                    >
                      {ticket.quantity}
                    </span>
                    <button
                      onClick={() =>
                        incrementQuantity(ticket.id, {
                          id: ticket.id,
                          name: ticket.name,
                          price: ticket.price,
                          description: "",
                          available: 0,
                        })
                      }
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                      aria-label={`Increase quantity for ${ticket.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total:</span>
              <span className="text-xl font-bold text-[#099C77]">
                ${total > 0 ? total.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
