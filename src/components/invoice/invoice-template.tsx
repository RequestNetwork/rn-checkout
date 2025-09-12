import type { FC } from "react";
import {
  formatCryptoAmount,
  formatUSDAmount,
  formatInvoiceDate,
  type InvoiceData,
} from "@/lib/invoice";
import "./styles.css";

export const InvoicePDFTemplate: FC<{ invoice: InvoiceData }> = ({
  invoice,
}) => {
  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="company-info">
          <h1 className="company-name">{invoice.company.name}</h1>
          <div className="company-details">
            <div>{invoice.company.address.street}</div>
            <div>
              {invoice.company.address.city}, {invoice.company.address.state}{""}
              {invoice.company.address.zipCode}
            </div>
            {invoice.company.email && <div>{invoice.company.email}</div>}
            <div>Tax ID: {invoice.company.taxId}</div>
          </div>
        </div>

        <div className="invoice-title-section">
          <h2 className="invoice-title">INVOICE</h2>
          <div className="invoice-number">
            #{invoice.metadata.invoiceNumber}
          </div>
          <div className="invoice-date">
            {formatInvoiceDate(invoice.metadata.issueDate)}
          </div>
        </div>
      </div>

      <div className="party-info-section">
        <div className="info-box">
          <h3 className="info-header">FROM</h3>
          <div className="party-name">{invoice.company.name}</div>
          <div className="wallet-address">{invoice.company.walletAddress}</div>
          <div className="address-info">
            <div>{invoice.company.address.street}</div>
            <div>
              {invoice.company.address.city}, {invoice.company.address.state}{""}
              {invoice.company.address.zipCode}
            </div>
          </div>
        </div>

        <div className="info-box">
          <h3 className="info-header">TO</h3>
          <div className="party-name">
            {[invoice.buyer.firstName, invoice.buyer.lastName]
              .filter(Boolean)
              .join("") || "Customer"}
          </div>
          <div className="wallet-address">{invoice.buyer.walletAddress}</div>
          {invoice.buyer.email && (
            <div className="email">{invoice.buyer.email}</div>
          )}
          {invoice.buyer.streetAddress && (
            <div className="address-info">
              <div>{invoice.buyer.streetAddress}</div>
              <div>
                {invoice.buyer.city}, {invoice.buyer.state}{""}
                {invoice.buyer.postalCode}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="payment-info">
        <div>
          <strong>Payment Method:</strong>{""}
          <span>{`${invoice.payment.currency} on ${invoice.payment.chain}`}</span>
        </div>
        {invoice.payment.transactionHash && (
          <div className="transaction-hash">
            <strong>Transaction:</strong> {invoice.payment.transactionHash}
          </div>
        )}
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="center">Qty</th>
            <th className="right">Unit Price</th>
            <th className="center">Disc%</th>
            <th className="center">Tax%</th>
            <th className="right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "row-even" : "row-odd"}
            >
              <td>{item.description}</td>
              <td className="center">{item.quantity}</td>
              <td className="right">
                {formatCryptoAmount(
                  item.unitPrice,
                  item.currency || invoice.payment.currency,
                )}
              </td>
              <td className="center">{item.discount || 0}%</td>
              <td className="center">{item.tax || 0}%</td>
              <td className="right amount">
                {formatCryptoAmount(
                  item.total,
                  item.currency || invoice.payment.currency,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-section">
        <div className="totals-box">
          {invoice.totals.totalDiscount > 0 && (
            <div className="total-line">
              <span>Discount:</span>
              <span className="total-amount">
                -
                {formatCryptoAmount(
                  invoice.totals.totalDiscount,
                  invoice.payment.currency,
                )}
              </span>
            </div>
          )}

          {invoice.totals.totalTax > 0 && (
            <div className="total-line">
              <span>Tax:</span>
              <span className="total-amount">
                {formatCryptoAmount(
                  invoice.totals.totalTax,
                  invoice.payment.currency,
                )}
              </span>
            </div>
          )}

          <div className="total-line subtotal">
            <span>Subtotal:</span>
            <span className="total-amount">
              {formatCryptoAmount(
                invoice.totals.total,
                invoice.payment.currency,
              )}
            </span>
          </div>

          <div className="total-line final">
            <span>TOTAL (USD):</span>
            <span className="total-amount">
              {formatUSDAmount(invoice.totals.totalUSD)}
            </span>
          </div>
        </div>
      </div>

      {invoice.metadata.notes && (
        <div className="notes-section">
          <strong>Notes:</strong> {invoice.metadata.notes}
        </div>
      )}
    </div>
  );
};
