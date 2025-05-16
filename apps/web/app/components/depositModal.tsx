"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { Address, isAddress } from "viem";

type TokenWithBalance = {
  symbol: string;
  name: string;
  address: Address;
  logo?: string;
  decimals: number;
  balance?: string;
  formattedBalance?: string;
};

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (tokenAddress: Address, amount: string) => Promise<void>;
  commonTokens: Array<{
    symbol: string;
    name: string;
    address: Address;
    logo?: string;
    decimals: number;
  }>;
};

const DepositModal = ({
  isOpen,
  onClose,
  onDeposit,
  commonTokens,
}: DepositModalProps) => {
  const [step, setStep] = useState<"selectToken" | "enterAmount">("selectToken");
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance | null>(null);
  const [customTokenAddress, setCustomTokenAddress] = useState<string>("");
  const [customTokenAddressError, setCustomTokenAddressError] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokensWithBalances, setTokensWithBalances] = useState<TokenWithBalance[]>([]);
  const { address } = useAccount();

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep("selectToken");
      setSelectedToken(null);
      setCustomTokenAddress("");
      setCustomTokenAddressError("");
      setAmount("");
      setAmountError("");
      setIsLoading(false);
      fetchTokenBalances();
    }
  }, [isOpen, address]);

  // Fetch token balances when modal opens
  const fetchTokenBalances = async () => {
    if (!address) return;
    
    try {
      const tokensWithBalances = await Promise.all(
        commonTokens.map(async (token) => {
          // Use wagmi's useBalance for each token
          try {
            // This would typically use a multicall pattern in production
            // For simplicity, we're making individual calls
            const balance = await fetchBalance(token.address, address);
            
            return {
              ...token,
              balance: balance.value?.toString() || "0",
              formattedBalance: balance.formatted || "0",
            };
          } catch (error) {
            console.error(`Error fetching balance for ${token.symbol}:`, error);
            return {
              ...token,
              balance: "0",
              formattedBalance: "0",
            };
          }
        })
      );
      
      setTokensWithBalances(tokensWithBalances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };
  
  // Mock function to fetch balance - replace with actual implementation
  // In a real app, use multicall for efficiency
  const fetchBalance = async (tokenAddress: Address, userAddress: Address) => {
    // This is a mock implementation - replace with actual contract calls
    // In a real application, use wagmi's useBalance hook or a direct contract call
    return {
      value: BigInt(Math.floor(Math.random() * 1000000)),
      formatted: (Math.random() * 10).toFixed(4),
      symbol: commonTokens.find(t => t.address === tokenAddress)?.symbol || "???"
    };
  };

  // Filter tokens based on search input
  const filteredTokens = useMemo(() => {
    if (!customTokenAddress) return tokensWithBalances;
    
    const searchTerm = customTokenAddress.toLowerCase();
    return tokensWithBalances.filter(
      token => 
        token.symbol.toLowerCase().includes(searchTerm) || 
        token.name.toLowerCase().includes(searchTerm) ||
        token.address.toLowerCase().includes(searchTerm)
    );
  }, [tokensWithBalances, customTokenAddress]);

  // Handle custom token address validation
  const validateCustomToken = () => {
    if (!customTokenAddress) {
      setCustomTokenAddressError("Please enter a token address");
      return false;
    }

    if (!isAddress(customTokenAddress)) {
      setCustomTokenAddressError("Invalid token address");
      return false;
    }

    setCustomTokenAddressError("");
    return true;
  };

  // Handle amount validation
  const validateAmount = () => {
    if (!amount) {
      setAmountError("Please enter an amount");
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError("Amount must be greater than 0");
      return false;
    }

    setAmountError("");
    return true;
  };

  // Handle token selection
  const handleSelectToken = (token: TokenWithBalance) => {
    setSelectedToken(token);
    setStep("enterAmount");
  };

  // Handle custom token addition
  const handleAddCustomToken = async () => {
    if (!validateCustomToken()) return;

    try {
      // First check if it's in our known tokens
      const existingToken = tokensWithBalances.find(
        token => token.address.toLowerCase() === customTokenAddress.toLowerCase()
      );
      
      if (existingToken) {
        handleSelectToken(existingToken);
        return;
      }
      
      // Otherwise fetch token info from the blockchain
      // For example using wagmi's useContractRead or a similar hook
      setIsLoading(true);
      
      // Mock implementation - replace with actual contract calls
      const newToken = {
        symbol: "CUSTOM",
        name: "Custom Token",
        address: customTokenAddress as Address,
        decimals: 18,
        balance: "0",
        formattedBalance: "0"
      };

      handleSelectToken(newToken);
    } catch (error) {
      setCustomTokenAddressError("Error loading token info");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit confirmation
  const handleConfirmDeposit = async () => {
    if (!validateAmount()) return;
    if (!selectedToken || !address) return;

    setIsLoading(true);
    try {
      await onDeposit(selectedToken.address, amount);
      onClose();
    } catch (error) {
      console.error("Deposit error:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">
            {step === "selectToken" ? "Select Token" : "Deposit"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        {step === "selectToken" ? (
          <>
            {/* Search/Custom token input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={customTokenAddress}
                  onChange={(e) => setCustomTokenAddress(e.target.value)}
                  placeholder="Search token or paste address"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />
                {isAddress(customTokenAddress) && (
                  <button
                    onClick={handleAddCustomToken}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Import
                  </button>
                )}
              </div>
              {customTokenAddressError && (
                <p className="text-red-500 text-xs mt-1">
                  {customTokenAddressError}
                </p>
              )}
            </div>
            
            {/* Tokens list with balances */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Tokens</p>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredTokens.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                      No tokens found
                    </div>
                  ) : (
                    filteredTokens.map((token) => (
                      <button
                        key={token.address}
                        onClick={() => handleSelectToken(token)}
                        className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-3 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {token.logo ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={token.logo}
                                alt={token.symbol}
                                width={32}
                                height={32}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {token.symbol.slice(0, 2)}
                              </span>
                            </div>
                          )}
                          <div className="text-left">
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-xs text-gray-400">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.formattedBalance}</p>
                          <p className="text-xs text-gray-400">{token.symbol}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Token info */}
            <div className="mb-6 flex items-center gap-3">
              {selectedToken?.logo ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={selectedToken.logo}
                    alt={selectedToken.symbol}
                    width={40}
                    height={40}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-md font-medium">
                    {selectedToken?.symbol.slice(0, 2)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-lg">{selectedToken?.symbol}</p>
                <p className="text-sm text-gray-400">{selectedToken?.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-medium">{selectedToken?.formattedBalance} {selectedToken?.symbol}</p>
                <button
                  onClick={() => setStep("selectToken")}
                  className="text-blue-500 hover:text-blue-400 text-sm"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-400 text-sm">Amount</label>
                {selectedToken?.formattedBalance && (
                  <button 
                    className="text-blue-500 text-xs"
                    onClick={() => setAmount(selectedToken.formattedBalance || "")}
                  >
                    MAX
                  </button>
                )}
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {amountError && (
                <p className="text-red-500 text-xs mt-1">{amountError}</p>
              )}
            </div>

            {/* Deposit button */}
            <button
              onClick={handleConfirmDeposit}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg py-3 font-medium transition-colors"
            >
              {isLoading ? "Processing..." : "Confirm Deposit"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositModal;