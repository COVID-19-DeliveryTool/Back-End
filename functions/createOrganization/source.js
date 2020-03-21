/**
 * 
 * {
    "name": "",
    "contactName": "",
    "contactPhone": "",
    "state": "",
    "city": "",
    "dateCreated": "",
    "dispatchers": [
        {
            "id": "", //generated manually on insert
            "name": "",
            "email": "",
            "phone": ""
        }
    ],
    "drivers": [
        {
            "id": "", //generated manually on insert
            "name": "",
            "email": "",
            "phone": ""
        }
    ],
    "zipcodes": [
        "22202",
        "22201"
    ]
}
 * 
 * 
 */

exports = function (organzation) {

    let db = context.services.get("mongodb-atlas").db("stayneighbor-dev");
    let collection = db.collection("orders");
    let uuid = require('uuid');

    //Sanity null check
    if(!organzation) {
        return { "status": '400', 'message': "Bad request, input payload is null." };
    }

    //TODO: possible validation, better in schema validator?
    if(organzation.name == undefined || organzation.name.length == 0) {
        return { "status": '400', 'message': "Name is required!" };
    }

    // Manually generate a UUID for each dispatcher
    if(organzation.dispatchers != undefined && organzation.length >0 ) {
        organzation.dispatchers.map(
            d => d.id = uuid.uuid4()
        );
    }

    organzation.dateCreated = new Date(Date.now());

    console.log(EJSON.parse(organzation));

    return collection.insertOne(organzation)
        .then(result => {
            return { "status": '200', 'message': "Successfully inserted item with _id:" + result.insertedId };
        }).catch(err => {
            return { "status": '400', 'message': "Failed to insert item:" + err };
        });

}