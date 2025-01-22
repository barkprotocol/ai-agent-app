import React, { useEffect, useState } from 'react';
import { useWallet, WalletDisconnectedError } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';

const WalletConnectionComponent = () => {
  const { connect, disconnect, connected, publicKey, sendTransaction, connection } = useWallet();
  const [isError, setIsError] = useState(false);
  const [isTransactionError, setIsTransactionError] = useState(false);

  useEffect(() => {
    if (!connected) {
      setIsError(true); // Wallet is disconnected, show error
    } else {
      setIsError(false); // Wallet connected, no error
    }
  }, [connected]);

  const handleConnect = async () => {
    try {
      await connect();
      setIsError(false); // Reset error if connection is successful
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsError(true); // Show error if connection fails
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      setIsError(false); // Reset error when disconnected
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleTransaction = async () => {
    if (!connected || !publicKey) return;

    try {
      // Example transaction, replace with actual logic
      const transaction = new Transaction(); // Replace with your own transaction logic
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      setIsTransactionError(false); // Reset transaction error if successful
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error instanceof WalletDisconnectedError) {
        alert("Wallet disconnected during transaction. Please reconnect.");
        setIsError(true); // Handle disconnection during transaction
        setIsTransactionError(true);
      }
    }
  };

  return (
    <div>
      {isError && !isTransactionError && (
        <p className="error-message">Wallet disconnected or error occurred. Please reconnect.</p>
      )}

      {isTransactionError && (
        <p className="error-message">Transaction failed due to wallet disconnection. Please reconnect.</p>
      )}

      {!connected ? (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Connected with: {publicKey?.toBase58()}</p>
          <Button onClick={handleTransaction}>Send Transaction</Button>
          <Button onClick={handleDisconnect}>Disconnect Wallet</Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectionComponent;
