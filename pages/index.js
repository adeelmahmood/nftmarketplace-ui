import { useMoralisQuery } from "react-moralis";
import NFTBox from "../components/NFTBox";
import { useMoralis } from "react-moralis";

export default function Home() {
    const { isWeb3Enabled } = useMoralis();

    const { data, error, isLoading } = useMoralisQuery("ActiveItem");

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed NFTs</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    isLoading ? (
                        <div>Loadding...</div>
                    ) : (
                        data.map((nft) => {
                            const { price, address, seller, nftAddress, tokenId } = nft.attributes;

                            return (
                                <div className="mr-10">
                                    <NFTBox
                                        price={price}
                                        address={address}
                                        seller={seller}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            );
                        })
                    )
                ) : (
                    <div>Web3 not enabled</div>
                )}
            </div>
        </div>
    );
}
