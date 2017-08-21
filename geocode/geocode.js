/**
 * Created by praveen on 7/10/17.
 */

const request = require('request');



const _ = require('lodash');

var geoCodeAddress = (address,callback) => {
    var encodedAddress = encodeURIComponent(address);

    request({

        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json: true

    }, (error, response, body) => {

        if (error) {

            // console.log('unable to connect to google servers');
            callback('unable to connect to google servers');
        }
        else if (body.status === 'ZERO_RESULTS') {

            // console.log(`Not able to find the address mentioned - ${argv.address}`)
            callback(`Not able to find the address mentioned - ${address}`);

        }
        else if (body.status === 'OK') {

            //console.log(JSON.stringify(body,undefined,2));

            callback(undefined, {
                address : body.results[0].formatted_address,
                Longitude : body.results[0].geometry.location.lng,
                Latitude : body.results[0].geometry.location.lat


            })




        }

    });

};

var geoCodePromise=(address)=>{

    return new Promise((resolve,reject)=>{

        var encodedAddress = encodeURIComponent(address);

        request({

            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
            json: true

        }, (error, response, body) => {

            if (error) {

                // console.log('unable to connect to google servers');
                reject('unable to connect to google servers');
            }
            else if (body.status === 'ZERO_RESULTS') {

                // console.log(`Not able to find the address mentioned - ${argv.address}`)
                reject(`Not able to find the address mentioned - ${address}`);

            }
            else if (body.status === 'OK') {

                 console.log(JSON.stringify(body,undefined,2));

                 var cityStateresponse=getCityAndState(body.results[0].address_components)

                resolve( {
                    address : body.results[0].formatted_address,
                    Longitude : body.results[0].geometry.location.lng,
                    Latitude : body.results[0].geometry.location.lat,
                    City: cityStateresponse.city,
                    State: cityStateresponse.state

                } );




            }

    })

 });
};

var getCityAndState=(results)=>{

    console.log("input:",JSON.stringify(results,undefined,2));

    var response={};

    if(results){

        _.forEach(results,function(addresscomp){
            if(addresscomp.types[0]==='postal_code'){
                response.postalCode=addresscomp.short_name;
            }
            if(addresscomp.types[0]==='administrative_area_level_3'){
                response.city=addresscomp.short_name;
            }
            if(addresscomp.types[0]==='administrative_area_level_1'){
                response.state=addresscomp.short_name;
            }

        });
    }

    return response;

}

module.exports = {

    geoCodeAddress,
    geoCodePromise
}