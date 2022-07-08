import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis, isWeb3Enabled } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftmarketplace.json";
import nftAbi from "../constants/samplenft.json";
import { ethers } from "ethers";

export default function NFTBox({ price, nftAddress, tokenId, address, seller }) {
    const { isWeb3Enabled } = useMoralis();
    const [tokenURI, setTokenURI] = useState("");

    const {
        runContractFunction: getTokenURI,
        error,
        data,
    } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const _tokenURI = await getTokenURI();
        setTokenURI(_tokenURI);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    return <div>NFT Box {tokenURI}</div>;
}
