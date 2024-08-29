"use client";

import { PropsValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import PaymentWidget from "@requestnetwork/payment-widget/react";
import { CopyIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { CurrencyCombobox } from "./ui/combobox";
import { Error } from "./ui/error";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export const Playground = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof PropsValidation>>({
    resolver: zodResolver(PropsValidation),
    mode: "onChange",
    defaultValues: {
      amountInUSD: 0,
      supportedCurrencies: [],
      sellerAddress: "",
    },
  });

  const formValues = watch();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const generateIntegrationCode = () => {
    const props = [
      `amountInUSD={${formValues.amountInUSD || 0}}`,
      formValues.sellerInfo?.name &&
        `sellerInfo={{
        name: "${formValues.sellerInfo.name}",
        ${formValues.sellerInfo?.logo ? `logo: "${formValues.sellerInfo.logo}",` : ""}
      }}`,
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

  return (
    <div className="flex flex-col gap-4 mt-4">
      <section className="flex flex-col items-center md:items-start md:justify-between md:flex-row">
        <div className="flex flex-col gap-4 w-1/2">
          {/* Seller Info */}
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
          {/* Seller Address */}
          <div className="flex flex-col gap-2">
            <Label>Seller address</Label>
            <Input
              placeholder="0x1234567890123456789012345678901234567890"
              {...register("sellerAddress")}
            />
            {errors.sellerAddress?.message && (
              <Error>{errors.sellerAddress.message}</Error>
            )}
          </div>

          {/* Amount in USD */}
          <div className="flex flex-col gap-2">
            <Label>Amount in USD</Label>
            <Input
              placeholder="25.55"
              {...register("amountInUSD", {
                valueAsNumber: true,
              })}
            />
            {errors.amountInUSD?.message && (
              <Error>{errors.amountInUSD.message}</Error>
            )}
          </div>

          {/* Curerncies */}
          <div className="flex flex-col gap-2">
            <Label>Currencies</Label>
            <CurrencyCombobox register={register} name="supportedCurrencies" />
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
          </div>
        </div>
        <PaymentWidget
          amountInUSD={formValues.amountInUSD || 0}
          sellerInfo={{
            name: formValues.sellerInfo?.name,
            logo: formValues.sellerInfo?.logo,
          }}
          productInfo={{
            description: formValues.productInfo?.description,
            image: formValues.productInfo?.image,
            name: formValues.productInfo?.name,
          }}
          builderId={process.env.NEXT_PUBLIC_BUILDER_ID}
          sellerAddress={formValues.sellerAddress}
          // @ts-ignore
          supportedCurrencies={formValues.supportedCurrencies}
        />
      </section>

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
