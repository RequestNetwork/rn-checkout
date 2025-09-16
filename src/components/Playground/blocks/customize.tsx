"use client";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Error } from "../../ui/error";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { SectionHeader } from "../../ui/section-header";
import { useFormContext } from "react-hook-form";
import { PlaygroundFormData } from "@/lib/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import { useEffect } from "react";

export const CustomizeForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<PlaygroundFormData>();

  const formValues = watch();

  const addInvoiceItem = () => {
    const currentItems = formValues.receiptInfo.items;
    const newItem = {
      id: (currentItems.length + 1).toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      currency: "USD",
    };
    setValue("receiptInfo.items", [...currentItems, newItem]);
  };

  const removeInvoiceItem = (index: number) => {
    const currentItems = formValues.receiptInfo.items;
    if (currentItems.length > 1) {
      setValue("receiptInfo.items", currentItems.filter((_, i) => i !== index));
    }
  };

  const updateItemTotal = (index: number) => {
    const items = formValues.receiptInfo.items;
    const item = items[index];
    const total = item.quantity * item.unitPrice;
    setValue(`receiptInfo.items.${index}.total`, total);
  };

  // Auto-calculate totals when items change
  useEffect(() => {
    const items = formValues.receiptInfo.items;
    const subtotal = items.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const totalDiscount = items.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    const totalTax = items.reduce((sum, item) => sum + (item.tax || 0), 0);
    const total = subtotal - totalDiscount + totalTax;

    setValue("receiptInfo.totals", {
      totalDiscount,
      totalTax,
      total,
      totalUSD: total,
    });

    // Update the payment amount
    setValue("amountInUsd", total.toString());
  }, [formValues.receiptInfo.items, setValue]);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Payment Configuration" />

       <div className="flex flex-col gap-2">
        <Label className="flex items-center">
          Recipient Wallet Address
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          placeholder="0x1234567890123456789012345678901234567890"
          {...register("recipientWallet")}
          className={cn(
            "border-2",
            errors.recipientWallet ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.recipientWallet?.message && (
          <Error>{errors.recipientWallet.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex items-center">
          Network
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          value={formValues.paymentConfig.network}
          onValueChange={(value) => setValue("paymentConfig.network", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mainnet">Ethereum Mainnet</SelectItem>
            <SelectItem value="polygon">Polygon</SelectItem>
            <SelectItem value="arbitrum">Arbitrum</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="optimism">Optimism</SelectItem>
            <SelectItem value="sepolia">Sepolia (Testnet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex items-center">
          Request Network API Client ID
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          placeholder="your-api-client-id"
          {...register("paymentConfig.rnApiClientId")}
          className={cn(
            "border-2",
            errors.paymentConfig?.rnApiClientId ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.paymentConfig?.rnApiClientId?.message && (
          <Error>{errors.paymentConfig.rnApiClientId.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>WalletConnect Project ID (Optional)</Label>
        <Input
          placeholder="your-walletconnect-project-id"
          {...register("paymentConfig.walletConnectProjectId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Fee Address</Label>
        <Input
          placeholder="0x1234567890123456789012345678901234567890"
          {...register("paymentConfig.feeInfo.feeAddress")}
        />
        <Label>Fee Percentage</Label>
        <Input
          placeholder="2.5"
          {...register("paymentConfig.feeInfo.feePercentage")}
        />
      </div>

      <SectionHeader title="Invoice Items" />

      {formValues.receiptInfo.items.map((item, index) => (
        <div key={item.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Item {index + 1}</h4>
            {formValues.receiptInfo.items.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeInvoiceItem(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Service/Product description"
                {...register(`receiptInfo.items.${index}.description`)}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="1"
                {...register(`receiptInfo.items.${index}.quantity`, {
                  valueAsNumber: true,
                  onChange: () => updateItemTotal(index),
                })}
              />
            </div>
            <div>
              <Label>Unit Price (USD)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register(`receiptInfo.items.${index}.unitPrice`, {
                  valueAsNumber: true,
                  onChange: () => updateItemTotal(index),
                })}
              />
            </div>
            <div>
              <Label>Total</Label>
              <Input
                type="number"
                step="0.01"
                readOnly
                value={item.total || 0}
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addInvoiceItem}>
        Add Item
      </Button>

      <SectionHeader title="UI Configuration" />

      {/* UI Config */}
      <div className="flex items-center justify-between">
        <Label>Show Request Scan URL</Label>
        <Switch
          checked={formValues.uiConfig?.showRequestScanUrl || false}
          onCheckedChange={(checked) => setValue("uiConfig.showRequestScanUrl", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Show Invoice Download</Label>
        <Switch
          checked={formValues.uiConfig?.showReceiptDownload || false}
          onCheckedChange={(checked) => setValue("uiConfig.showReceiptDownload", checked)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Receipt Number</Label>
        <Input
          placeholder="INV-001"
          {...register("receiptInfo.invoiceNumber")}
        />
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${formValues.receiptInfo.totals.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${formValues.receiptInfo.totals.totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${formValues.receiptInfo.totals.totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${formValues.receiptInfo.totals.totalUSD.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};