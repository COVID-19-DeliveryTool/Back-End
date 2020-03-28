exports = async function(order_id, uOrder, addressChanged){
  
  
    /*
      Accepts an order object and a boolean indicating if the value has changed.
      
      Search the collection for a valid object and call the function in the 
      console passing that object and true or false depding on if the address has changed.
      Make sure the object has a valid address if you set addressChanged to true.
      NOTE: I've been getting an error inside getCoords.
    */
    try {
      // Connect to atlas
      const atlas = context.services.get(context.values.get("cluster-name"));
    
      let updatedOrder
      // Parse JSON ? Not sure if necessary.
      if ( typeof uOrder === "string" ) {
        updatedOrder = JSON.parse(uOrder)
      } else {
        updatedOrder = uOrder
      }
      
      // Get the id of the order 
      let orderId = order_id
      console.log("Order Id: ", orderId)
      
      // Create a Date object from the BSON date ||| NOTE: Commented out as I'm deleting since I don't think it makes sense too update this anyway.
      // let dateCreated = Date(updatedOrder.dateCreated.$date)
      // console.log("DATE: ", dateCreated)
      
      // Set the query to find the document
      let query = {_id: BSON.ObjectId(orderId)}
    
      // Set upsert to false
      let options = { "upsert": false  }
      
      // Make a copy of the updated order - This is to make 
      // writing the set operator easier further down.
      let updateOrderNoId = JSON.parse(JSON.stringify(updatedOrder))
      
      // Delete the Id from the copy
      delete updateOrderNoId["_id"]
      
      // Delete the fields we don't want it to be able to touch
      delete updateOrderNoId["dateCreated"]
      delete updateOrderNoId["assignedToDriver"]
      delete updateOrderNoId["status"]
      
      // Delete the fields we don't want it to update
      
      
      // Set the dateCreated on the copy equal to the date object we made earlier
      // updateOrderNoId.dateCreated = dateCreated
      
      // Check if the address changed
      if ( addressChanged ) {
        let coords = await context.functions.execute("getCoords", updateOrderNoId.address)
        let { lat, lng } = coords
        let geometry = {
          lat: lat,
          long: lng
        }
        updateOrderNoId.geometry = geometry
      }
      
      
      console.log("UPDATED ORDER: ", JSON.stringify(updateOrderNoId))
      
      // Instantiate the set operator
      let updateCmd = {$set:{}}
      
      // For each field in the copy, add it and its value to the set operator
      for (const property in updateOrderNoId) {
        updateCmd.$set[`${property}`] = updateOrderNoId[property]
      }
      
      
      console.log("UPDATED SET OPERATOR: ", JSON.stringify(updateCmd))
  
      // Instantiate a return message and status
      let return_messsage = ""
      let return_status = "200"
      
      let res = await atlas.db(context.values.get("db-name")).collection('orders').updateOne(query, updateCmd, options) 
      console.log("Update operation condluded with: ", JSON.stringify(res))
      // Couldn't find the document
      if ( res.matchedCount === 0) {
        return_status = "404"
        throw "Could not find the specified order."
      } 
      // Couldn't change the document
      if ( res.matchedCount === 1 && res.modifiedCount === 0 ) {
        return_status = "403"
        throw "Found the order, but was not able to modify. Reason unknown."
      } 
      // Other return successful
      console.log("Operation Successful: ", JSON.stringify(res))
      return JSON.stringify({"status":return_status,"message":"Operation successful."})
    } catch( err ) {
          console.log("There was an error: " + err)
          return JSON.stringify({"status":return_status,"message":err})
      } 
  };