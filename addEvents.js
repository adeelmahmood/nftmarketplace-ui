const Moralis = require("moralis/node");
require("dotenv").config();

const contractAddresses = require("./constants/contract.json");

console.log(contractAddresses);

let chainId = process.env.chainId || 31337;
const moralisChainId = chainId == "31337" ? "1337" : chainId;

const contractAddress = contractAddresses[chainId]["NFTMarketplace"][0];

const appId = process.env.NEXT_PUBLIC_APP_ID;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const masterKey = process.env.moralisMasterKey;

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Moralis running.. contract is at address ${contractAddress}`);

    const itemListedOpts = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        address: contractAddress,
        tableName: "ItemListed",
    };

    const itemBoughtOpts = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        address: contractAddress,
        tableName: "ItemBought",
    };

    const listingCancelledOpts = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ListingCancelled(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ListingCancelled",
            type: "event",
        },
        address: contractAddress,
        tableName: "ListingCancelled",
    };

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOpts, {
        useMasterKey: true,
    });
    console.log("Listed response ", listedResponse.success);

    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOpts, {
        useMasterKey: true,
    });
    console.log("Bought response ", boughtResponse.success);

    const cancelledResponse = await Moralis.Cloud.run("watchContractEvent", listingCancelledOpts, {
        useMasterKey: true,
    });
    console.log("Cancelled response ", cancelledResponse.success);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
