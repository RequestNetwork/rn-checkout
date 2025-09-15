"use client";

import { PlaygroundValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Tabs } from "../ui/custom-tabs";
import { CustomizeForm } from "./blocks/customize";
import { SellerForm } from "./blocks/seller-info";
import { BuyerForm } from "./blocks/buyer-info";
import { PaymentWidget } from "../payment-widget/payment-widget";

export const Playground = () => {
  const tabs = [
    { label: "Customize Widget", value: "customize" },
    { label: "Company Info", value: "seller" },
    { label: "Buyer Info", value: "buyer" },
  ];

  const methods = useForm<z.infer<typeof PlaygroundValidation>>({
    resolver: zodResolver(PlaygroundValidation),
    mode: "onChange",
    defaultValues: {
      amountInUsd: "0",
      recipientWallet: "",
      paymentConfig: {
        walletConnectProjectId: undefined,
        network: "sepolia",
        rnApiClientId: "YOUR_CLIENT_ID_HERE",
        supportedCurrencies: [],
        feeInfo: {
          feePercentage: "0",
          feeAddress: "",
        },
      },
      uiConfig: {
        showRequestScanUrl: true,
        showInvoiceDownload: true,
      },
      invoiceInfo: {
        companyInfo: {
          name: "",
          walletAddress: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          taxId: "",
          email: "",
          phone: "",
          website: "",
        },
        buyerInfo: {
          email: "",
          firstName: "",
          lastName: "",
          businessName: "",
          phone: "",
          streetAddress: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        items: [
          {
            id: "1",
            description: "",
            quantity: 1,
            unitPrice: 0,
            total: 0,
            currency: "USD",
          },
        ],
        totals: {
          totalDiscount: 0,
          totalTax: 0,
          total: 0,
          totalUSD: 0,
        },
        invoiceNumber: "",
      },
    },
  });

  const formValues = methods.watch();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

 const generateIntegrationCode = () => {
    const formatObject = (obj: any, indent: number = 2): string => {
      const spaces = " ".repeat(indent);
      const nextSpaces = " ".repeat(indent + 2);
      
      if (typeof obj !== 'object' || obj === null) {
        return JSON.stringify(obj);
      }
      
      // Handle arrays
      if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        
        const arrayItems = obj
          .filter(item => item !== undefined && item !== null)
          .map(item => {
            if (typeof item === 'object' && item !== null) {
              return `${nextSpaces}${formatObject(item, indent + 2)}`;
            }
            return `${nextSpaces}${JSON.stringify(item)}`;
          });
        
        return `[\n${arrayItems.join(',\n')}\n${spaces}]`;
      }
      
      // Handle objects
      const entries = Object.entries(obj)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return `${nextSpaces}${key}: ${formatObject(value, indent + 2)}`;
          }
          return `${nextSpaces}${key}: ${JSON.stringify(value)}`;
        });
      
      if (entries.length === 0) return "{}";
      
      return `{\n${entries.join(',\n')}\n${spaces}}`;
    };

    const paymentConfig = formValues.paymentConfig;
    const cleanedPaymentConfig = {
      ...paymentConfig,
      supportedCurrencies: paymentConfig.supportedCurrencies?.length 
        ? paymentConfig.supportedCurrencies 
        : undefined,
      feeInfo: (paymentConfig.feeInfo?.feeAddress || paymentConfig.feeInfo?.feePercentage !== "0") 
        ? paymentConfig.feeInfo 
        : undefined,
    };

    const cleanedInvoiceInfo = {
      ...formValues.invoiceInfo,
      buyerInfo: Object.values(formValues.invoiceInfo.buyerInfo || {}).some(val => val)
        ? formValues.invoiceInfo.buyerInfo
        : undefined,
    };

    return `import { PaymentWidget } from "./components/payment-widget/payment-widget";
import type { PaymentError } from "./types";

const App = () => {
  const handleSuccess = (requestId: string) => {
    console.log('Payment successful:', requestId);
  };

  const handleError = (error: PaymentError) => {
    console.error('Payment failed:', error);
  };

  return (
    <PaymentWidget
      amountInUsd="${formValues.amountInUsd}"
      recipientWallet="${formValues.recipientWallet}"
      paymentConfig={${formatObject(cleanedPaymentConfig, 6)}}${formValues.uiConfig ? `
      uiConfig={${formatObject(formValues.uiConfig, 6)}}` : ''}
      invoiceInfo={${formatObject(cleanedInvoiceInfo, 6)}}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {/* Custom button example */}
      <div className="px-8 py-2 bg-[#099C77] text-white rounded-lg hover:bg-[#087f63] transition-colors text-center">
        Pay with crypto
      </div>
    </PaymentWidget>
  );
};`;
  };

  const integrationCode = generateIntegrationCode();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4 mt-4">
        <section className="flex flex-col gap-6 lg:gap-4 items-center md:items-start md:justify-between lg:flex-row">
          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            <Tabs defaultValue="customize">
              <Tabs.List tabs={tabs} />
              <Tabs.Section value="customize">
                <CustomizeForm />
              </Tabs.Section>
              <Tabs.Section value="seller">
                <SellerForm />
              </Tabs.Section>
              <Tabs.Section value="buyer">
                <BuyerForm />
              </Tabs.Section>
            </Tabs>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h2 className="font-semibold">Preview</h2>
            <PaymentWidget
              amountInUsd={formValues.amountInUsd}
              recipientWallet={formValues.recipientWallet}
              paymentConfig={formValues.paymentConfig}
              uiConfig={formValues.uiConfig}
              invoiceInfo={formValues.invoiceInfo}
              onSuccess={(requestId) => console.log('Payment successful:', requestId)}
              onError={(error) => console.error('Payment failed:', error)}
            >
              <div className="px-8 py-2 bg-[#099C77] text-white rounded-lg hover:bg-[#087f63] transition-colors text-center">Pay with crypto</div>
            </PaymentWidget>
          </div>
        </section>

        {/* Integration Code */}
        <div className="mt-8 w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-2xl my-4">Integration Code:</h3>
          </div>
          <div className="flex justify-end my-4">
            <Button
              className="gap-2 bg-[#4AC2A1] hover:bg-[#4AC2A1]/70 justify-self-end"
              onClick={() => {
                navigator.clipboard.writeText(
                  "npx shadcn add @requestnetwork/payment-widget"
                );
              }}
            >
              <CopyIcon size={16} />
              Copy
            </Button>
          </div>
          <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="language-jsx">
              npx shadcn add @requestnetwork/payment-widget
            </code>
          </pre>

          <div className="flex justify-end my-4">
            <Button
              className="gap-2 bg-[#4AC2A1] hover:bg-[#4AC2A1]/70 justify-self-end"
              onClick={copyToClipboard}
            >
              <CopyIcon size={16} />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre
            ref={codeRef}
            className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto"
          >
            <code className="language-jsx">{integrationCode}</code>
          </pre>
        </div>
      </div>
    </FormProvider>
  );
};
