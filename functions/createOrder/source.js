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
          '"address":"addr4",'  +
          '"phoneNumber":"1234567890",'  +
          '"requestedItems": [{"name":"eggs", "quantity": "1"}],'  +
          '"zipcode":"1234",'  +
          '"type":"REQUEST",'  +
          '"additionalInfo":"none",'  +
          '"dropoffTime":"2"}'
var obj = JSON.parse(text);
exports(obj)
*/

exports = function(orderDetails){

  let db = context.services.get("mongodb-atlas").db("stayneighbor-dev")
  let collection = db.collection("orders")
  let query = {dateCreated:{$gt:new Date(Date.now() - 24*60*60 * 1000)}, address: orderDetails.address}
  return collection.find(query).toArray()
  .then(arr => {
    console.log(arr.length )
    if (arr.length !== 0){
     return  ({"status": "400", "message": "Order has already been placed from this address within 24 hours."});
    }

  orderDetails.dateCreated = new Date(Date.now())
  //call function to convert address to lat/long. Pass in lat/long to the below lines
  let geometry = {}
  geometry.lat = "123"
  geometry.long = "123"
  orderDetails.geometry = geometry
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

}
