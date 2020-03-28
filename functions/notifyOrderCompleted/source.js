exports = async function (changeEvent) {

    /*
        Accepts: changeEvent
  
        Invoked by a trigger that watches for the "emailAddress" field to change
        
        Sends an email to the email address stored in emailAddres on the updated document.
        
        Change Event to pass in while testing: -- make sure it exists with the right id in the db.
        
        {
          // _id: {ObjectId("0214eb4a30c75625e00d2820")},
           operationType: 'update',
          // clusterTime: Timestamp(1412180887, 1) ,
           ns: {
              db: 'stayneighbor-dev',
              coll: 'orders'
           },
           documentKey: {
              _id: "5e76aad15f06170a32d8f8b5"
           },
           updateDescription: {
              updatedFields: {
                 assignedToDriver: 'dilloharless@gmail.com',
                 status:"IN PROGRESS",
                 assignedToDriver:"2"
              },
              removedFields: null
           },
           fullDocument: {
            "_id": {
                "$oid": "5e76aad15f06170a32d8f8b5",
            },
            "householdNum": "1",
            "phoneNumber": "1234567890",
            "items": [{
                "name": "eggs",
                "quantity": "1"
            }],
            "dropoffTime": "2",
            "firstName": "Dillon",
            "lastName": "Harless",
            "address": "addr4",
            "zipcode": "1234",
            "type": "REQUEST",
            "additionalInfo": "none",
            "dateCreated": {
                "$date": {
                    "$numberLong": "1584835281594"
                }
            },
            "geometry": {
                "lat": "123",
                "long": "123"
            },
            "status": "IN PROGRESS",
            "assignedToDriver": "dillonharless@gmail.com",
            "assignedToOrg": "",
            "assignedToDriver": "dillonharless@gmail.com",
            "emailAddress": "dillonharless@gmail.com"
          }
        }
    */
  
    const ses = context.services.get('AWS_SES').ses("us-east-1");
  
    // Destructure out fields from the change stream event object
    const { fullDocument, operationType } = changeEvent;
    
    // NOTE: Do we want to log this for any reason?
    // console.log("fullDocument: ", JSON.stringify(fullDocument))
    
    
    // Instantiate message
    let message_obj = {
          Source: "covid.19.deliverytool@gmail.com",
          Destination: { ToAddresses: [" "] }, 
          Message: {
              Body: {
                  Html: {
                    Charset: "UTF-8",
                    Data: `Test`
                  }
              },
              Subject: {
                  Charset: "UTF-8",
                  Data: "Test Email From StayNeighbor."
              }
          }
      }
    
    // Updates the message object appropriately
    function updateMessageObj(message_obj, email, subject, body) {
      console.log("message_object: ", JSON.stringify(message_obj))
      console.log("email: ", email)
      let mo = message_obj;
      mo.Destination = { ToAddresses: [email] };
      mo.Message.Subject.Data = subject;
      mo.Message.Body.Html.Data = body;
      return mo;
    }
  
    try { 
        // A driver was assigned and the status updated to IN PROGRESS
        if ( operationType === "update" && 
             changeEvent.ns.coll === "orders" && 
             fullDocument.status === "COMPLETED" &&
             fullDocument.assignedToDriver &&
             fullDocument.emailAddress ) {
          
                // TODO: Call a function to create a completion url.
                // Build requester message
                let { emailAddress, address, zipcode, items, firstName, lastName } = fullDocument;
                let subject = "Your request has been fulfilled! - StayNeighbor";
                let body = `Hey ${JSON.stringify(firstName)},<br><br> your order has been delivered!<br><br>
                              
                            Items requested: ${items}.<br>
                            Delivery Address: ${address}, ${zipcode}.<br><br>

                            Please don't hesitate to use us again.
                            Thanks for using StayNeighbor. Please tell everyone you know about us!`;
                message_obj = updateMessageObj(message_obj, emailAddress, subject, body);
                
                console.log("Message Created.")
                // Send message
                let result = await ses.SendEmail(message_obj);
                console.log("Sent.")
                console.log(EJSON.stringify(result));
                return {"status":"200","message":`Email sent to ${emailAddress} successfully.`,"data":`${JSON.stringify(result)}`}
        }
    }
    catch(err){
      console.log("ERROR: ", err)
      return {"status":"403","message":`Failed to send email. ${JSON.stringify(err)}`}
    }
  };	