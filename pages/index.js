import { useMoralisQuery } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
    const { data, error, isLoading } = useMoralisQuery("ActiveItem");

    return isLoading ? (
        <div>Loadding...</div>
    ) : (
        data.map((nft) => {
            return (
                <div className="py-5 px-5 border-b-2">
                    <div>Marketplace address: {nft.attributes.address}</div>
                    <div>NFT Address: {nft.attributes.nftAddress}</div>
                    <div>Seller: {nft.attributes.seller}</div>
                    <div>Token ID: {nft.attributes.tokenId}</div>
                    <div>Price: {nft.attributes.price}</div>
                    <div>
                        Key: `${nft.attributes.nftAddress}${nft.attributes.tokenId}`
                    </div>
                    <NFTBox
                        price={nft.attributes.price}
                        address={nft.attributes.address}
                        seller={nft.attributes.seller}
                        nftAddress={nft.attributes.nftAddress}
                        tokenId={nft.attributes.tokenId}
                        key={`${nft.attributes.nftAddress}${nft.attributes.tokenId}`}
                    />
                </div>
            );
        })
    );
}
