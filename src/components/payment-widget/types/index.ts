export interface FeeInfo {
  feePercentage: string;
  feeAddress: string;
}

export interface PaymentError {
  type: "wallet" | "transaction" | "api" | "unknown";
  error: Error;
}

export interface Transaction {
  to: string;
  data: string;
  value: { hex: string };
}

export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
  currency?: string;
}

export interface CompanyInfo {
  name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface BuyerInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface ReceiptTotals {
  totalDiscount: number;
  totalTax: number;
  total: number;
  totalUSD: number;
}

export interface ReceiptInfo {
  buyerInfo?: BuyerInfo;
  companyInfo: CompanyInfo;
  items: ReceiptItem[];
  totals: ReceiptTotals;
  receiptNumber?: string;
}
