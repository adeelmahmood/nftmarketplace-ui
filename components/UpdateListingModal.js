import { useState } from "react";
import { Modal, Input } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftmarketplace.json";
import nftAbi from "../constants/samplenft.json";
import { ethers } from "ethers";

export default function UploadListingModal({ nftAddress, tokenId, address, isVisible, onClose }) {
    const [updatedPrice, setUpdatedPrice] = useState(0);

    const { runContractFunction: updateListingPrice } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: address,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(updatedPrice || "0"),
        },
    });

    return (
        <Modal
            isVisible={isVisible}
            onOk={() => {
                console.log(`about to update price to ${updatedPrice}`);
                updateListingPrice({
                    onError: (error) => console.log(error),
                    onSuccess: async (tx) => {
                        await tx.wait(1);
                        console.log("done");
                    },
                });
            }}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
        >
            <div className="p-5">
                <Input
                    label="Update listing price in ETH"
                    name="updated listing price"
                    type="number"
                    onChange={(event) => {
                        setUpdatedPrice(event.target.value);
                    }}
                />
            </div>
        </Modal>
    );
}
