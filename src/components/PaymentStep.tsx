"use client";

import { useTicketStore } from "@/store/ticketStore";
import { useEffect, useState } from "react";
import { PaymentWidget } from "./payment-widget/payment-widget";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EASY_INVOICE_URL } from "@/lib/constants";

export function PaymentStep() {
  const { tickets, clearTickets } = useTicketStore();
  const [total, setTotal] = useState(0);
  const [customClientId, setCustomClientId] = useState("");

  useEffect(() => {
    const newTotal = Object.values(tickets).reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
    setTotal(newTotal);
  }, [tickets]);

  const invoiceItems = Object.values(tickets).map((ticket, index) => ({
    id: ticket.id || (index + 1).toString(),
    description: ticket.name,
    quantity: ticket.quantity,
    unitPrice: ticket.price.toString(),
    total: (ticket.price * ticket.quantity).toString(),
    currency: "USD",
  }));

  const invoiceTotals = {
    totalDiscount: '0',
    totalTax: '0',
    total: total.toString(),
    totalUSD: total.toString(),
  };

  const defaultClientId = process.env.NEXT_PUBLIC_RN_API_CLIENT_ID;
  const clientId = customClientId || defaultClientId;

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

      <div role="region" aria-label="Payment Widget">
        <h2 className="text-2xl font-semibold mb-6">Payment</h2>
        <div className="mb-6 space-y-2">
          <Label htmlFor="custom-client-id">Custom Client ID</Label>
          <Input
            id="custom-client-id"
            type="text"
            placeholder="Enter your custom client ID"
            value={customClientId}
            onChange={(e) => setCustomClientId(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-600">
            Get your Client ID on{" "}
            <a
              href={`${EASY_INVOICE_URL}/ecommerce/manage`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green hover:text-dark-green underline"
            >
              EasyInvoice
            </a>
          </p>
        </div>

        {clientId && (
          <PaymentWidget
            amountInUsd={total.toString()}
            recipientWallet="0xb07D2398d2004378cad234DA0EF14f1c94A530e4"
            paymentConfig={{
              rnApiClientId: clientId,
              supportedCurrencies: [
                "ETH-sepolia-sepolia",
                "fUSDT-sepolia",
                "FAU-sepolia",
              ],
            }}
            uiConfig={{
              showRequestScanUrl: true,
              showReceiptDownload: true,
            }}
            receiptInfo={{
              companyInfo: {
                name: "Event Ticketing Co.",
                address: {
                  street: "123 Event Street",
                  city: "San Francisco",
                  state: "CA",
                  postalCode: "94102",
                  country: "USA",
                },
                taxId: "ETC123456789",
                email: "billing@eventtickets.com",
                phone: "+1-555-0123",
                website: "https://eventtickets.com",
              },
              buyerInfo: {
                email: "",
                firstName: "",
                lastName: "",
                businessName: "",
                phone: "",
                address: {
                  street: "",
                  city: "",
                  state: "",  
                  country: "",
                  postalCode: "",
                }
              },
              items: invoiceItems,
              totals: invoiceTotals,
              receiptNumber: `REC-${Date.now()}`,
            }}
            onSuccess={() => {
              clearTickets();
            }}
            onError={(error) => {
              console.error("Payment failed:", error);
            }}
          >
            <div className="px-10 py-2 bg-[#099C77] text-white rounded-lg hover:bg-[#087f63] transition-colors text-center">
              Pay with crypto
            </div>
          </PaymentWidget>
        )}
      </div>
    </div>
  );
}
