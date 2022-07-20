import styles from "../styles/Home.module.css";
import { Form } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftmarketplace.json";
import nftAbi from "../constants/samplenft.json";
import { ethers } from "ethers";
import contracts from "../constants/contract.json";

export default function SellNft() {
    const { chainId } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = contracts[chainIdString].NFTMarketplace[0];

    const { runContractFunction } = useWeb3Contract();

    async function approveAndList(data) {
        console.log(`approving nft ${nftAddress} for marketplace ${marketplaceAddress}`);
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString();

        const approveOpts = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        };

        await runContractFunction({
            params: approveOpts,
            onSuccess: handleApproveSuccess(nftAddress, tokenId, price),
            onError: (e) => console.log(e),
        });
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Listing...");
        const listOpts = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        };

        await runContractFunction({
            params: listOpts,
            onSuccess: async (tx) => {
                await tx.wait(1);
                console.log("Listed successfully");
            },
            onError: (e) => console.log(e),
        });
    }

    return (
        <div className={styles.container}>
            <Form
                title="Sell Your NFT"
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        value: "",
                        inputWidth: "50%",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "text",
                        value: "",
                        inputWidth: "50%",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        inputWidth: "50%",
                        key: "price",
                    },
                ]}
            />
        </div>
    );
}
