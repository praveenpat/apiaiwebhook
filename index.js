/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const geocodeService = require('./geocode/geocode.js');
const phonenumberService = require('./geocode/getAreaCode.js');

const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request',req);
    console.log('Parameters',req.body.result.parameters);

    var zip=false;

     if(req.body.result.parameters.zipcode){

         zip=true;
     }


     if(zip) {

         geocodeService.geoCodePromise(req.body.result.parameters.zipcode).then(results => {

             //var phoneNumbers = getPhoneNumbers(results.state);
             console.log(results);

             return createResponse(results.State,req,res);

         });


     }

     else {

         return createResponse(req.body.result.parameters.state,req,res);

     }

});


var createResponse=(state,req,res)=>{
try {

    var phoneNumbers = phonenumberService.getAvailablePhoneNumbers(state);
    var speech = 'empty speech';

    if (req.body) {
        var requestBody = req.body;

        if (requestBody.result) {
            speech = '';

            if (requestBody.result.fulfillment) {
                speech += requestBody.result.fulfillment.speech;
                speech += ' ';
            }

            if (requestBody.result.action) {
                speech += 'action: ' + requestBody.result.action;
            }
        }
    }

    console.log('result: ', speech);

    var responseString = 'Please select from the following numbers - ' + phoneNumbers;

    return res.json({
        speech: responseString,
        displayText: responseString,
        source: 'apiai-webhook-sample'
    });
} catch (err) {
    console.error("Can't process request", err);

    return res.status(400).json({
        status: {
            code: 400,
            errorType: err.message
        }
    });
}



}

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});