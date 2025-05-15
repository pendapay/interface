"use client";
import { NextPage } from "next";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Home: NextPage = () => {
  const { address } = useAccount()
  const [balance, setBalance] = useState("$2.52");
  const [change, setChange] = useState("-$0.08");
  const [changePercentage, setChangePercentage] = useState("(-3.11%)");
  
  const tokens = [
    {
      symbol: "ETH",
      name: "Ether",
      balance: "0.001 ETH",
      dollarValue: "$2.52",
      priceChange: "-3.01%",
    }
  ];

  if (!address) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Wallet Address */}
      <div className="flex items-center gap-2 mb-6">
        <div className="text-gray-400 text-sm">
          0x704e...B4FB28
        </div>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
      </div>

      {/* Balance and Action Buttons in the same row */}
      <div className="flex items-start justify-between mb-8">
        {/* Left side: Balance */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-semibold">{balance}</h1>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-2.891 0-5.562-.879-7.78-2.38l-.14-.116C1.593 14.396.5 11.288.5 8c0-4.142 3.358-7.5 7.5-7.5 4.142 0 7.5 3.358 7.5 7.5 0 1.422-.394 2.753-1.068 3.886l-.196.347c-.05.09-.102.178-.154.266l4.277 4.277-1.42 1.42-3.064-3.064z" />
              </svg>
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {change} {changePercentage}
          </p>
        </div>
        
        {/* Right side: Action Buttons */}
        <div className="flex gap-3">
          <button className="flex flex-col items-center justify-center w-14">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v9.586L5.707 10.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 13.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs">Deposit</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs">Send</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs">Receive</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
            <span className="text-xs">Withdraw</span>
          </button>
        </div>
      </div>
      {/* Tokens Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-xl">Tokens</h2>
        </div>
        
        {/* Token List Header */}
        <div className="grid grid-cols-12 text-sm text-gray-400 mb-2 px-2">
          <div className="col-span-5">Token</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-3 text-right">Balance</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        
        {/* Token List */}
        {tokens.map((token, index) => (
          <div key={index} className="bg-gray-900 rounded-xl p-4 mb-2">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-5 flex items-center gap-3">
                <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <div className="text-red-500">{token.priceChange}</div>
              </div>
              <div className="col-span-3 text-right">
                <div>{token.dollarValue}</div>
                <div className="text-sm text-gray-400">{token.balance}</div>
              </div>
              <div className="col-span-2 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V6.414l-3.293 3.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;