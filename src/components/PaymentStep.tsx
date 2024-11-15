"use client";

import { useTicketStore } from "@/store/ticketStore";
import PaymentWidget from "@requestnetwork/payment-widget/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentStep() {
  const { tickets, clearTickets } = useTicketStore();
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const newTotal = Object.values(tickets).reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
    setTotal(newTotal);
  }, [tickets]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div
        className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        role="region"
        aria-label="Order Summary"
      >
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-4">
          {Object.values(tickets).map((ticket) => (
            <div
              key={ticket.id}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2"
            >
              <div>
                <h3 className="font-medium">{ticket.name}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {ticket.quantity}
                </p>
              </div>
              <p className="font-medium text-[#099C77]">
                ${(ticket.price * ticket.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-[#099C77]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Widget */}
      <div role="region" aria-label="Payment Widget">
        <h2 className="text-2xl font-semibold mb-6">Payment</h2>
        <PaymentWidget
          amountInUSD={total}
          sellerAddress={"0xb07D2398d2004378cad234DA0EF14f1c94A530e4"}
          builderId={process.env.NEXT_PUBLIC_BUILDER_ID}
          supportedCurrencies={[
            "ETH-sepolia-sepolia",
            "fUSDC-sepolia",
            "fUSDT-sepolia",
          ]}
          onPaymentSuccess={() => {
            clearTickets();

            setTimeout(() => {
              router.push("/");
            }, 5000);
          }}
          hideTotalAmount
        />
      </div>
    </div>
  );
}
