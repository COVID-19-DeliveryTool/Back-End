exports = function(zipcodes){
  
    const atlas = context.services.get('mongodb-atlas');
    
    // Set placeholder.
    let zips = ["1234", "2345", "3456"]
    
    // Check if zipcodes were passed into function.
    if ( zipcodes instanceof Array && zipcodes.length > 0) zips = zipcodes
    
    // Check if zipcodes were saved in the function's context.
    else if ( context.values.get("zipcodes") instanceof Array && context.values.get("zipcodes").length > 0 ) zips = zipcodes
                  
    console.log("Zips: ", zips)
    
    // Set up query to only return orders in the zips array.
    const query = { zipcode: { $in: zips }  };
    
    // Query and returns orders in array.
    return atlas.db('stayneighbor-dev').collection('orders').find(query) 
      .sort({ zipcode: 1 })
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        items.forEach(console.log)
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  };