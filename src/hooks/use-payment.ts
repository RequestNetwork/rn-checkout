import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import {
  executePayment,
  type PaymentParams,
  type TxParams,
  type PaymentResponse,
} from "@/lib/payment";
import type { PaymentError } from "@/types";
import type { Account, WalletClient } from "viem";

export const usePayment = (walletAccount?: WalletClient) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const isConnected = walletAccount
    ? Boolean(walletAccount.account)
    : wagmiConnected;
  const address = walletAccount ? walletAccount.account?.address : wagmiAddress;

  const wrappedSendTransaction =
    walletAccount?.account !== undefined
      ? async (transaction: TxParams) => {
          await walletAccount.sendTransaction({
            account: walletAccount.account as Account, // we know it's defined here
            chain: walletAccount.chain,
            to: transaction.to,
            data: transaction.data,
            value: transaction.value,
          });
        }
      : async (tx: TxParams) => {
          await sendTransactionAsync(tx);
        };

  const execute = async (
    rnApiClientId: string,
    params: PaymentParams,
  ): Promise<PaymentResponse> => {
    if (!isConnected || !address) {
      throw {
        type: "wallet",
        error: new Error("Wallet not connected"),
      } as PaymentError;
    }

    setIsExecuting(true);
    try {
      return await executePayment({
        rnApiClientId,
        paymentParams: {
          amountInUsd: params.amountInUsd,
          payerWallet: address,
          recipientWallet: params.recipientWallet,
          paymentCurrency: params.paymentCurrency,
          feeInfo: params.feeInfo,
        },
        sendTransaction: wrappedSendTransaction,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    isExecuting,
    executePayment: execute,
    isConnected,
    address,
  };
};
