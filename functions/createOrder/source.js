
/*
orderDetails looks like this:
{
"firstName": "",
"lastName": "",
"householdNum": "",
"address": "",
"phoneNumber": "",
"requestedItems": [],
"zipcode": "",
"time": "",
"additionalInfo": "",
"dropoffTime": ""
}
*/

/*
// how to test on the stitch ui:

var text = '{ "firstName":"name",'  +
          '"lastName":"lastName",'  +
          '"householdNum":"1",'  +
          '"address":"fake_address",'  +
          '"phoneNumber":"1234567890",'  +
          '"requestedItems":"2",'  +
          '"zipcode":"1234",'  +
          '"time":"1",'  +
          '"additionalInfo":"none",'  +
          '"dropoffTime":"2"}'

var obj = JSON.parse(text);
console.log(obj.firstName)
exports(obj)
*/

exports = function(orderDetails){

  let db = context.services.get("mongodb-atlas").db("stayNeighbor")
  let collection = db.collection("orders")
  // let query = ({"time":{$gt:new Date(Date.now() - 24*60*60 * 1000)}}, {address: orderDetails.address})
  // let cursor = collection.find(query)
  // if (cursor.count() !== 0){
  //   return {status: "400", message: "Order has already been placed from this address within 24 hours."}
  // }
   return collection.insertOne(orderDetails)
   .then(result => {
     return {"status": '200', 'message':"Successfully inserted item with _id:" + result.insertedId};
    }).catch(err => {
      return {"status": '400', 'message':"Failed to insert item:" + err}
    });
};
