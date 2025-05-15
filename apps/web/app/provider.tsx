"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { AppProgressBar } from "next-nprogress-bar";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { holesky } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Pendapay",
  projectId: "YOUR_PROJECT_ID",
  chains: [holesky],
  ssr: true,
});

const client = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
      <AppProgressBar
        color="#ffffff"
        height="2px"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </WagmiProvider>
  );
};

export default Provider;
