"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Download } from "lucide-react";
import {
  createReceipt,
  generateReceiptNumber,
  type CreateReceiptParams,
} from "../utils/receipt";
import { useRef } from "react";
import { ReceiptPDFTemplate } from "../components/receipt/receipt-template";
import { usePaymentWidgetContext } from "../context/payment-widget-context";
import type { BuyerInfo } from "../types/index";
import type { ConversionCurrency } from "../utils/currencies";

interface PaymentSuccessProps {
  requestId: string;
  selectedCurrency: ConversionCurrency;
  buyerInfo: BuyerInfo;
}

export function PaymentSuccess({
  requestId,
  selectedCurrency,
  buyerInfo,
}: PaymentSuccessProps) {
  const {
    amountInUsd,
    recipientWallet,
    connectedWalletAddress,
    receiptInfo,
    uiConfig,
  } = usePaymentWidgetContext();
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptParams: CreateReceiptParams = {
    company: {
      ...receiptInfo.companyInfo,
      walletAddress: recipientWallet,
    },
    buyer: {
      ...buyerInfo,
      walletAddress: connectedWalletAddress || "",
    },
    payment: {
      chain: "ethereum",
      currency: selectedCurrency.symbol,
      exchangeRate: 1,
      transactionHash: "",
    },
    items: receiptInfo.items,
    totals: receiptInfo.totals,
    metadata: {
      receiptNumber: receiptInfo?.receiptNumber
        ? receiptInfo.receiptNumber
        : generateReceiptNumber(),
      notes: `Payment processed through Request Network for ${amountInUsd} USD`,
    },
  };

  const handleDownloadReceipt = async () => {
    try {
      const element = receiptRef.current;
      if (!element) {
        console.error("Receipt element not found");
        return;
      }

      const html2pdf = (await import("html2pdf.js")).default;

      html2pdf()
        .set({
          margin: 1,
          filename: `receipt-${receiptParams.metadata?.receiptNumber || "payment"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Failed to download receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  const requestScanUrl = `https://scan.request.network/request/${requestId}`;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-600">
            Payment Completed!
          </h3>
          <p className="text-gray-600 mt-2">
            Your payment has been processed successfully.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 w-full">
        {uiConfig.showReceiptDownload && (
          <>
            <Button onClick={handleDownloadReceipt} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt PDF
            </Button>
            <div
              style={{
                height: 0,
                width: 0,
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none",
              }}
            >
              <div ref={receiptRef}>
                <ReceiptPDFTemplate receipt={createReceipt(receiptParams)} />
              </div>
            </div>
          </>
        )}
        {uiConfig.showRequestScanUrl && (
          <Button variant="outline" asChild className="w-full">
            <a
              href={requestScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Request Scan
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
