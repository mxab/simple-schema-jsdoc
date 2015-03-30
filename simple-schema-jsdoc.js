SimpleSchema.prototype._getTypeForKeys = function (keys, prefix) {
  function indent(depth){
    return _.chain(depth).range().map(function(){return "\t"}).value().join("")
  }
  function getPrimititveType(v) {
    var primitiveType;
    if (v.type === Date) {
      primitiveType = "Date"
    } else if (v.type === String) {
      primitiveType = "string"
    } else if (v.type === Number) {
      primitiveType = "number"
    } else if (v.type === Boolean) {
      primitiveType = "boolean"
    }
    return primitiveType;
  }
  var depth = prefix ? prefix.split(".").length : 0;

  var doc = _.chain(keys).map(function (key) {

    var isArray = false;
    var fullPath = key;

    if (prefix) {
      fullPath = prefix + "." + key;
      isArray = prefix.substr(prefix.length - 2, 2) === ".$";
    }


    var d = this.getDefinition(fullPath);

    var primitiveType = getPrimititveType(d);

    var type;
    var typeDoc = key + ": ";
    if (primitiveType) {
      type = primitiveType;
    } else if (d.type === Object) {

      if (d.blackbox) {
        type = "Object"
      } else {
        var objectKeys = this.objectKeys(fullPath);

        type =this._getTypeForKeys(objectKeys, fullPath);
      }
    } else if (d.type === Array) {
      var arrayPath = fullPath + ".$";
      var arrayTypeDef = this.getDefinition(arrayPath);

      var arrayPrimitiveType = getPrimititveType(arrayTypeDef);
      if(arrayPrimitiveType){
        type = "Array.<"+arrayPrimitiveType+">";
      }else{
        var arrayKeys = this.objectKeys(arrayPath);
        type = "Array.<"+this._getTypeForKeys(arrayKeys, arrayPath)+">";
      }
    }
    //finish
    if (d.optional) {
      typeDoc += "(" + type + "|undefined)"
    } else {
      typeDoc += type
    }
    return typeDoc


  }.bind(this)).value().join(",\n"+indent(depth));

  return "{ "+ doc+" }";
};

SimpleSchema.prototype.jSDocType = function () {


  return this._getTypeForKeys(this._firstLevelSchemaKeys);
};
