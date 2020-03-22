
/*
This function takes in an order id and a driver id and updates the assignedToDriver field in the order.
// how to test on the stitch ui:
// once you have gone to the function ahad_test, click "console" and paste the commented out code below. Then, copy and paste the real function in the function editor and click run.
exports('5e76aad15f06170a32d8f8b5', '2')

*/

exports = function(orderId, driverId){

  let db = context.services.get("mongodb-atlas").db("stayneighbor")
  let collection = db.collection("orders")
  let query = {_id: BSON.ObjectId(orderId)}
  let updateCmd = {$set: {assignedToDriver: driverId, assignedToOrg: context.user.custom_data.organizationId}}
  return collection.updateOne(query, updateCmd)
  .then(result => {
    //maybe here we want to send an email?
     return {"status": '200', 'message':"Successfully updated item. Database returned " + JSON.stringify(result)};
    }).catch(err => {
      return {"status": '400', 'message':"Failed to update order:" + err}
    })
}
