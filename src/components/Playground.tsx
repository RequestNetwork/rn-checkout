"use client";

import { PropsValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import PaymentWidget from "@requestnetwork/payment-widget/react";
import { CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { CurrencyCombobox } from "./ui/combobox";
import { Error } from "./ui/error";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { ZERO_ADDRESS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./ui/section-header";
import { Tabs } from "./ui/custom-tabs";

export const Playground = () => {
  // Tabs
  const tabs = [
    { label: "Customize Widget", value: "customize" },
    { label: "Seller Billing Info", value: "seller" },
    { label: "Buyer Billing Info", value: "buyer" },
  ];

  // Form state
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof PropsValidation>>({
    resolver: zodResolver(PropsValidation),
    mode: "onChange",
    defaultValues: {
      amountInUSD: 0,
      supportedCurrencies: [],
      sellerAddress: "",
      sellerInfo: {},
      buyerInfo: {},
      invoiceNumber: "",
      enableBuyerInfo: true,
      feeAddress: ZERO_ADDRESS,
      feeAmount: 0,
    },
  });

  const formValues = watch();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const generateIntegrationCode = () => {
    const props = [
      `amountInUSD={${formValues.amountInUSD || 0}}`,
      formValues.sellerInfo &&
        Object.keys(formValues.sellerInfo).length > 0 &&
        `sellerInfo={${JSON.stringify(formValues.sellerInfo, null, 2)}}`,

      formValues.buyerInfo &&
        Object.keys(formValues.buyerInfo).length > 0 &&
        `buyerInfo={${JSON.stringify(formValues.buyerInfo, null, 2)}}`,
      (formValues.productInfo?.name ||
        formValues.productInfo?.description ||
        formValues.productInfo?.image) &&
        `productInfo={{
        ${formValues.productInfo?.name ? `name: "${formValues.productInfo.name}",` : ""}
        ${formValues.productInfo?.description ? `description: "${formValues.productInfo.description}",` : ""}
        ${formValues.productInfo?.image ? `image: "${formValues.productInfo.image}",` : ""}
      }}`,
      formValues.sellerAddress && `sellerAddress="${formValues.sellerAddress}"`,
      formValues.supportedCurrencies?.length &&
        `supportedCurrencies={${JSON.stringify(formValues.supportedCurrencies)}}`,
      formValues.invoiceNumber && `invoiceNumber="${formValues.invoiceNumber}"`,
      formValues.feeAddress &&
        formValues.feeAddress !== ZERO_ADDRESS &&
        `feeAddress="${formValues.feeAddress}"`,
      formValues.feeAmount && `feeAmountInUSD={${formValues.feeAmount}}`,
    ]
      .filter(Boolean)
      .join("\n      ");

    return `import PaymentWidget from "@requestnetwork/payment-widget/react";

const YourComponent = () => {
  return (
    <PaymentWidget
      ${props}
    />
  );
};`;
  };

  const integrationCode = generateIntegrationCode();

  const copyToClipboard = () => {
    if (codeRef.current) {
      const textArea = document.createElement("textarea");
      textArea.value = integrationCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    if (formValues.feeAddress?.length === 0) {
      setValue("feeAddress", ZERO_ADDRESS);
      setValue("feeAmount", 0);
    }
  }, [formValues.feeAddress, formValues.feeAmount]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <section className="flex flex-col gap-6 lg:gap-4 items-center md:items-start md:justify-between lg:flex-row">
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <Tabs defaultValue="customize">
            <Tabs.List tabs={tabs} />
            <Tabs.Section value="customize">
              <section className="flex flex-col gap-4">
                <SectionHeader title="payment details" />

                <div className="flex flex-col gap-4">
                  {/* Seller Address */}
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center">
                      Seller address
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      placeholder="0x1234567890123456789012345678901234567890"
                      {...register("sellerAddress")}
                      className={cn(
                        "border-2",
                        errors.sellerAddress
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                    {errors.sellerAddress?.message && (
                      <Error>{errors.sellerAddress.message}</Error>
                    )}
                  </div>
                  {/* Currencies */}
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center">
                      Currencies
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <CurrencyCombobox
                      register={register}
                      name="supportedCurrencies"
                      className={cn(
                        "border-2 w-full",
                        errors.supportedCurrencies
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {formValues.supportedCurrencies?.map((currency) => {
                        return (
                          <div
                            key={currency}
                            className="bg-slate-100 rounded-lg p-2 flex items-center justify-center text-[9px]"
                          >
                            {currency}
                          </div>
                        );
                      })}
                    </div>
                    {errors.supportedCurrencies?.message && (
                      <Error>{errors.supportedCurrencies.message}</Error>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Amount in USD */}
                    <div className="flex flex-col gap-2 w-1/2">
                      <Label className="flex items-center">
                        Amount in USD
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        placeholder="25.55"
                        {...register("amountInUSD", {
                          valueAsNumber: true,
                        })}
                        className={cn(
                          "border-2",
                          errors.amountInUSD
                            ? "border-red-500"
                            : "border-gray-200"
                        )}
                      />
                      {errors.amountInUSD?.message && (
                        <Error>{errors.amountInUSD.message}</Error>
                      )}
                    </div>
                    {/* Invoice Number */}
                    <div className="flex flex-col gap-2 w-1/2">
                      <Label>Invoice Number</Label>
                      <Input
                        placeholder="INV-001"
                        {...register("invoiceNumber")}
                      />
                      {errors.invoiceNumber?.message && (
                        <Error>{errors.invoiceNumber.message}</Error>
                      )}
                    </div>
                  </div>
                  {/* Fee */}
                  <div className="flex flex-col gap-2">
                    <Label>Fee Address</Label>
                    <Input
                      placeholder="0x1234567890123456789012345678901234567890"
                      {...register("feeAddress")}
                    />
                    {errors.feeAddress?.message && (
                      <Error>{errors.feeAddress.message}</Error>
                    )}
                    <Label>Fee Amount in USD</Label>
                    <Input
                      placeholder="25.55"
                      {...register("feeAmount", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.feeAmount?.message && (
                      <Error>{errors.feeAmount.message}</Error>
                    )}
                  </div>
                  <SectionHeader title="branding & product details" />

                  {/* Seller Name */}
                  <div className="flex flex-col gap-2">
                    <Label>Seller name</Label>
                    <Input
                      placeholder="Request Network"
                      {...register("sellerInfo.name")}
                    />
                    {errors.sellerInfo?.name?.message && (
                      <Error>{errors.sellerInfo.name.message}</Error>
                    )}
                  </div>
                  {/* Seller Logo */}
                  <div className="flex flex-col gap-2">
                    <Label>Seller Logo</Label>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...register("sellerInfo.logo")}
                    />
                    {errors.sellerInfo?.logo?.message && (
                      <Error>{errors.sellerInfo.logo.message}</Error>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col gap-2">
                    <Label>Product name</Label>
                    <Input
                      placeholder="Request Network"
                      {...register("productInfo.name")}
                    />
                    {errors.productInfo?.name?.message && (
                      <Error>{errors.productInfo.name.message}</Error>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Product image</Label>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...register("productInfo.image")}
                    />
                    {errors.productInfo?.image?.message && (
                      <Error>{errors.productInfo.image.message}</Error>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Product description</Label>
                    <Textarea
                      placeholder="Description..."
                      {...register("productInfo.description")}
                    />
                    {errors.productInfo?.description?.message && (
                      <Error>{errors.productInfo.description.message}</Error>
                    )}
                  </div>
                </div>
              </section>
            </Tabs.Section>
            <Tabs.Section value="seller">
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <SectionHeader title="business information" />
                  <div className="flex flex-col gap-2">
                    <Label>Tax Number</Label>
                    <Input
                      placeholder="ACME1234567"
                      {...register("sellerInfo.taxRegistration")}
                    />
                  </div>
                </div>
                <SectionHeader title="personal contact information" />
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="John"
                      {...register("sellerInfo.firstName")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Doe"
                      {...register("sellerInfo.lastName")}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="seller@example.com"
                    {...register("sellerInfo.email")}
                  />
                  {errors.sellerInfo?.email?.message && (
                    <Error>{errors.sellerInfo.email.message}</Error>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1234567890"
                    {...register("sellerInfo.phone")}
                  />
                </div>
                <SectionHeader title="address details" />
                <div className="flex flex-col gap-2">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="123 Main St"
                    {...register("sellerInfo.address.street-address")}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>City</Label>
                    <Input
                      placeholder="New York"
                      {...register("sellerInfo.address.locality")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>State/Province</Label>
                    <Input
                      placeholder="NY"
                      {...register("sellerInfo.address.region")}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Postal Code</Label>
                    <Input
                      placeholder="10001"
                      {...register("sellerInfo.address.postal-code")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Country</Label>
                    <Input
                      placeholder="USA"
                      {...register("sellerInfo.address.country-name")}
                    />
                  </div>
                </div>
              </section>
            </Tabs.Section>
            <Tabs.Section value="buyer">
              <section className="flex flex-col gap-4">
                <SectionHeader title="business information" />
                <div className="flex flex-col gap-2">
                  <Label>Business Name</Label>
                  <Input
                    placeholder="XYZ Corp"
                    {...register("buyerInfo.businessName")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Tax Number</Label>
                  <Input
                    placeholder="ACME1234567"
                    {...register("buyerInfo.taxRegistration")}
                  />
                </div>
                <SectionHeader title="personal contact information" />
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Jane"
                      {...register("buyerInfo.firstName")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Smith"
                      {...register("buyerInfo.lastName")}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="buyer@example.com"
                    {...register("buyerInfo.email")}
                  />
                  {errors.buyerInfo?.email?.message && (
                    <Error>{errors.buyerInfo.email.message}</Error>
                  )}
                </div>
                <SectionHeader title="address details" />
                <div className="flex flex-col gap-2">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="456 Elm St"
                    {...register("buyerInfo.address.street-address")}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>City</Label>
                    <Input
                      placeholder="Los Angeles"
                      {...register("buyerInfo.address.locality")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>State/Province</Label>
                    <Input
                      placeholder="CA"
                      {...register("buyerInfo.address.region")}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Postal Code</Label>
                    <Input
                      placeholder="90001"
                      {...register("buyerInfo.address.postal-code")}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label>Country</Label>
                    <Input
                      placeholder="USA"
                      {...register("buyerInfo.address.country-name")}
                    />
                  </div>
                </div>
              </section>
            </Tabs.Section>
          </Tabs>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <h2 className="font-semibold">Preview</h2>
          <PaymentWidget
            amountInUSD={formValues.amountInUSD || 0}
            sellerInfo={formValues.sellerInfo}
            buyerInfo={formValues.buyerInfo}
            productInfo={{
              description: formValues.productInfo?.description,
              image: formValues.productInfo?.image,
              name: formValues.productInfo?.name,
            }}
            enableBuyerInfo={formValues.enableBuyerInfo}
            builderId={process.env.NEXT_PUBLIC_BUILDER_ID}
            sellerAddress={formValues.sellerAddress}
            // @ts-ignore
            supportedCurrencies={formValues.supportedCurrencies}
            invoiceNumber={formValues.invoiceNumber}
            feeAddress={
              formValues.feeAddress && formValues.feeAddress.length > 0
                ? formValues.feeAddress
                : ZERO_ADDRESS
            }
            feeAmountInUSD={
              formValues.feeAddress &&
              formValues.feeAddress.length > 0 &&
              formValues.feeAddress !== ZERO_ADDRESS
                ? formValues.feeAmount
                : 0
            }
          />
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
                "npm install @requestnetwork/payment-widget"
              );
            }}
          >
            <CopyIcon size={16} />
            Copy
          </Button>
        </div>
        <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto">
          <code className="language-jsx">
            npm install @requestnetwork/payment-widget
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
  );
};
