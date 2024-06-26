"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { TokenInfo } from "~/types/token";
import { icons } from "~/components/icons";

export function TokenSelect({
  infos,
  ...props
}: SelectProps & { infos: TokenInfo[] }) {
  const uniqueCurrencies = Array.from(
    new Set(infos.map((info) => info.currency)),
  );
  return (
    <Select {...props}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent className="w-[200px]">
        {uniqueCurrencies.map((currency) => {
          return (
            <SelectItem key={currency} value={currency}>
              <div className="flex items-center gap-2">
                {/* @ts-ignore */}
                {icons[currency.toUpperCase()] ?? null}
                {currency}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
