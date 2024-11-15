"use client";

import { useState } from "react";
import { CartReview } from "./CartReview";
import { PaymentStep } from "./PaymentStep";
import { useTicketStore } from "@/store/ticketStore";

const steps = [
  { id: "cart", title: "Cart Review" },
  { id: "payment", title: "Payment" },
];

export function CheckoutStepper() {
  const [currentStep, setCurrentStep] = useState("cart");
  const { tickets } = useTicketStore();

  // Check if cart has items
  const hasItems = Object.keys(tickets).length > 0;

  return (
    <div className="space-y-8" role="region" aria-label="Checkout Process">
      {/* Stepper UI */}
      <div
        className="flex items-center justify-center"
        role="navigation"
        aria-label="Checkout Steps"
      >
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${
                  currentStep === step.id
                    ? "border-[#099C77] text-[#099C77]"
                    : "border-gray-300 text-gray-500"
                }`}
              aria-current={currentStep === step.id ? "step" : undefined}
              role="status"
              aria-label={`Step ${index + 1}: ${step.title}`}
            >
              {index + 1}
            </div>
            <span className="mx-3 text-sm font-medium text-gray-900">
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="flex-1 w-20 h-[2px] bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>
        {currentStep === "cart" ? (
          <div className="space-y-6">
            <CartReview />
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep("payment")}
                disabled={!hasItems}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  hasItems
                    ? "bg-[#099C77] text-white hover:bg-[#099C77]/90"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                aria-label={hasItems ? "Proceed to payment" : "Cart is empty"}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <PaymentStep />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep("cart")}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
