interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // blockchain should be type accordingly, avoid using `any` in typescript
  // furthermore, this function should be moved outside the component to avoid re-calculation and keep the component clean
  const getPriority = (blockchain: any): number => {
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

  const sortedBalances = useMemo(() => {
    return (
      balances
        // No need to force type in each iteration, it's could be defined in the source data
        .filter((balance: WalletBalance) => {
          // balance.blockchain isn't exist in the WalletBalance interface
          const balancePriority = getPriority(balance.blockchain);
          // lhsPriority isn't exist in the scope, it should be balancePriority
          if (lhsPriority > -99) {
            if (balance.amount <= 0) {
              return true;
            }
          }
          return false;
        })
        // No need to force type in each iteration, it's could be defined in the source data
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          // lhs.blockchain isn't exist in the WalletBalance interface
          const leftPriority = getPriority(lhs.blockchain);
          // rhs.blockchain isn't exist in the WalletBalance interface
          const rightPriority = getPriority(rhs.blockchain);
          if (leftPriority > rightPriority) {
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
          // missing case for 0
        })
    );
    // this useMemo hook have prices in the dependency array, but it's not used in the function
  }, [balances, prices]);

  // formattedBalances is declared but not used, furthermore it's should have been calculated in the useMemo above
  // put it outside the useMemo will lead to unnecessary re-calculation
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // index should not be used as key, we can assume that the currency is unique, so we should use it as key
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    },
  );

  return <div {...rest}>{rows}</div>;
};
