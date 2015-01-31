/* */ 
var assert = require("assert");
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;
var each = Ap.forEach;
var Op = Object.prototype;
var objToStr = Op.toString;
var funObjStr = objToStr.call(function() {});
var strObjStr = objToStr.call("");
var hasOwn = Op.hasOwnProperty;
function Type(check, name) {
  var self = this;
  assert.ok(self instanceof Type, self);
  assert.strictEqual(objToStr.call(check), funObjStr, check + " is not a function");
  var nameObjStr = objToStr.call(name);
  assert.ok(nameObjStr === funObjStr || nameObjStr === strObjStr, name + " is neither a function nor a string");
  Object.defineProperties(self, {
    name: {value: name},
    check: {value: function(value, deep) {
        var result = check.call(self, value, deep);
        if (!result && deep && objToStr.call(deep) === funObjStr)
          deep(self, value);
        return result;
      }}
  });
}
var Tp = Type.prototype;
exports.Type = Type;
Tp.assert = function(value, deep) {
  if (!this.check(value, deep)) {
    var str = shallowStringify(value);
    assert.ok(false, str + " does not match type " + this);
    return false;
  }
  return true;
};
function shallowStringify(value) {
  if (isObject.check(value))
    return "{" + Object.keys(value).map(function(key) {
      return key + ": " + value[key];
    }).join(", ") + "}";
  if (isArray.check(value))
    return "[" + value.map(shallowStringify).join(", ") + "]";
  return JSON.stringify(value);
}
Tp.toString = function() {
  var name = this.name;
  if (isString.check(name))
    return name;
  if (isFunction.check(name))
    return name.call(this) + "";
  return name + " type";
};
var builtInTypes = {};
exports.builtInTypes = builtInTypes;
function defBuiltInType(example, name) {
  var objStr = objToStr.call(example);
  Object.defineProperty(builtInTypes, name, {
    enumerable: true,
    value: new Type(function(value) {
      return objToStr.call(value) === objStr;
    }, name)
  });
  return builtInTypes[name];
}
var isString = defBuiltInType("", "string");
var isFunction = defBuiltInType(function() {}, "function");
var isArray = defBuiltInType([], "array");
var isObject = defBuiltInType({}, "object");
var isRegExp = defBuiltInType(/./, "RegExp");
var isDate = defBuiltInType(new Date, "Date");
var isNumber = defBuiltInType(3, "number");
var isBoolean = defBuiltInType(true, "boolean");
var isNull = defBuiltInType(null, "null");
var isUndefined = defBuiltInType(void 0, "undefined");
function toType(from, name) {
  if (from instanceof Type)
    return from;
  if (from instanceof Def)
    return from.type;
  if (isArray.check(from))
    return Type.fromArray(from);
  if (isObject.check(from))
    return Type.fromObject(from);
  if (isFunction.check(from))
    return new Type(from, name);
  return new Type(function(value) {
    return value === from;
  }, isUndefined.check(name) ? function() {
    return from + "";
  } : name);
}
Type.or = function() {
  var types = [];
  var len = arguments.length;
  for (var i = 0; i < len; ++i)
    types.push(toType(arguments[i]));
  return new Type(function(value, deep) {
    for (var i = 0; i < len; ++i)
      if (types[i].check(value, deep))
        return true;
    return false;
  }, function() {
    return types.join(" | ");
  });
};
Type.fromArray = function(arr) {
  assert.ok(isArray.check(arr));
  assert.strictEqual(arr.length, 1, "only one element type is permitted for typed arrays");
  return toType(arr[0]).arrayOf();
};
Tp.arrayOf = function() {
  var elemType = this;
  return new Type(function(value, deep) {
    return isArray.check(value) && value.every(function(elem) {
      return elemType.check(elem, deep);
    });
  }, function() {
    return "[" + elemType + "]";
  });
};
Type.fromObject = function(obj) {
  var fields = Object.keys(obj).map(function(name) {
    return new Field(name, obj[name]);
  });
  return new Type(function(value, deep) {
    return isObject.check(value) && fields.every(function(field) {
      return field.type.check(value[field.name], deep);
    });
  }, function() {
    return "{ " + fields.join(", ") + " }";
  });
};
function Field(name, type, defaultFn, hidden) {
  var self = this;
  assert.ok(self instanceof Field);
  isString.assert(name);
  type = toType(type);
  var properties = {
    name: {value: name},
    type: {value: type},
    hidden: {value: !!hidden}
  };
  if (isFunction.check(defaultFn)) {
    properties.defaultFn = {value: defaultFn};
  }
  Object.defineProperties(self, properties);
}
var Fp = Field.prototype;
Fp.toString = function() {
  return JSON.stringify(this.name) + ": " + this.type;
};
Fp.getValue = function(obj) {
  var value = obj[this.name];
  if (!isUndefined.check(value))
    return value;
  if (this.defaultFn)
    value = this.defaultFn.call(obj);
  return value;
};
Type.def = function(typeName) {
  isString.assert(typeName);
  return hasOwn.call(defCache, typeName) ? defCache[typeName] : defCache[typeName] = new Def(typeName);
};
var defCache = Object.create(null);
function Def(typeName) {
  var self = this;
  assert.ok(self instanceof Def);
  Object.defineProperties(self, {
    typeName: {value: typeName},
    baseNames: {value: []},
    ownFields: {value: Object.create(null)},
    allSupertypes: {value: Object.create(null)},
    supertypeList: {value: []},
    allFields: {value: Object.create(null)},
    fieldNames: {value: []},
    type: {value: new Type(function(value, deep) {
        return self.check(value, deep);
      }, typeName)}
  });
}
Def.fromValue = function(value) {
  if (value && typeof value === "object") {
    var type = value.type;
    if (typeof type === "string" && hasOwn.call(defCache, type)) {
      var d = defCache[type];
      if (d.finalized) {
        return d;
      }
    }
  }
  return null;
};
var Dp = Def.prototype;
Dp.isSupertypeOf = function(that) {
  if (that instanceof Def) {
    assert.strictEqual(this.finalized, true);
    assert.strictEqual(that.finalized, true);
    return hasOwn.call(that.allSupertypes, this.typeName);
  } else {
    assert.ok(false, that + " is not a Def");
  }
};
exports.getSupertypeNames = function(typeName) {
  assert.ok(hasOwn.call(defCache, typeName));
  var d = defCache[typeName];
  assert.strictEqual(d.finalized, true);
  return d.supertypeList.slice(1);
};
exports.computeSupertypeLookupTable = function(candidates) {
  var table = {};
  var typeNames = Object.keys(defCache);
  var typeNameCount = typeNames.length;
  for (var i = 0; i < typeNameCount; ++i) {
    var typeName = typeNames[i];
    var d = defCache[typeName];
    assert.strictEqual(d.finalized, true);
    for (var j = 0; j < d.supertypeList.length; ++j) {
      var superTypeName = d.supertypeList[j];
      if (hasOwn.call(candidates, superTypeName)) {
        table[typeName] = superTypeName;
        break;
      }
    }
  }
  return table;
};
Dp.checkAllFields = function(value, deep) {
  var allFields = this.allFields;
  assert.strictEqual(this.finalized, true);
  function checkFieldByName(name) {
    var field = allFields[name];
    var type = field.type;
    var child = field.getValue(value);
    return type.check(child, deep);
  }
  return isObject.check(value) && Object.keys(allFields).every(checkFieldByName);
};
Dp.check = function(value, deep) {
  assert.strictEqual(this.finalized, true, "prematurely checking unfinalized type " + this.typeName);
  if (!isObject.check(value))
    return false;
  var vDef = Def.fromValue(value);
  if (!vDef) {
    if (this.typeName === "SourceLocation" || this.typeName === "Position") {
      return this.checkAllFields(value, deep);
    }
    return false;
  }
  if (deep && vDef === this)
    return this.checkAllFields(value, deep);
  if (!this.isSupertypeOf(vDef))
    return false;
  if (!deep)
    return true;
  return vDef.checkAllFields(value, deep) && this.checkAllFields(value, false);
};
Dp.bases = function() {
  var bases = this.baseNames;
  assert.strictEqual(this.finalized, false);
  each.call(arguments, function(baseName) {
    isString.assert(baseName);
    if (bases.indexOf(baseName) < 0)
      bases.push(baseName);
  });
  return this;
};
Object.defineProperty(Dp, "buildable", {value: false});
var builders = {};
exports.builders = builders;
var nodePrototype = {};
exports.defineMethod = function(name, func) {
  var old = nodePrototype[name];
  if (isUndefined.check(func)) {
    delete nodePrototype[name];
  } else {
    isFunction.assert(func);
    Object.defineProperty(nodePrototype, name, {
      enumerable: true,
      configurable: true,
      value: func
    });
  }
  return old;
};
Dp.build = function() {
  var self = this;
  Object.defineProperty(self, "buildParams", {
    value: slice.call(arguments),
    writable: false,
    enumerable: false,
    configurable: true
  });
  assert.strictEqual(self.finalized, false);
  isString.arrayOf().assert(self.buildParams);
  if (self.buildable) {
    return self;
  }
  self.field("type", self.typeName, function() {
    return self.typeName;
  });
  Object.defineProperty(self, "buildable", {value: true});
  Object.defineProperty(builders, getBuilderName(self.typeName), {
    enumerable: true,
    value: function() {
      var args = arguments;
      var argc = args.length;
      var built = Object.create(nodePrototype);
      assert.ok(self.finalized, "attempting to instantiate unfinalized type " + self.typeName);
      function add(param, i) {
        if (hasOwn.call(built, param))
          return;
        var all = self.allFields;
        assert.ok(hasOwn.call(all, param), param);
        var field = all[param];
        var type = field.type;
        var value;
        if (isNumber.check(i) && i < argc) {
          value = args[i];
        } else if (field.defaultFn) {
          value = field.defaultFn.call(built);
        } else {
          var message = "no value or default function given for field " + JSON.stringify(param) + " of " + self.typeName + "(" + self.buildParams.map(function(name) {
            return all[name];
          }).join(", ") + ")";
          assert.ok(false, message);
        }
        if (!type.check(value)) {
          assert.ok(false, shallowStringify(value) + " does not match field " + field + " of type " + self.typeName);
        }
        built[param] = value;
      }
      self.buildParams.forEach(function(param, i) {
        add(param, i);
      });
      Object.keys(self.allFields).forEach(function(param) {
        add(param);
      });
      assert.strictEqual(built.type, self.typeName);
      return built;
    }
  });
  return self;
};
function getBuilderName(typeName) {
  return typeName.replace(/^[A-Z]+/, function(upperCasePrefix) {
    var len = upperCasePrefix.length;
    switch (len) {
      case 0:
        return "";
      case 1:
        return upperCasePrefix.toLowerCase();
      default:
        return upperCasePrefix.slice(0, len - 1).toLowerCase() + upperCasePrefix.charAt(len - 1);
    }
  });
}
Dp.field = function(name, type, defaultFn, hidden) {
  assert.strictEqual(this.finalized, false);
  this.ownFields[name] = new Field(name, type, defaultFn, hidden);
  return this;
};
var namedTypes = {};
exports.namedTypes = namedTypes;
function getFieldNames(object) {
  var d = Def.fromValue(object);
  if (d) {
    return d.fieldNames.slice(0);
  }
  if ("type" in object) {
    assert.ok(false, "did not recognize object of type " + JSON.stringify(object.type));
  }
  return Object.keys(object);
}
exports.getFieldNames = getFieldNames;
function getFieldValue(object, fieldName) {
  var d = Def.fromValue(object);
  if (d) {
    var field = d.allFields[fieldName];
    if (field) {
      return field.getValue(object);
    }
  }
  return object[fieldName];
}
exports.getFieldValue = getFieldValue;
exports.eachField = function(object, callback, context) {
  getFieldNames(object).forEach(function(name) {
    callback.call(this, name, getFieldValue(object, name));
  }, context);
};
exports.someField = function(object, callback, context) {
  return getFieldNames(object).some(function(name) {
    return callback.call(this, name, getFieldValue(object, name));
  }, context);
};
Object.defineProperty(Dp, "finalized", {value: false});
Dp.finalize = function() {
  if (!this.finalized) {
    var allFields = this.allFields;
    var allSupertypes = this.allSupertypes;
    this.baseNames.forEach(function(name) {
      var def = defCache[name];
      def.finalize();
      extend(allFields, def.allFields);
      extend(allSupertypes, def.allSupertypes);
    });
    extend(allFields, this.ownFields);
    allSupertypes[this.typeName] = this;
    this.fieldNames.length = 0;
    for (var fieldName in allFields) {
      if (hasOwn.call(allFields, fieldName) && !allFields[fieldName].hidden) {
        this.fieldNames.push(fieldName);
      }
    }
    Object.defineProperty(namedTypes, this.typeName, {
      enumerable: true,
      value: this.type
    });
    Object.defineProperty(this, "finalized", {value: true});
    populateSupertypeList(this.typeName, this.supertypeList);
  }
};
function populateSupertypeList(typeName, list) {
  list.length = 0;
  list.push(typeName);
  var lastSeen = Object.create(null);
  for (var pos = 0; pos < list.length; ++pos) {
    typeName = list[pos];
    var d = defCache[typeName];
    assert.strictEqual(d.finalized, true);
    if (hasOwn.call(lastSeen, typeName)) {
      delete list[lastSeen[typeName]];
    }
    lastSeen[typeName] = pos;
    list.push.apply(list, d.baseNames);
  }
  for (var to = 0,
      from = to,
      len = list.length; from < len; ++from) {
    if (hasOwn.call(list, from)) {
      list[to++] = list[from];
    }
  }
  list.length = to;
}
function extend(into, from) {
  Object.keys(from).forEach(function(name) {
    into[name] = from[name];
  });
  return into;
}
;
exports.finalize = function() {
  Object.keys(defCache).forEach(function(name) {
    defCache[name].finalize();
  });
};
