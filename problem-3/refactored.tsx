type BlockChain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

type Currency = string;

interface WalletBalance {
  blockchain: BlockChain;
  currency: Currency;
  amount: number;
}

interface FormattedWalletBalance {
  currency: Currency;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: BlockChain): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<Currency, number> = usePrices();

  const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          return 0;
        }
      })
      .map((balance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
        };
      });
  }, [balances]);

  // formattedBalances is declared but not used, furthermore it's should have been calculated in the useMemo above
  // put it outside the useMemo will lead to unnecessary re-calculation
  const formattedBalances = sortedBalances.map((balance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
