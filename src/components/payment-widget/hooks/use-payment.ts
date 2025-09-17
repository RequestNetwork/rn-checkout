import { useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useConfig,
  useSwitchChain,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { createPublicClient, http } from "viem";
import {
  executePayment,
  type PaymentParams,
  type TxParams,
  type PaymentResponse,
  type SendTransactionFunction,
  type WaitForTransactionFunction,
} from "../utils/payment";
import type { PaymentError } from "../types/index";
import type { Account, WalletClient, TransactionReceipt } from "viem";
import { getChainFromNetwork } from "../utils/chains";

export const usePayment = (network: string, walletAccount?: WalletClient) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const config = useConfig();

  const requiredChain = getChainFromNetwork(network);
  const isConnected = walletAccount
    ? Boolean(walletAccount.account)
    : wagmiConnected;

  const address = walletAccount ? walletAccount.account?.address : wagmiAddress;
  const isUsingCustomWallet = walletAccount?.account !== undefined;

  const wrappedSendTransaction: SendTransactionFunction = isUsingCustomWallet
    ? async (transaction: TxParams): Promise<`0x${string}`> => {
        const hash = await walletAccount.sendTransaction({
          account: walletAccount.account as Account,
          chain: walletAccount.chain,
          to: transaction.to,
          data: transaction.data,
          value: transaction.value,
        });

        return hash;
      }
    : async (tx: TxParams): Promise<`0x${string}`> => {
        const hash = await sendTransactionAsync(tx);
        return hash;
      };

  const wrappedWaitForTransaction: WaitForTransactionFunction =
    isUsingCustomWallet
      ? async (hash: `0x${string}`): Promise<TransactionReceipt> => {
          if (!walletAccount.chain) {
            throw {
              type: "wallet",
              error: new Error("Wallet isn't connected to any chain"),
            } as PaymentError;
          }
          const publicClient = createPublicClient({
            chain: walletAccount.chain,
            transport: http(),
          });

          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
          });

          return receipt;
        }
      : async (hash: `0x${string}`): Promise<TransactionReceipt> => {
          const receipt = await waitForTransactionReceipt(config, {
            hash,
          });
          return receipt;
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
      if (isUsingCustomWallet) {
        await walletAccount.switchChain({ id: requiredChain.id });
      } else {
        await switchChainAsync({ chainId: requiredChain.id });
      }

      return await executePayment({
        rnApiClientId,
        paymentParams: {
          amountInUsd: params.amountInUsd,
          payerWallet: address,
          recipientWallet: params.recipientWallet,
          paymentCurrency: params.paymentCurrency,
          feeInfo: params.feeInfo,
          customerInfo: params.customerInfo,
        },
        sendTransaction: wrappedSendTransaction,
        waitForTransaction: wrappedWaitForTransaction,
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
