import z from "zod";
import isEthereumAddress from "validator/lib/isEthereumAddress"; // @TODO add this

export const PlaygroundValidation = z.object({
  // Payment basics
  amountInUsd: z.string().min(1, "Amount is required"),
  recipientWallet: z.string().min(1, "Recipient wallet is required"),
  
  // Payment config
  paymentConfig: z.object({
    walletConnectProjectId: z.string().optional(),
    network: z.enum(["arbitrum", "base", "mainnet", "optimism", "polygon", "sepolia"]),
    rnApiClientId: z.string().min(1, "API Client ID is required"),
    feeInfo: z.object({
      feePercentage: z.string(),
      feeAddress: z.string(),
    }).optional(),
    supportedCurrencies: z.array(z.string()).optional(),
  }),

  // UI config
  uiConfig: z.object({
    showRequestScanUrl: z.boolean().optional(),
    showReceiptDownload: z.boolean().optional(),
  }).optional(),

  // Receipt info
  receiptInfo: z.object({
    buyerInfo: z.object({
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      businessName: z.string().optional(),
      phone: z.string().optional(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        postalCode: z.string(),
      }).optional(),
    }),
    companyInfo: z.object({
      name: z.string().min(1, "Company name is required"),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }).optional(),
      taxId: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
    }),
    items: z.array(z.object({
      id: z.string(),
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      discount: z.number().optional(),
      tax: z.number().optional(),
      total: z.number(),
      currency: z.string().optional(),
    })),
    totals: z.object({
      totalDiscount: z.number(),
      totalTax: z.number(),
      total: z.number(),
      totalUSD: z.number(),
    }),
    invoiceNumber: z.string().optional(),
  }),
});

export type PlaygroundFormData = z.infer<typeof PlaygroundValidation>;
