exports = function(){

    /*
        No input.
        Returns a JSON string representing an array of orders for the dispatcher's zipcodes.

        To test this function in the Stitch UI:
            Navigate to the function.
            Make sure to run it as an existing dispatcher.
            Near the bottom of the editing console, hit Run.
    */

    const atlas = context.services.get(context.values.get("cluster-name"));

    // Check if zipcodes is on the dispatcher's context.
    if ( context.user.custom_data.zipcodes &&
         context.user.custom_data.zipcodes instanceof Array &&
         context.user.custom_data.zipcodes.length > 0          ) {
        zips = context.user.custom_data.zipcodes
    }

    let assignedOrg = null;
    if ( context.user.custom_data &&
        context.user.custom_data.organizationId ) {
      assignedOrg = context.user.custom_data.organizationId;
    }

    // Throw an error if a dipatcher's zipcodes are empty
    else throw "Attribute 'zipcodes' not found for the dispatcher running the function. It should be an array of strings."

    console.log("Zips: ", zips)

    // Set up query to only return orders in the zips array,
    // as well as finding "unassigned" orders with no org,
    // or orders that are assigned to the users current org.
    const query = { zipcode: { $in: zips }, $or: [{assignedToOrg: {$in: [null, "", "undefined"]}}, {assignedToOrg: assignedOrg}]  };

    // Query and returns orders in array.
    return atlas.db(context.values.get("db-name")).collection('orders').find(query)
      .sort({ dateCreated: 1 })
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        items.forEach(console.log)
        return {"status": '200', 'data': items};
      }).catch(err => {
        return {"status": '400', 'message':"Failed to update order:" + err}
    })
  };
