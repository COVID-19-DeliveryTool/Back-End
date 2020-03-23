
/*
This function takes in nothing and returns the drivers associated with the organizaiton in the context.
An example return value is [{"name":"driver1","email":"drvier1@mail.com","phone":"12341234","id":"89d22d0e-e8d1-4261-9b0a-49305788463c"}]
*/

exports = function(){

  let db = context.services.get("mongodb-atlas").db("stayneighbor")
  let collection = db.collection("organizations")
  let query = {_id: BSON.ObjectId(String(context.user.custom_data.organizationId))}
  return collection.findOne(query)
    .then(org => {
      return org.drivers
    })
    .catch(err => console.error(`Failed to find org: ${err}`))
}
