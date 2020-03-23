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

/**  
let testOrg = {
    "name": "TestOrg",
    "contactName": "Test Org Leader",
    "contactPhone": "6666666666",
    "state": "VA",
    "city": "Arlington",
    "dispatchers": [
        {
            "name": "d1",
            "email": "d1@mail.com",
            "phone": "1234567890"
        }
    ],
    "drivers": [
        {
            "name": "driver1",
            "email": "drvier1@mail.com",
            "phone": "12341234"
        }
    ],
    "zipcodes": [
        "22202",
        "22201"
    ]
}

exports(testOrg);
*/
exports = function (organzation) {

    let db = context.services.get(context.values.get("cluster-name")).db(context.values.get("db-name"));
    let collection = db.collection("organizations");

    //Sanity null check
    if(!organzation) {
      return { "status": '400', 'message': "Bad request, input payload is null." };
    }

    //TODO: possible validation, better in schema validator?
    if (organzation.name == undefined || organzation.name.length == 0) {
        return { "status": '400', 'message': "Name is required!" };
    }

    // Manually generate a UUID for each dispatcher
    if (organzation.dispatchers !== undefined && organzation.dispatchers.length > 0) {
        organzation.dispatchers.forEach(dispatch => dispatch.id = guid());
    }

    // Manually generate a UUID for each dispatcher
    if (organzation.drivers !== undefined && organzation.drivers.length > 0) {
        organzation.drivers.forEach(driver => driver.id = guid());
    }

    organzation.dateCreated = new Date(Date.now());

    return collection.insertOne(organzation)
        .then(result => {
            return { "status": '200', 'message': "Successfully inserted item with _id:" + result.insertedId };
        }).catch(err => {
            return { "status": '400', 'message': "Failed to insert item:" + err };
        });

}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}