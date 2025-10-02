"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { usePayment } from "../hooks/use-payment";
import {
  getSymbolOverride,
  type ConversionCurrency,
} from "../utils/currencies";
import type { BuyerInfo, PaymentError } from "../types/index";
import { useState } from "react";
import type { TransactionReceipt } from "viem";
import { usePaymentWidgetContext } from "../context/payment-widget-context/use-payment-widget-context";

interface PaymentConfirmationProps {
  selectedCurrency: ConversionCurrency;
  buyerInfo: BuyerInfo;
  onBack: () => void;
  handlePaymentSuccess: (
    requestId: string,
    transactionReceipts: TransactionReceipt[],
  ) => void;
}

export function PaymentConfirmation({
  buyerInfo,
  selectedCurrency,
  onBack,
  handlePaymentSuccess,
}: PaymentConfirmationProps) {
  const {
    amountInUsd,
    recipientWallet,
    connectedWalletAddress,
    paymentConfig: { rnApiClientId, feeInfo, reference },
    receiptInfo: { companyInfo: { name: companyName } = {} },
    onPaymentError,
    walletAccount,
  } = usePaymentWidgetContext();
  const { isExecuting, executePayment } = usePayment(
    selectedCurrency.network,
    walletAccount,
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedWalletAddress) return;

    setLocalError(null);

    try {
      const { requestId, transactionReceipts } = await executePayment(
        rnApiClientId,
        {
          payerWallet: connectedWalletAddress,
          amountInUsd,
          recipientWallet,
          paymentCurrency: selectedCurrency.id,
          reference,
          feeInfo,
          customerInfo: {
            email: buyerInfo.email,
            firstName: buyerInfo.firstName,
            lastName: buyerInfo.lastName,
            address: buyerInfo.address
              ? {
                  street: buyerInfo.address.street,
                  city: buyerInfo.address.city,
                  state: buyerInfo.address.state,
                  postalCode: buyerInfo.address.postalCode,
                  country: buyerInfo.address.country,
                }
              : undefined,
          },
        },
      );

      handlePaymentSuccess(requestId, transactionReceipts);
    } catch (error) {
      const paymentError = error as PaymentError;

      let errorMessage = "Payment failed. Please try again.";

      if (paymentError.type === "wallet") {
        errorMessage =
          "Wallet connection error. Please check your wallet and try again.";
      } else if (paymentError.type === "transaction") {
        errorMessage =
          "Transaction failed. Please check your balance and network connection.";
      } else if (paymentError.type === "api") {
        errorMessage =
          paymentError.error?.message ||
          "Payment service error. Please try again.";
      } else if (paymentError.error?.message) {
        errorMessage = paymentError.error.message;
      }
      setLocalError(errorMessage);

      onPaymentError?.(paymentError);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Confirmation</h3>

      <div className="flex items-center justify-center space-x-6 p-6 bg-slate-100 rounded-lg dark:bg-slate-800">
        {/* Payment Currency (From) */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-50 font-semibold text-lg dark:bg-slate-50 dark:text-slate-900">
            {getSymbolOverride(selectedCurrency.symbol)}
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">From</div>
            <div className="text-sm font-medium text-slate-950 dark:text-slate-50">
              {selectedCurrency.name}
            </div>
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-slate-500 dark:text-slate-400" />

        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            USD
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">To</div>
            <div className="text-sm font-medium text-slate-950 dark:text-slate-50">
              ${amountInUsd}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-slate-950 dark:text-slate-50">Payment To</h4>
        <div className="p-4 bg-slate-100 rounded-lg space-y-3 dark:bg-slate-800">
          <div className="text-base font-semibold text-slate-950 dark:text-slate-50">
            {companyName}
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide dark:text-slate-400">
              Wallet Address
            </div>
            <div className="text-sm font-mono text-slate-950 break-all dark:text-slate-50">
              {recipientWallet}
            </div>
          </div>
        </div>
      </div>

      {localError && (
        <div className="p-4 bg-red-500/10 border border-slate-200 border-red-500/20 rounded-lg dark:bg-red-900/10 dark:border-slate-800 dark:border-red-900/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-900" />
            <div className="space-y-2 flex-1">
              <p className="text-sm text-red-500 font-medium dark:text-red-900">
                Payment Error
              </p>
              <p className="text-sm text-red-500/80 dark:text-red-900/80">{localError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isExecuting || !connectedWalletAddress}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleExecutePayment}
          className="flex-1"
          disabled={isExecuting}
        >
          {isExecuting ? "Processing..." : "Pay"}
        </Button>
      </div>
    </div>
  );
}
