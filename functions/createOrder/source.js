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
          '"householdNum":"1",'  +
          '"address":"",'  +
          '"phoneNumber":"1234567890",'  +
          '"items": [{"name":"eggs", "quantity": "1"}],'  +
          '"zipcode":"1234",'  +
          '"type":"REQUEST",'  +
          '"additionalInfo":"none",'  +
          '"time":"2"}'
var obj = JSON.parse(text);
exports(obj)
*/

exports = function(orderDetails){

  let db = context.services.get("mongodb-atlas").db("stayneighbor")
  let collection = db.collection("orders")
  let query = {dateCreated:{$gt:new Date(Date.now() - 24*60*60 * 1000)}, address: orderDetails.address}
  return collection.find(query).toArray()
  .then(arr => {
    console.log(arr.length )
    if (arr.length !== 0){
     return  ({"status": "400", "message": "Order has already been placed from this address within 24 hours."});
    }

    return val = context.functions.execute("getCoords", orderDetails.address).then(coords => {
      let geometry = {}
      geometry.lat = coords.lat
      geometry.long = coords.lng
      orderDetails.geometry = geometry
      orderDetails.dateCreated = new Date(Date.now())
      orderDetails.status = "PENDING"
      let driverObj = {name: "",email: "",phone: "","id": ""}
      orderDetails.driver = driverObj
      orderDetails.assignedToOrg = ""
      orderDetails.driverEmail = ""
      return collection.insertOne(orderDetails)
       .then(result => {
         return {"status": '200', 'message':"Successfully inserted item with _id:" + result.insertedId};
        }).catch(err => {
          return {"status": '400', 'message':"Failed to insert item:" + err}
        });
      })
  })

}
