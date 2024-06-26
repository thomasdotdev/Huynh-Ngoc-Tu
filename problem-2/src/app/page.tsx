import { SwapAssetForm } from "./_components/swap-asset-form";

export default async function Home() {
  const response = await fetch("https://interview.switcheo.com/prices.json", {
    method: "GET",
  });

  const infos = await response.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SwapAssetForm infos={infos} />
    </main>
  );
}
