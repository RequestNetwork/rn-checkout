"use client";

import { useState, useEffect } from "react";
import { useTicketStore } from "@/store/ticketStore";
import Link from "next/link";

interface Location {
  venue: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Organizer {
  name: string;
  logo: string;
  description: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

interface Event {
  id: string;
  name: string;
  type: string;
  featured: boolean;
  image: string;
  headerImage: string;
  dateTime: string;
  endDateTime: string;
  location: Location;
  startingPrice: number;
  organizer: Organizer;
  ticketTiers: TicketTier[];
}

interface TicketSelectorProps {
  event: Event;
}

export function TicketSelector({ event }: TicketSelectorProps) {
  const { tickets, incrementQuantity, decrementQuantity } = useTicketStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let newTotal = 0;
    Object.entries(tickets).forEach(([key, ticket]) => {
      if (key.startsWith(event.id)) {
        newTotal += Number(ticket.price) * Number(ticket.quantity);
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
        {event.ticketTiers.map((tier) => (
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
                  onClick={() => decrementQuantity(`${event.id}-${tier.id}`)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                  disabled={getTicketQuantity(tier.id) === 0}
                  aria-label={`Decrease quantity for ${tier.name}`}
                >
                  -
                </button>
                <span
                  className="w-8 text-center"
                  aria-label={`${getTicketQuantity(tier.id)} tickets selected`}
                >
                  {getTicketQuantity(tier.id)}
                </span>
                <button
                  onClick={() =>
                    incrementQuantity(`${event.id}-${tier.id}`, tier)
                  }
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#099C77] hover:text-[#099C77] transition-colors"
                  disabled={getTicketQuantity(tier.id) === tier.available}
                  aria-label={`Increase quantity for ${tier.name}`}
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
          <span className="text-xl font-bold">
            ${total > 0 ? total.toFixed(2) : "0.00"}
          </span>
        </div>

        <Link href="/checkout">
          <button
            className="w-full bg-[#099C77] text-white py-3 rounded-lg font-medium hover:bg-[#078665] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={total === 0}
            aria-label={
              total === 0
                ? "Checkout disabled - no tickets selected"
                : "Proceed to checkout"
            }
          >
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
