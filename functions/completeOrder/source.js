/**
let orderId = "5e76aad15f06170a32d8f8b5";
exports(orderId);
*/

//TODO: add comments
exports = async function (orderId, driverOrderHash) {

    let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
    let orderCollection = db.collection("orders");
    let findByOrderIdAndHash = { "_id": BSON.ObjectId(orderId), "driverOrderHash": driverOrderHash };

    if (!orderId || !driverOrderHash) {
        console.log("Null order ID was passed into function.");
        return { "status": '400', "message": "Something went wrong when trying to complete your order." };
    }

    let order = await orderCollection.findOne(findByOrderIdAndHash);

    if (!order || !order._id) {
        console.log("No order found for id: ", orderId, " and hash: ", driverOrderHash);
        return { "status": "404", "message": "Something went wrong when trying to complete your order." };
    }

    //Order should only be moved to complete if it is currently in progess.
    //TODO: maybe add driver email verification somehow
    if (order.status !== "IN PROGRESS") {
        return { "status": "409", "message": "There was an error completing the order. Please contact your dispatcher." };
    }

    
    order.status = "COMPLETED";

    //TODO: notify dispatcher?

    console.log(JSON.stringify(order));
    return orderCollection.replaceOne(
        findByOrderIdAndHash,
        order,
        { upsert: false}
    ).then(result => {
        return { "status": "200", "message": "Successfully completed order. Thank you!" };
    }).catch(err => {
        console.log("Error: ", err)
        return { "status": '500', 'message': "Something went wrong when trying to complete your order." };
    });
}