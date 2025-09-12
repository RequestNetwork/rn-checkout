"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Download } from "lucide-react";
import { createInvoice, type CreateInvoiceParams } from "@/lib/invoice";
import { useRef } from "react";
import { InvoicePDFTemplate } from "@/components/invoice/invoice-template";
import { usePaymentWidgetContext } from "../context/payment-widget-context";
import type { BuyerInfo } from "@/types";
import type { ConversionCurrency } from "@/lib/currencies";

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
  const { amountInUsd, connectedWalletAddress, invoiceInfo, uiConfig } =
    usePaymentWidgetContext();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceParams: CreateInvoiceParams = {
    company: invoiceInfo.companyInfo,
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
    items: invoiceInfo.items,
    totals: invoiceInfo.totals,
    metadata: {
      invoiceNumber: invoiceInfo?.invoiceNumber
        ? invoiceInfo.invoiceNumber
        : undefined,
      notes: `Payment processed through Request Network for ${amountInUsd} USD`,
    },
  };

  const handleDownloadInvoice = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) {
        console.error("Invoice element not found");
        return;
      }

      const html2pdf = (await import("html2pdf.js")).default;

      html2pdf()
        .set({
          margin: 1,
          filename: `invoice-${invoiceParams.metadata?.invoiceNumber || "payment"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice. Please try again.");
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
        {uiConfig.showInvoiceDownload && (
          <>
            <Button onClick={handleDownloadInvoice} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice PDF
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
              <div ref={invoiceRef}>
                <InvoicePDFTemplate invoice={createInvoice(invoiceParams)} />
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
