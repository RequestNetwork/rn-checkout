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
    watch,
  } = useFormContext<PlaygroundFormData>();

  const addressFields = watch([
    "receiptInfo.companyInfo.address.street",
    "receiptInfo.companyInfo.address.city",
    "receiptInfo.companyInfo.address.state",
    "receiptInfo.companyInfo.address.postalCode",
    "receiptInfo.companyInfo.address.country",
  ]);

  const hasAnyAddressField = addressFields.some(
    (field) => field && field.trim() !== "",
  );

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
          {...register("receiptInfo.companyInfo.name")}
          className={cn(
            "border-2",
            errors.receiptInfo?.companyInfo?.name ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.receiptInfo?.companyInfo?.name?.message && (
          <Error>{errors.receiptInfo.companyInfo.name.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tax ID</Label>
        <Input
          placeholder="ACME1234567"
          {...register("receiptInfo.companyInfo.taxId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          placeholder="company@example.com"
          {...register("receiptInfo.companyInfo.email")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Phone</Label>
        <Input
          placeholder="+1234567890"
          {...register("receiptInfo.companyInfo.phone")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Website</Label>
        <Input
          placeholder="https://example.com"
          {...register("receiptInfo.companyInfo.website")}
        />
      </div>

      <SectionHeader title="Company Address" />
      
      <div className="flex flex-col gap-2">
        <Label>
          Street Address
          {hasAnyAddressField && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          placeholder="123 Main St"
          {...register("receiptInfo.companyInfo.address.street", {
            required: hasAnyAddressField ? "Street address is required when any address field is filled" : false,
          })}
          className={cn(
            "border-2",
            errors.receiptInfo?.companyInfo?.address?.street ? "border-red-500" : "border-gray-200"
          )}
        />
        {errors.receiptInfo?.companyInfo?.address?.street?.message && (
          <Error>{errors.receiptInfo.companyInfo.address.street.message}</Error>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>
            City
            {hasAnyAddressField && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            placeholder="New York"
            {...register("receiptInfo.companyInfo.address.city", {
              required: hasAnyAddressField ? "City is required when any address field is filled" : false,
            })}
            className={cn(
              "border-2",
              errors.receiptInfo?.companyInfo?.address?.city ? "border-red-500" : "border-gray-200"
            )}
          />
          {errors.receiptInfo?.companyInfo?.address?.city?.message && (
            <Error>{errors.receiptInfo.companyInfo.address.city.message}</Error>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>
            State/Province
            {hasAnyAddressField && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            placeholder="NY"
            {...register("receiptInfo.companyInfo.address.state", {
              required: hasAnyAddressField ? "State is required when any address field is filled" : false,
            })}
            className={cn(
              "border-2",
              errors.receiptInfo?.companyInfo?.address?.state ? "border-red-500" : "border-gray-200"
            )}
          />
          {errors.receiptInfo?.companyInfo?.address?.state?.message && (
            <Error>{errors.receiptInfo.companyInfo.address.state.message}</Error>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>
            Zip Code
            {hasAnyAddressField && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            placeholder="10001"
            {...register("receiptInfo.companyInfo.address.postalCode", {
              required: hasAnyAddressField ? "Zip code is required when any address field is filled" : false,
            })}
            className={cn(
              "border-2",
              errors.receiptInfo?.companyInfo?.address?.postalCode ? "border-red-500" : "border-gray-200"
            )}
          />
          {errors.receiptInfo?.companyInfo?.address?.postalCode?.message && (
            <Error>{errors.receiptInfo.companyInfo.address.postalCode.message}</Error>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>
            Country
            {hasAnyAddressField && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            placeholder="USA"
            {...register("receiptInfo.companyInfo.address.country", {
              required: hasAnyAddressField ? "Country is required when any address field is filled" : false,
            })}
            className={cn(
              "border-2",
              errors.receiptInfo?.companyInfo?.address?.country ? "border-red-500" : "border-gray-200"
            )}
          />
          {errors.receiptInfo?.companyInfo?.address?.country?.message && (
            <Error>{errors.receiptInfo.companyInfo.address.country.message}</Error>
          )}
        </div>
      </div>
    </section>
  );
};