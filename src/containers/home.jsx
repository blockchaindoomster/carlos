import { useState, useEffect } from "react";
import { ethers, BigNumber } from 'ethers'
import { contractAddress } from '../constants/address';
import { connectWallet, getCurrentWalletConnected, getContract } from '../utils/interact';
import { Intro } from "../components/intro";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setMintLoading] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokenPrice, setTokenPrice] = useState("");
  const [maxTokenPurchase, setMaxTokenPurchase] = useState(30);

  useEffect(() => {
      ( async () => {
        const { address, status } = await getCurrentWalletConnected()
        setWalletAddress(address)
        setStatus(status)
      })();
  }, [])

  useEffect(() => {
    ( async () => {
      if ( !loading ) {
        let contract = getContract()
        let res = await contract.totalSupply()
        setTotalSupply( parseInt(BigNumber.from(res).toString()) )
      }
    })();
  }, [loading, walletAddress])  

  useEffect(() => {
    if (status) {
      setStatus(null)
    }
  }, [status])


  const onClickConnectWallet = async (event) => {
    event.preventDefault();
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWalletAddress(walletResponse.address);
  }

  const onClickDisconnectWallet = async (event) => {
    event.preventDefault();
    setWalletAddress(null)
  }

  return (
    <div>
      <Intro onClickDisconnectWallet={onClickDisconnectWallet} onClickConnectWallet={onClickConnectWallet} totalSupply={totalSupply} maxTokenPurchase={maxTokenPurchase} maxTokens={maxTokens} 
          loading={loading} walletAddress={walletAddress} setStatus={setStatus} setMintLoading={setMintLoading} tokenPrice={tokenPrice} />
    </div>
  );
};

export default Home;
