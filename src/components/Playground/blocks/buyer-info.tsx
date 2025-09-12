"use client";

import { Error } from "../../ui/error";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { SectionHeader } from "../../ui/section-header";
import { useFormContext } from "react-hook-form";
import { PlaygroundFormData } from "@/lib/validation";

export const BuyerForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlaygroundFormData>();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Buyer Information" />
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>First Name</Label>
          <Input
            placeholder="Jane"
            {...register("invoiceInfo.buyerInfo.firstName")}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Last Name</Label>
          <Input
            placeholder="Smith"
            {...register("invoiceInfo.buyerInfo.lastName")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Business Name</Label>
        <Input
          placeholder="XYZ Corp"
          {...register("invoiceInfo.buyerInfo.businessName")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          placeholder="buyer@example.com"
          {...register("invoiceInfo.buyerInfo.email")}
        />
        {errors.invoiceInfo?.buyerInfo?.email?.message && (
          <Error>{errors.invoiceInfo.buyerInfo.email.message}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Phone</Label>
        <Input
          placeholder="+1234567890"
          {...register("invoiceInfo.buyerInfo.phone")}
        />
      </div>

      <SectionHeader title="Buyer Address" />
      
      <div className="flex flex-col gap-2">
        <Label>Street Address</Label>
        <Input
          placeholder="456 Elm St"
          {...register("invoiceInfo.buyerInfo.streetAddress")}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>City</Label>
          <Input
            placeholder="Los Angeles"
            {...register("invoiceInfo.buyerInfo.city")}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>State/Province</Label>
          <Input
            placeholder="CA"
            {...register("invoiceInfo.buyerInfo.state")}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Postal Code</Label>
          <Input
            placeholder="90001"
            {...register("invoiceInfo.buyerInfo.postalCode")}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Country</Label>
          <Input
            placeholder="USA"
            {...register("invoiceInfo.buyerInfo.country")}
          />
        </div>
      </div>
    </section>
  );
};