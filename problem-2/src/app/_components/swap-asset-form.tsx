"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";

const SwapAssetFormSchema = z.object({
  sendCurrency: z.string(),
  sendAmount: z.coerce.number({
    invalid_type_error: "Currency must be a number!",
  }),
  receiveAmount: z.coerce.number({
    invalid_type_error: "Currency must be a number!",
  }),
  receiveCurrency: z.string(),
});
import { useDebounceCallback } from "usehooks-ts";
import { useCallback } from "react";
import { TokenSelect } from "./token-select";
import { TokenInfo } from "~/types/token";

export function SwapAssetForm({ infos }: { infos: TokenInfo[] }) {
  const form = useForm<z.infer<typeof SwapAssetFormSchema>>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SwapAssetFormSchema),
    defaultValues: {
      sendCurrency: infos[0].currency,
      sendAmount: 0,
      receiveCurrency: infos[0].currency,
      receiveAmount: 0,
    },
  });

  const handleSwap = useCallback(
    ({
      type,
      value,
    }: {
      type: "sendAmount" | "receiveAmount";
      value:
        | z.infer<typeof SwapAssetFormSchema>["sendAmount"]
        | z.infer<typeof SwapAssetFormSchema>["receiveAmount"];
    }) => {
      const sendCurrency = form.getValues("sendCurrency");
      const receiveCurrency = form.getValues("receiveCurrency");

      const prices = new Map(
        infos.map(({ currency, price }) => [currency, price]),
      );

      if (sendCurrency === receiveCurrency) {
        form.setValue(
          type === "sendAmount" ? "receiveAmount" : "sendAmount",
          value,
        );
        return;
      }

      const sendPrice = prices.get(sendCurrency);
      if (!sendPrice) {
        form.setError("sendAmount", { message: "Invalid currency!" });
        return;
      }

      const receivePrice = prices.get(receiveCurrency);
      if (!receivePrice) {
        form.setError("receiveAmount", { message: "Invalid currency!" });
        return;
      }

      if (type === "sendAmount") {
        form.setValue("receiveAmount", (value / sendPrice) * receivePrice);
      } else {
        form.setValue("sendAmount", (value / receivePrice) * sendPrice);
      }
    },
    [infos, form],
  );

  const handleSwapDebounced = useDebounceCallback(handleSwap, 200);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Swap</CardTitle>
        <CardDescription>
          Input either the amount you want to send or the amount you want to
          receive to convert.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount-send">Amount to send</Label>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="sendCurrency"
                    render={({ field }) => (
                      <TokenSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        infos={infos}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sendAmount"
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          const parsed = z.coerce
                            .number()
                            .safeParse(e.target.value);

                          if (!parsed.success) {
                            return;
                          }

                          handleSwapDebounced({
                            type: "sendAmount",
                            value: parsed.data,
                          });
                        }}
                      />
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-red-500 text-xs text-right transition-[height] duration-200",
                    form.formState.errors["sendAmount"] ? "h-4" : "h-0",
                  )}
                >
                  {form.formState.errors["sendAmount"]?.message}
                </span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount-receive">Amount to receive</Label>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="receiveCurrency"
                    render={({ field }) => (
                      <TokenSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        infos={infos}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiveAmount"
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          const parsed = z.coerce
                            .number()
                            .safeParse(e.target.value);

                          if (!parsed.success) {
                            return;
                          }

                          handleSwapDebounced({
                            type: "receiveAmount",
                            value: parsed.data,
                          });
                        }}
                      />
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-red-500 text-xs text-right transition-[height] duration-200",
                    form.formState.errors["receiveAmount"] ? "h-4" : "h-0",
                  )}
                >
                  {form.formState.errors["receiveAmount"]?.message}
                </span>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
