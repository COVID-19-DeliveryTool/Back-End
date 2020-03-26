exports = async function (changeEvent) {

    /*
        Accepts: changeEvent

        Need to create a trigger in the prod environment to watch for new orders.
        
        This function determines the proper email to send and sends it.
    */
  
    const ses = context.services.get('AWS_SES').ses("us-east-1");
  
    // Destructure out fields from the change stream event object
    const { fullDocument, operationType } = changeEvent;
    
    console.log("fullDocument: ", JSON.stringify(fullDocument))
    
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
    };
    
    try { 
        // A new order was created
        if ( operationType === "insert" && changeEvent.ns.coll === "orders" ) {
          // Build requester message
          let { firstName, lastName, emailAddress } = fullDocument;
          let subject = 'We got your request! - StayNeighbor';
          let body = `Hey, ${firstName} ${lastName},\n\n StayNeighbor has received your order and it is being processed.`;
          message_obj = updateMessageObj(message_obj, emailAddress, subject, body);
      
          // Send message
          let result = await ses.SendEmail(message_obj);
          console.log(EJSON.stringify(result));
          return result
        }
    }
    catch(err){
      console.log("ERROR: ", err)
    }
    
  };	