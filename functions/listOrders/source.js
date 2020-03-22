exports = function(){

    /*  
        No input.
        Returns a JSON string representing an array of orders for the dispatcher's zipcodes.
        
        To test this function in the Stitch UI:
            Navigate to the function.
            Make sure to run it as an existing dispatcher.
            Near the bottom of the editing console, hit Run.
    */
  
    const atlas = context.services.get('mongodb-atlas');
    
    // Check if zipcodes is on the dispatcher's context.
    if ( context.user.custom_data.get("zipcodes") && 
         context.user.custom_data.get("zipcodes") instanceof Array && 
         context.user.custom_data.get("zipcodes").length > 0          ) {

        zips = context.user.custom_data.get("zipcodes")
    }
    
    // Throw an error if a dipatcher's zipcodes are empty
    else throw "Attribute 'zipcodes' not found for the dispatcher running the function. It should be an array in strings."

    console.log("Zips: ", zips)
    
    // Set up query to only return orders in the zips array.
    const query = { zipcode: { $in: zips }  };
    
    // Query and returns orders in array.
    return atlas.db('stayneighbor').collection('orders').find(query) 
      .sort({ zipcode: 1 })
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        items.forEach(console.log)
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  };