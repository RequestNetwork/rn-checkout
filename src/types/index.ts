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

export interface InvoiceItem {
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
  walletAddress: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  taxId: string;
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
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface InvoiceTotals {
  totalDiscount: number;
  totalTax: number;
  total: number;
  totalUSD: number;
}

export interface InvoiceInfo {
  buyerInfo?: BuyerInfo;
  companyInfo: CompanyInfo;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  invoiceNumber?: string;
}
