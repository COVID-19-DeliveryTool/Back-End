/**
let orderId = "5e76aad15f06170a32d8f8b5";
exports(orderId);
*/

//TODO: add comments
exports = async function (orderId) {

    let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
    let orderCollection = db.collection("orders");
    let findByOrderId = { "_id": BSON.ObjectId(orderId) };

    if (!orderId) {
        return { "status": '400', "message": "orderId is a required input and cannot be null/empty" };
    }

    let order = await orderCollection.findOne(findByOrderId);

    if (!order || !order._id) {
        return { "status": "404", "message": "Order not found " };
    }

    //Order should only be moved to complete if it is currently in progess.
    //TODO: maybe add driver email verification somehow
    if (order.status !== "IN PROGRESS") {
        return { "status": "409", "message": "Cannot complete, order must be in 'IN PROGRESS' status, currently in: " + order.status };
    }

    
    order.status = "COMPLETED";

    //TODO: notify dispatcher?

    console.log(JSON.stringify(order));
    orderCollection.replaceOne(
        findByOrderId,
        order,
        { upsert: false}
    ).then(result => {
        console.log(JSON.stringify(result));
        return { "status": "200", "message": "Successfully updated " + result.modifiedCount + " item" };
    }).catch(err => {
        return { "status": '400', 'message': "Failed to update item:" + err };
    });
}