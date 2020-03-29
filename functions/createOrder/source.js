/*
orderDetails looks like this:
{
   "firstName": "",
   "lastName": "",
   "householdNum": "",
   "address": "",
   "phoneNumber": "",
   "requestedItems": [
       {"name": "eggs", "quantity": "1"},
       {"name": "bread", "quantity": "2"},
   ],
   "type": "", // [REQUEST, DONATION]
   "zipcode": "",
   "additionalInfo": "",
   "dropoffTime": ""
}

*/

/*
// how to test on the stitch ui:
// once you have gone to the function ahad_test, click "console" and paste the commented out code below. Then, copy and paste the real function in the function editor and click run.
var text = '{ "firstName":"name",'  +
          '"lastName":"lastName",'  +
          '"householdNum": "1",'  +
          '"address":"f st",'  +
          '"phoneNumber":"1234567890",'  +
          '"items": [{"name":"eggs", "quantity": "1"}],'  +
          '"zipcode":"1234",'  +
          '"type":"REQUEST",'  +
          '"additionalInfo":"1",'  +
          '"time":"2"}'
var obj = JSON.parse(text);
exports(obj)
*/

exports = function(orderDetails){

  let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
  let collection = db.collection("orders")
  let query = {dateCreated:{$gt:new Date(Date.now() - 3*60*60 * 1000)}, address: orderDetails.address}
  return collection.find(query).toArray()
  .then(arr => {
    if (arr.length !== 0 && orderDetails.type == 'REQUEST'){
     return  ({"status": "400", "message": "Order has already been placed from this address within 3 hours."});
    }
    return val = context.functions.execute("getCoords", orderDetails.address).then(coords => {
      if (coords.status == 400){
        return {"status": '400', 'message':"Address <" + orderDetails.address + "> does not exist"}
      }
      let geometry = {}
      geometry.lat = coords.lat
      geometry.long = coords.lng
      orderDetails.geometry = geometry
      orderDetails.dateCreated = new Date(Date.now())
      orderDetails.status = "PENDING"
      orderDetails.assignedToDriver = ""
      orderDetails.assignedToOrg = ""
      return collection.insertOne(orderDetails)
       .then(result => {
         return {"status": '200', 'message':"Successfully inserted item with _id:" + result.insertedId};
        }).catch(err => {
          return {"status": '400', 'message':"Failed to insert item:" + err}
        });
      })
  })

}
