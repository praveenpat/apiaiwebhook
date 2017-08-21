/**
 * Created by praveen on 8/20/17.
 */

var node_xj=require('xls-to-json');

node_xj({
    input: "data/area_codes_by_state.xls",  // input xls
    output: "data/area_codes_by_state.json" // output json
   // sheet: "sheetname"  // specific sheetname
}, function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
