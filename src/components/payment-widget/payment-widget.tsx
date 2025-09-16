"use client";

import { type PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionHandler } from "./components/connection-handler";
import { Web3Provider } from "./context/web3-context";
import { PaymentModal } from "./components/payment-modal";
import {
  PaymentWidgetProvider,
  usePaymentWidgetContext,
} from "./context/payment-widget-context";
import type { PaymentWidgetProps } from "./payment-widget.types";
import { ICONS } from "./constants";

function PaymentWidgetInner({ children }: PropsWithChildren) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const { walletAccount } = usePaymentWidgetContext();

  return (
    <div className="inline-flex flex-col items-center">
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="ghost"
        className="p-0 h-auto bg-transparent hover:bg-transparent"
      >
        {children || "Pay with crypto"}
      </Button>

      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
        {/** biome-ignore lint/performance/noImgElement: This is a ShadCN library, we can't enforce next syntax on everybody */}
        <img
          src={ICONS.requestNetwork}
          alt="Request Network"
          width={10}
          height={10}
          className="flex-shrink-0"
        />
        <span>Powered by Request Network</span>
      </div>

      {walletAccount !== undefined ? (
        <PaymentModal
          isOpen={isModalOpen}
          handleModalOpenChange={handleModalOpenChange}
        />
      ) : (
        <ConnectionHandler
          isOpen={isModalOpen}
          handleModalOpenChange={handleModalOpenChange}
          paymentModal={
            <PaymentModal
              isOpen={isModalOpen}
              handleModalOpenChange={handleModalOpenChange}
            />
          }
        />
      )}
    </div>
  );
}

export function PaymentWidget({
  amountInUsd,
  recipientWallet,
  paymentConfig,
  receiptInfo,
  onSuccess,
  onError,
  uiConfig,
  walletAccount,
  children,
}: PaymentWidgetProps) {
  return (
    <Web3Provider walletConnectProjectId={paymentConfig.walletConnectProjectId}>
      <PaymentWidgetProvider
        amountInUsd={amountInUsd}
        recipientWallet={recipientWallet}
        walletAccount={walletAccount}
        paymentConfig={paymentConfig}
        uiConfig={uiConfig}
        receiptInfo={receiptInfo}
        onSuccess={onSuccess}
        onError={onError}
      >
        <PaymentWidgetInner>{children}</PaymentWidgetInner>
      </PaymentWidgetProvider>
    </Web3Provider>
  );
}
