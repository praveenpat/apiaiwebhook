/**
 * Created by praveen on 8/20/17.
 */

var fs = require('fs');
var _ = require('lodash');

var midNumbers= ['444','414','312','615','822','456','982','993','772','113','543','765'] ;

var lastNumber= ['4443','4143','3125','6156','8226','4569','9821','3993','4772','5113','2543','8765'] ;

var getAreaCode=(state)=>{



          var contents=fs.readFileSync("./data/area_codes_by_state.json");

          jsonObj=JSON.parse(contents);

          //console.log(jsonObj);

          var areacode='302';

          console.log(`state *** ${state}`)

          _.forEach(jsonObj,(rec)=>{

              console.log(rec);
              if(rec['State code'] === state){

                  areacode=rec['Area code'];
                  return false;
              }

              if(rec['State']=== state){

                 areacode=rec['Area code'];
                 return false;
              }

          })

        return areacode;

}



var getAvailablePhoneNumbers=(state)=>{

      var phonenumbers=[];

      var areacode=getAreaCode(state);

      var avilableNumberCount= Math.floor(Math.random()*8) + 1;

      console.log(areacode,avilableNumberCount);

      _.times(avilableNumberCount,()=>{

          var newNumber=areacode;
          newNumber +=  midNumbers[Math.floor(Math.random()*midNumbers.length)];
          newNumber += lastNumber[Math.floor(Math.random()*lastNumber.length)]  ;
          phonenumbers.push(newNumber);
      })

    return phonenumbers;

}

module.exports={
    getAvailablePhoneNumbers
}

