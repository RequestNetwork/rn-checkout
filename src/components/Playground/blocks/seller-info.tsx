"use client";

import { Error } from "../../ui/error";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { SectionHeader } from "../../ui/section-header";
import { useFormContext } from "react-hook-form";
import { PlaygroundFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const SellerForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlaygroundFormData>();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Company Information" />
      
      <div className="flex flex-col gap-2">
        <Label className="flex items-center">
          Company Name
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          placeholder="ACME Corp"
          {...register("invoiceInfo.companyInfo.name")}
          className={cn(
            "border-2",
            errors.invoiceInfo?.companyInfo?.name ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.invoiceInfo?.companyInfo?.name?.message && (
          <Error>{errors.invoiceInfo.companyInfo.name.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="flex items-center">
          Wallet Address
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          placeholder="0x1234567890123456789012345678901234567890"
          {...register("invoiceInfo.companyInfo.walletAddress")}
          className={cn(
            "border-2",
            errors.invoiceInfo?.companyInfo?.walletAddress ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.invoiceInfo?.companyInfo?.walletAddress?.message && (
          <Error>{errors.invoiceInfo.companyInfo.walletAddress.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tax ID</Label>
        <Input
          placeholder="ACME1234567"
          {...register("invoiceInfo.companyInfo.taxId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          placeholder="company@example.com"
          {...register("invoiceInfo.companyInfo.email")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Phone</Label>
        <Input
          placeholder="+1234567890"
          {...register("invoiceInfo.companyInfo.phone")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Website</Label>
        <Input
          placeholder="https://example.com"
          {...register("invoiceInfo.companyInfo.website")}
        />
      </div>

      <SectionHeader title="Company Address" />
      
      <div className="flex flex-col gap-2">
        <Label>Street Address</Label>
        <Input
          placeholder="123 Main St"
          {...register("invoiceInfo.companyInfo.address.street")}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>City</Label>
          <Input
            placeholder="New York"
            {...register("invoiceInfo.companyInfo.address.city")}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>State/Province</Label>
          <Input
            placeholder="NY"
            {...register("invoiceInfo.companyInfo.address.state")}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Zip Code</Label>
          <Input
            placeholder="10001"
            {...register("invoiceInfo.companyInfo.address.zipCode")}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Country</Label>
          <Input
            placeholder="USA"
            {...register("invoiceInfo.companyInfo.address.country")}
          />
        </div>
      </div>
    </section>
  );
};