
/*
This function takes in an order id and a driver id and updates the assignedToDriver field in the order.
// how to test on the stitch ui:
// once you have gone to the function ahad_test, click "console" and paste the commented out code below. Then, copy and paste the real function in the function editor and click run.
exports('5e78257cd90fa7675ab957e3', '2')

*/

exports = function(orderId, driverId){

  let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
  let collection = db.collection("orders")
  let query = {_id: BSON.ObjectId(orderId)}
  let orderStatus = 'IN PROGRESS'
  if (driverId === ''){
  	orderStatus = 'PENDING'
  }

  //Get a unique identifier to be used in the completion URL.
  //DriverId is actually the driver Email
  let driverCompletedId = utils.crypto.hash("md5", driverId + orderId);

  let updateCmd = {$set: {driverOrderHash: driverCompletedId, assignedToDriver: driverId, assignedToOrg: context.user.custom_data.organizationId + "", status: orderStatus}}
  return collection.updateOne(query, updateCmd)
  .then(result => {
    //maybe here we want to send an email?
     return {"status": '200', 'message':"Successfully updated item. Database returned " + JSON.stringify(result)};
    }).catch(err => {
      return {"status": '400', 'message':"Failed to update order:" + err}
    })
}
