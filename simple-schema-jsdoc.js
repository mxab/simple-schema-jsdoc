SimpleSchema.prototype._getObjectString = function (s, depth, parent) {
  function indent(depth){
    return _.chain(depth).range().map(function(){return "\t"}).value().join("")
  }
  var objectString = "{\n" + _.chain(s).map(function (v, k) {
      var paths = k.split(".");

      var depthOk = paths.length === depth + 1;
      var isToplevel = paths.length === 1;
      var parentMatches = (paths[depth - 1] === parent);
      var parentOfArrayMatches = (paths[depth - 1] === "$" && paths[depth - 2] === parent);
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

      var isLastLevel = paths.length == depth;
      if(paths[depth] === "$" && parentMatches && isLastLevel){//if type is e.g. [String]
        return getPrimititveType(v);
      }
      else if (depthOk && (isToplevel ||( parentMatches)||( parentOfArrayMatches))) {

        var key = paths[depth];

        var typeDoc = key + " : ";

        var type = getPrimititveType(v);
        if(type){
          return type;
        } else if (v.type === Object) {

          if (v.blackbox) {
            type = "Object"
          } else {
            type = this._getObjectString(s, depth + 1, key)
          }
        } else if (v.type === Array) {
          console.log(v);
          console.log(paths);
          type = "Array.<" + this._getObjectString(s, depth + 2, key) + ">"
        }
        //finish
        if (v.optional) {
          typeDoc += "(" + type + "|undefined)"
        } else {
          typeDoc += type
        }
        return indent(depth+1)+typeDoc
      }

    }.bind(this)).compact().value().join(", \n") + "\n"+indent(depth)+"}";
  return objectString;
};
SimpleSchema.prototype.jSDocType = function () {

  var s = this.schema();
  var depth = 0;
  return this._getObjectString(s, depth);
};
