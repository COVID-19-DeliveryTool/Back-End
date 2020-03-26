
/*
This function takes in nothing and returns the drivers associated with the organizaiton in the context.
An example return value is {"status":"200","data":[{"name":"driver1","email":"drvier1@mail.com","phone":"12341234","id":"0de95946-889b-461f-aaea-ed827068f626"}]}
*/

exports = function(){

  let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
  let collection = db.collection("organizations")
  let query = {_id: BSON.ObjectId(String(context.user.custom_data.organizationId))}
  return collection.findOne(query)
    .then(org => {
       return {"status": '200', 'data': org.drivers};
    }).catch(err => {
      return {"status": '400', 'message':"Failed to update order:" + err}
  })
}
