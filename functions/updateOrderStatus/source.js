exports = function (orderId, orderStatus) {

  let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
  let collection = db.collection("orders")
  let query = { "_id": BSON.ObjectId(orderId) };
  let options = { upsert: false }
  return collection.find(query).toArray()
    .then(arr => {
      console.log(arr.length)
      if (arr.length === 0) {
        return ({ "status": "400", "message": "Order does not exist" });
      }

      let update = {

        "$set": {
          "status": orderStatus
        }
      };

      return collection.updateOne(query, update, options)
        .then(result => {
          const { matchedCount, modifiedCount } = result;
          if (matchedCount && modifiedCount) {
            return { "status": '200', 'message': "Successfully updated " + result.modifiedCount + " item" }
          }
        }).catch(err => {
          return { "status": '400', 'message': "Failed to update item:" + err }
        });
    })

}