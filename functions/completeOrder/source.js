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
        console.log("Null order ID was passed into function.");
        return { "status": '400', "message": "Something went wrong when trying to complete your order." };
    }

    let order = await orderCollection.findOne(findByOrderId);

    if (!order || !order._id) {
        console.log("No order found for id: ", orderId);
        return { "status": "404", "message": "Something went wrong when trying to complete your order." };
    }

    //Order should only be moved to complete if it is currently in progess.
    //TODO: maybe add driver email verification somehow
    if (order.status !== "IN PROGRESS") {
        return { "status": "409", "message": "This order is not marked as in progress, please verify the dispatcher has not unassigned it." };
    }

    
    order.status = "COMPLETED";

    //TODO: notify dispatcher?

    console.log(JSON.stringify(order));
    return orderCollection.replaceOne(
        findByOrderId,
        order,
        { upsert: false}
    ).then(result => {
        return { "status": "200", "message": "Successfully completed order. Thank you!" };
    }).catch(err => {
        console.log("Error: ", err)
        return { "status": '500', 'message': "Something went wrong when trying to complete your order." };
    });
}