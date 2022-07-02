import Link from "next/link";
import { ConnectButton } from "web3uikit";
export default function Header() {
    return (
        <nav>
            <div className="p-5 border-b-2 flex flex-row justify-between items-center">
                <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
                <div className="flex flex-row items-center">
                    <Link href="/">
                        <a className="mr-4 p-3 hover:bg-gray-100 rounded-md">Home</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="mr-4 p-3 hover:bg-gray-100 rounded-md">Sell NFT</a>
                    </Link>
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    );
}
