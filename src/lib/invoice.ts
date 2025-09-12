import type { BuyerInfo, CompanyInfo, InvoiceItem } from "@/types";

export interface PaymentInfo {
  chain: string;
  currency: string;
  exchangeRate: number;
  transactionHash?: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  issueDate: Date;
  notes?: string;
}

interface InvoiceBuyerInfo extends BuyerInfo {
  walletAddress: string;
}

export interface InvoiceData {
  company: CompanyInfo;
  buyer: InvoiceBuyerInfo;
  payment: PaymentInfo;
  items: InvoiceItem[];
  metadata: InvoiceMetadata;
  totals: {
    totalDiscount: number;
    totalTax: number;
    total: number;
    totalUSD: number;
  };
}

export const generateInvoiceNumber = (prefix: string = "INV"): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

export const formatUSDAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCryptoAmount = (
  amount: number,
  currency: string,
): string => {
  return `${amount} ${currency}`;
};

export const formatInvoiceDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export interface CreateInvoiceParams {
  company: CompanyInfo;
  buyer: InvoiceBuyerInfo;
  payment: PaymentInfo;
  items: InvoiceItem[];
  totals: {
    totalDiscount: number;
    totalTax: number;
    total: number;
    totalUSD: number;
  };
  metadata?: Partial<InvoiceMetadata>;
}

export const createInvoice = (params: CreateInvoiceParams): InvoiceData => {
  const metadata: InvoiceMetadata = {
    invoiceNumber: params.metadata?.invoiceNumber || generateInvoiceNumber(),
    issueDate: new Date(),
    ...params.metadata,
  };

  const invoice: InvoiceData = {
    metadata,
    company: params.company,
    buyer: params.buyer,
    payment: params.payment,
    items: params.items,
    totals: params.totals,
  };

  return invoice;
};

export const InvoiceUtils = {
  createInvoice,
  generateInvoiceNumber,
  formatUSDAmount,
  formatCryptoAmount,
  formatInvoiceDate,
} as const;
