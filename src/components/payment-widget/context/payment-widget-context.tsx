"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAccount } from "wagmi";
import type { ReceiptInfo, FeeInfo, PaymentError } from "../types/index";
import type { WalletClient } from "viem";
import type { PaymentWidgetProps } from "../payment-widget.types";

export interface PaymentWidgetContextValue {
  amountInUsd: string;
  recipientWallet: string;

  walletAccount?: WalletClient;
  connectedWalletAddress?: string;
  isWalletOverride: boolean;

  paymentConfig: {
    rnApiClientId: string;
    network:
      | "arbitrum"
      | "base"
      | "mainnet"
      | "optimism"
      | "polygon"
      | "sepolia";
    feeInfo?: FeeInfo;
    supportedCurrencies?: string[];
  };

  uiConfig: {
    showRequestScanUrl: boolean;
    showReceiptDownload: boolean;
  };

  receiptInfo: ReceiptInfo;

  onSuccess?: (requestId: string) => void | Promise<void>;
  onError?: (error: PaymentError) => void | Promise<void>;
}

const PaymentWidgetContext = createContext<PaymentWidgetContextValue | null>(
  null,
);

interface PaymentWidgetProviderProps {
  children: ReactNode;
  amountInUsd: string;
  recipientWallet: string;
  walletAccount?: WalletClient;
  paymentConfig: Omit<
    PaymentWidgetProps["paymentConfig"],
    "walletConnectProjectId"
  >;
  uiConfig?: PaymentWidgetProps["uiConfig"];
  receiptInfo: ReceiptInfo;
  onSuccess?: (requestId: string) => void | Promise<void>;
  onError?: (error: PaymentError) => void | Promise<void>;
}

export function PaymentWidgetProvider({
  children,
  amountInUsd,
  recipientWallet,
  walletAccount,
  paymentConfig,
  uiConfig,
  receiptInfo,
  onSuccess,
  onError,
}: PaymentWidgetProviderProps) {
  const { address } = useAccount();

  const isWalletOverride = walletAccount !== undefined;
  const connectedWalletAddress = walletAccount
    ? walletAccount.account?.address
    : address;

  const contextValue: PaymentWidgetContextValue = {
    amountInUsd,
    recipientWallet,
    walletAccount,
    connectedWalletAddress,
    isWalletOverride,
    paymentConfig: {
      rnApiClientId: paymentConfig.rnApiClientId,
      network: paymentConfig.network,
      feeInfo: paymentConfig.feeInfo,
      supportedCurrencies: paymentConfig.supportedCurrencies,
    },
    uiConfig: {
      showReceiptDownload: uiConfig?.showReceiptDownload || true,
      showRequestScanUrl: uiConfig?.showRequestScanUrl || true,
    },
    receiptInfo,
    onSuccess,
    onError,
  };

  return (
    <PaymentWidgetContext.Provider value={contextValue}>
      {children}
    </PaymentWidgetContext.Provider>
  );
}

export function usePaymentWidgetContext(): PaymentWidgetContextValue {
  const context = useContext(PaymentWidgetContext);

  if (!context) {
    throw new Error(
      "usePaymentWidgetContext must be used within a PaymentWidgetProvider",
    );
  }

  return context;
}
