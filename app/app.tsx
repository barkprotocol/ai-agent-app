import { PrivyProvider } from "@privy-io/react-auth";
import { useEffect } from "react";

function AiApp({ Component, pageProps }) {
  useEffect(() => {
    // Any other necessary Privy SDK initialization, if needed
  }, []);

  // Use the environment variable for clientId
  const privyClientId = process.env.AI_NEXT_PUBLIC_PRIVY_CLIENT_ID;

  return (
    <PrivyProvider clientId={privyClientId}>
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default AiApp;
