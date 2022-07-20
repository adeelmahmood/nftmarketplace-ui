import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftmarketplace.json";
import nftAbi from "../constants/samplenft.json";
import { ethers } from "ethers";
import Image from "next/image";
import { Card } from "web3uikit";
import UploadListingModal from "./UpdateListingModal";

export default function NFTBox({ price, nftAddress, tokenId, address, seller }) {
    const { isWeb3Enabled, account } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const isOwnedByUser = seller == account || seller === undefined;
    const sellerPersonalized = isOwnedByUser ? "You" : trimAddress(seller);

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: address,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        console.log(`tokenURI ${tokenURI}`);
        if (tokenURI) {
            const requestURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenURIResponse = await (await fetch(requestURI)).json();
            const image = tokenURIResponse.image;
            const _imageURL = image.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageURI(_imageURL);
            console.log(`_imageURL ${imageURI}`);

            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
        }
    }

    function trimAddress(address) {
        return address.substring(0, 6) + "..." + address.substring(address.length - 8);
    }

    const handleCardClick = () => {
        isOwnedByUser
            ? setModalVisible(true)
            : buyItem({
                  onSuccess: async (tx) => {
                      await tx.wait(1);
                      console.log("Item bought");
                  },
                  onError: (error) => console.log(error),
              });
    };

    const onClose = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UploadListingModal
                            isVisible={modalVisible}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            address={address}
                            onClose={onClose}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-center gap-2">
                                    <div># {tokenId}</div>
                                    <div>Owned by {sellerPersonalized}</div>
                                    <Image
                                        src={imageURI}
                                        loader={() => imageURI}
                                        width="200"
                                        height="200"
                                    />
                                    <div className="font-bold py-2">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>loading...</div>
                )}
            </div>
        </div>
    );
}
