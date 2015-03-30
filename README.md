##
Allows to export the simple schema to a js Doc type
```
var PersonSchema = new SimpleSchema({
    firstName : {
        type : String,
        optional : true
    },
    lastName : {
        type : String
    },
    birthday : {
        type : Date
    },
});

var docString = PersonSchema.jSDocType();

console.log("/** @typedef {%s} %s */", docString, "Person");

//result:
/**
@typedef {{
       firstName:(string|undefined),
       lastName:string,
       birthday:Date
  }} Person
 */
```