exports = async function(orderId){

  let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
  let collection = db.collection("orders");

  if(!orderId) {
    return { "status": '400', "message": "orderId is a required input and cannot be null/empty" };
  }

  let order = await db.findOne({"_id": orderId});

  if(!order || !order._id) {
    return { "status": "404", "message": "Order not found " };
  }
  
  if(order.status !== 'IN PROGRESS') {
        return { "s}
  }

}
