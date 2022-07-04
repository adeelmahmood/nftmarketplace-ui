Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    logger.info(`ItemListed event afterSave with confirmed: ${request.object.get("confirmed")}`);
    const confirmed = request.object.get("confirmed");
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        // check if item already there (listing updated event)
        const query = new Moralis.Query(ActiveItem);
        setQueryParams(query, request, ["nftAddress", "tokenId", "address", "seller"]);
        const existingActiveItem = await query.first();
        if (existingActiveItem) {
            logger.info(
                `Found existing listing item at ${existingActiveItem.get(
                    "address"
                )} ${existingActiveItem.get("tokenId")}, removing...`
            );
            await existingActiveItem.destroy();
        }

        const activeItem = new ActiveItem();
        setItemProperties(activeItem, request, [
            "address",
            "nftAddress",
            "price",
            "tokenId",
            "seller",
        ]);
        logger.info(
            `Persiting Active item address: ${activeItem.get("address")} tokenId: ${activeItem.get(
                "tokenId"
            )}`
        );
        await activeItem.save();
    }
});

Moralis.Cloud.afterSave("ListingCancelled", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get("confirmed");
    logger.info(
        `ListingCancelled event afterSave with confirmed: ${request.object.get("confirmed")}`
    );
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        const query = new Moralis.Query(ActiveItem);
        setQueryParams(query, request, ["nftAddress", "tokenId", "address"]);
        const existingActiveItem = await query.first();
        if (existingActiveItem) {
            logger.info(
                `Found existing listing item at ${existingActiveItem.get(
                    "address"
                )} ${existingActiveItem.get("tokenId")}, cancelling...`
            );
            await existingActiveItem.destroy();
        } else {
            logger.info(
                `Unable to find item at ${existingActiveItem.get(
                    "address"
                )} ${existingActiveItem.get("tokenId")}`
            );
        }
    }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get("confirmed");
    logger.info(`ItemBought event afterSave with confirmed: ${request.object.get("confirmed")}`);
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        const query = new Moralis.Query(ActiveItem);
        setQueryParams(query, request, ["nftAddress", "tokenId", "address"]);
        const existingActiveItem = await query.first();
        if (existingActiveItem) {
            logger.info(
                `Found existing listing item at ${existingActiveItem.get(
                    "address"
                )} ${existingActiveItem.get("tokenId")}, bought so removing listing...`
            );
            await existingActiveItem.destroy();
        } else {
            logger.info(
                `Unable to find item at ${request.object.get("nftAddress")} ${request.object.get(
                    "tokenId"
                )}`
            );
        }
    }
});

function setItemProperties(item, request, props) {
    for (let prop in props) {
        const key = props[prop];
        item.set(key, request.object.get(key));
    }
}

function setQueryParams(query, request, props) {
    for (let prop in props) {
        const key = props[prop];
        query.equalTo(key, request.object.get(key));
    }
}
