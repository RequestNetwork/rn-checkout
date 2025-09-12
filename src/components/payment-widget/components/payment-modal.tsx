"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CurrencySelect } from "./currency-select";
import { BuyerInfoForm } from "./buyer-info-form";
import { PaymentConfirmation } from "./payment-confirmation";
import { PaymentSuccess } from "./payment-success";
import { DisconnectWallet } from "./disconnect-wallet";
import { usePaymentWidgetContext } from "../context/payment-widget-context";
import type { BuyerInfo } from "@/types";
import type { ConversionCurrency } from "@/lib/currencies";

interface PaymentModalProps {
  isOpen: boolean;
  handleModalOpenChange: (open: boolean) => void;
}

export function PaymentModal({
  isOpen,
  handleModalOpenChange,
}: PaymentModalProps) {
  const { isWalletOverride, invoiceInfo, onSuccess } =
    usePaymentWidgetContext();

  const [activeStep, setActiveStep] = useState<
    | "currency-select"
    | "buyer-info"
    | "payment-confirmation"
    | "payment-success"
  >("currency-select");
  const [selectedCurrency, setSelectedCurrency] =
    useState<ConversionCurrency | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | undefined>(
    invoiceInfo.buyerInfo || undefined,
  );
  const [requestId, setRequestId] = useState<string>("");

  const handleCurrencySelect = (currency: ConversionCurrency) => {
    setSelectedCurrency(currency);
    setActiveStep("buyer-info");
  };

  const handleBuyerInfoSubmit = (data: BuyerInfo) => {
    setBuyerInfo(data);
    setActiveStep("payment-confirmation");
  };

  const handlePaymentSuccess = async (requestId: string) => {
    setRequestId(requestId);
    setActiveStep("payment-success");
    await onSuccess?.(requestId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Pay with crypto using Request Network
          </DialogDescription>
        </DialogHeader>

        {activeStep !== "payment-success" && !isWalletOverride && (
          <DisconnectWallet />
        )}

        {activeStep === "currency-select" && (
          <CurrencySelect onSubmit={handleCurrencySelect} />
        )}

        {activeStep === "buyer-info" && (
          <BuyerInfoForm
            initialData={buyerInfo}
            onBack={() => setActiveStep("currency-select")}
            onSubmit={handleBuyerInfoSubmit}
          />
        )}

        {activeStep === "payment-confirmation" &&
          selectedCurrency &&
          buyerInfo && (
            <PaymentConfirmation
              selectedCurrency={selectedCurrency}
              buyerInfo={buyerInfo}
              onBack={() => setActiveStep("buyer-info")}
              handlePaymentSuccess={handlePaymentSuccess}
            />
          )}

        {activeStep === "payment-success" && selectedCurrency && buyerInfo && (
          <PaymentSuccess
            requestId={requestId}
            selectedCurrency={selectedCurrency}
            buyerInfo={buyerInfo}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
