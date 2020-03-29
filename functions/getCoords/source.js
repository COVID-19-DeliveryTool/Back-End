/*
Function takes in an address in the form of a string and returns the LatLng
Coords. If the address is not found it will return a single number 404.

Geocode Request literal:
Requires at least a address, location, or placeID.
{
    address: string,
    location: LatLng,
    placeId: string,
    bounds: LatLngBounds,
    componentRestrictions: GeocoderComponentRestrictions,
    region: strinG
}

Results Return:
results[]: {
    types[]: string,
    formatted_address: string,
    address_components[]: {
        short_name: string,
        long_name: string,
        postcode_localities[]: string,
        types[]: string
    },
    partial_match: boolean,
    place_id: string,
    postcode_localities[]: string,
    geometry: {
        location: LatLng,
        location_type: GeocoderLocationType
        viewport: LatLngBounds,
        bounds: LatLngBounds
    }
}
*/

exports = async function(address, zipcode){

  let mapsApiKey = context.values.get("stayneighor-google-maps-api-key");
  //This function assumes that the Google API has already been hooked up.
  let response = await context.http.get({
    url : 'https://maps.googleapis.com/maps/api/geocode/json?address="'+encodeURI(address)+'"&key='+mapsApiKey
  });
  let responseJson;

  if(response.status.indexOf('200') > -1){
    //action was successful
    responseJson = EJSON.parse(response.body.text());
  }

  if(response.status.indexOf('400') > -1){
    //action was not successful
    return { error: EJSON.parse(response.body.text()) }
  }
  if (responseJson.results.length === 0){
    return {"status": '400', 'message':"Address <" + address + "> does not exist"}
  }

  let resultsArr = responseJson.results
  for(var i = 0; i < resultsArr.length; i ++){
    let dataArr = resultsArr[i].address_components
     for (var j=0; j < dataArr.length; j++) {
       if (dataArr[j].types == "postal_code"){
         if (dataArr[j].long_name == zipcode){
          var expectedZipCode = dataArr[j].long_name
          var coords = responseJson.results[i].geometry.location;
         }
       }
    }
  }
  if(typeof expectedZipCode === "undefined"){
    return {"status": '400', 'message':"Address <" + address + "> with zipcode <" + zipcode + "> does not exist"}
  }

  return coords;
}
