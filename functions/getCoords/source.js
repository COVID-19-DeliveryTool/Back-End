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

exports = async function(address){
  //This function assumes that the Google API has already been hooked up.
  let response = await context.http.get({url : 'https://maps.googleapis.com/maps/api/geocode/json?address="'+encodeURI(address)+'"&key=API_KEY'});
  console.log(JSON.stringify(response.status));

  let responseJson; 

  if(response.status.indexOf('200') > -1){
    //action was successful
    responsJson = EJSON.parse(response.body.text());
    //console.log(JSON.stringify(responseJson));
  }

  if(response.status.indexOf('400') > -1){
    //action was not successful
    return { error: EJSON.parse(response.body.text()) }
  }
  
  let coords = responseJson.results[0].geometry.location;

  //console.log(JSON.stringify(coords));
  return coords;
}