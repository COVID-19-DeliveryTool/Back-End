/**
 * Doesn't expect any args. To Test run as a specific user.
 */

exports = async function (arg) {
    let db = context.services.get("mongodb-atlas").db("stayneighbor");
    let userDataCollection = db.collection("user_data");
    let organizationsCollection = db.collection("organizations");

    console.log("User to add Custom Data:\n" + JSON.stringify(context.user));
    //Make sure the function is executed in the context of a user
    //if it's not context.user will be empty
    let user = context.user;
    if (!user || !user.data || !user.data.email) {
        return (
            {
                "status": "500",
                "message": "Cannot add custom user data when user is empty. Make sure function is invoked by user"
            }
        );
    }

    //Find the first organization which contains this user as a "dispatcher"
    //TODO: handle more than one organization
    let org = await organizationsCollection.findOne(
        { "dispatchers.email": user.data.email }
    );
      
    console.log(JSON.stringify(org));

    //If no organiztion is found, no data to apply, return
    if (!org || !org._id) {
        return ({ "status": "404", "message": "No organization found with this dispatcher." });
    }

    let userData = {
        "user_id": user.id,
        "role": "DISPATCHER",
        "organizationId": org._id,
        "organizationName": org.name,
        "zipcodes": org.zipcodes
    }

    return userDataCollection.insertOne(userData)
        .then(result => {
            return { "status": '200', 'message': "Successfully inserted item with _id:" + result.insertedId };
        }).catch(err => {
            return { "status": '400', 'message': "Failed to insert item:" + err }
        });
}