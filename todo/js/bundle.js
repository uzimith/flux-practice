(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__dirname){
var RiotControl, TodoStore, normalizedPath, riot;

riot = require('riot');

TodoStore = require('./stores/todostore.coffee');

RiotControl = require('./riotcontrol');

normalizedPath = require("path").join(__dirname, "components");

require('./components/app.tag');

require('./components/todo.tag');

require('./components/todo-count.tag');

require('./components/todo-remove.tag');

require('./components/todo-item.tag');

RiotControl.addStore(new TodoStore);

riot.mount('*');



}).call(this,"/js")
},{"./components/app.tag":2,"./components/todo-count.tag":3,"./components/todo-item.tag":4,"./components/todo-remove.tag":5,"./components/todo.tag":6,"./riotcontrol":7,"./stores/todostore.coffee":8,"path":9,"riot":11}],2:[function(require,module,exports){
var riot = require('riot');

riot.tag('app', '<header class="navbar navbar-default navbar-static-top"><div class="container"><div class="navbar-header"><div class="navbar-brand">Todo</div></div><nav class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a><todo-count></todo-count></a></li></ul></nav></div></header><div class="container"><todo title="Demo" class="col-md-6 col-md-offset-3"></todo></div>', function(opts) {

});
},{"riot":11}],3:[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-count', '<span class="badge">{ count }</span><span> items left</span>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.count = 0;

this.on('mount', (function(_this) {
  return function() {
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(todos) {
    var item, _;
    _this.count = ((function() {
      var _results;
      _results = [];
      for (_ in todos) {
        item = todos[_];
        if (item.done === false) {
          _results.push(item);
        }
      }
      return _results;
    })()).length;
    return _this.update();
  };
})(this));

});
},{"../riotcontrol":7,"riot":11}],4:[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-item', '<div onmouseover="{ hover }" onmouseout="{ unhover }" class="clearfix todo { completed: opts.task.done }"><label><input type="checkbox" onclick="{ toggle }" __checked="{ opts.task.done }"><span> { opts.task.title } </span></label><button show="{isHover}" onclick="{ remove }" class="pull-right btn btn-xs btn-default"><span class="glyphicon glyphicon-remove"></span></button></div>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.isHover = false;

this.toggle = (function(_this) {
  return function(e) {
    RiotControl.trigger('todo_toggle', opts.task.id);
    return true;
  };
})(this);

this.remove = (function(_this) {
  return function(e) {
    return RiotControl.trigger('todo_remove', opts.task.id);
  };
})(this);

this.hover = (function(_this) {
  return function(e) {
    return _this.isHover = true;
  };
})(this);

this.unhover = (function(_this) {
  return function(e) {
    return _this.isHover = false;
  };
})(this);

});
},{"../riotcontrol":7,"riot":11}],5:[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-remove', '<button if="{ completed != 0}" onclick="{ remove }" class="pull-right btn btn-danger btn-xs">Clear completed ({ completed })</button>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.completed = 0;

this.on('mount', (function(_this) {
  return function() {
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(todos) {
    var item, _;
    _this.completed = ((function() {
      var _results;
      _results = [];
      for (_ in todos) {
        item = todos[_];
        if (item.done === true) {
          _results.push(item);
        }
      }
      return _results;
    })()).length;
    return _this.update();
  };
})(this));

this.remove = (function(_this) {
  return function(e) {
    return RiotControl.trigger('todo_removeCompleted');
  };
})(this);

});
},{"../riotcontrol":7,"riot":11}],6:[function(require,module,exports){
var riot = require('riot');

riot.tag('todo', '<div class="row"><form onsubmit="{ add }" class="form-inline"><div class="form-group"><label for="taskinput">Task</label><input id="taskinput" name="input" onkeyup="{ edit }" class="form-control"></div><button __disabled="{ !text }" class="btn btn-default">Add</button></form></div><ul class="list-group"><li each="{ _, task in todos }" class="list-group-item"><todo-item task="{task}"></todo-item></li></ul><div class="row"><todo-remove></todo-remove></div>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.disabled = true;

this.todos = {};

this.on('mount', (function(_this) {
  return function() {
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(todos) {
    _this.todos = todos;
    return _this.update();
  };
})(this));

this.edit = (function(_this) {
  return function(e) {
    return _this.text = e.target.value;
  };
})(this);

this.add = (function(_this) {
  return function(e) {
    if (_this.text) {
      RiotControl.trigger('todo_add', {
        title: _this.text,
        done: false
      });
      return _this.text = _this.input.value = '';
    }
  };
})(this);

});
},{"../riotcontrol":7,"riot":11}],7:[function(require,module,exports){
"use strict";

var RiotControl = {
  _stores: [],
  addStore: function addStore(store) {
    this._stores.push(store);
  },
  trigger: function trigger() {
    var args = [].slice.call(arguments);
    this._stores.forEach(function (el) {
      el.trigger.apply(null, args);
    });
  },
  on: function on(ev, cb) {
    this._stores.forEach(function (el) {
      el.on(ev, cb);
    });
  },
  off: function off(ev, cb) {
    this._stores.forEach(function (el) {
      if (cb) el.off(ev, cb);else el.off(ev);
    });
  },
  one: function one(ev, cb) {
    this._stores.forEach(function (el) {
      el.one(ev, cb);
    });
  }
};
module.exports = RiotControl;

},{}],8:[function(require,module,exports){
var TodoStore, riot;

riot = require('riot');

TodoStore = function() {
  riot.observable(this);
  this.todos = {};
  this.on('todo_add', (function(_this) {
    return function(newTodo) {
      var id;
      console.log(newTodo);
      id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
      newTodo['id'] = id;
      _this.todos[id] = newTodo;
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_remove', (function(_this) {
    return function(id) {
      delete _this.todos[id];
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_toggle', (function(_this) {
    return function(id) {
      console.log(id);
      _this.todos[id].done = !_this.todos[id].done;
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_removeCompleted', (function(_this) {
    return function() {
      var id, task, _ref;
      _ref = _this.todos;
      for (id in _ref) {
        task = _ref[id];
        if (task.done) {
          delete _this.todos[task.id];
        }
      }
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  return this.on('todo_init', (function(_this) {
    return function() {
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
};

module.exports = TodoStore;

window.TodoStore = TodoStore;



},{"riot":11}],9:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":10}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],11:[function(require,module,exports){
/* Riot 2.0.7, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function() {

var riot = { version: 'v2.0.7' }

'use strict'

riot.observable = function(el) {

  el = el || {}

  var callbacks = {}

  el.on = function(events, fn) {
    if (typeof fn == 'function') {
      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn)
        fn.typed = pos > 0
      })
    }
    return el
  }

  el.off = function(events, fn) {
    if (events == '*') callbacks = {}
    else if (fn) {
      var arr = callbacks[events]
      for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
        if (cb == fn) { arr.splice(i, 1); i-- }
      }
    } else {
      events.replace(/\S+/g, function(name) {
        callbacks[name] = []
      })
    }
    return el
  }

  // only single event supported
  el.one = function(name, fn) {
    if (fn) fn.one = 1
    return el.on(name, fn)
  }

  el.trigger = function(name) {
    var args = [].slice.call(arguments, 1),
        fns = callbacks[name] || []

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = 1
        fn.apply(el, fn.typed ? [name].concat(args) : args)
        if (fn.one) { fns.splice(i, 1); i-- }
         else if (fns[i] !== fn) { i-- } // Makes self-removal possible during iteration
        fn.busy = 0
      }
    }

    return el
  }

  return el

}
;(function(riot, evt) {

  // browsers only
  if (!this.top) return

  var loc = location,
      fns = riot.observable(),
      current = hash(),
      win = window

  function hash() {
    return loc.hash.slice(1)
  }

  function parser(path) {
    return path.split('/')
  }

  function emit(path) {
    if (path.type) path = hash()

    if (path != current) {
      fns.trigger.apply(null, ['H'].concat(parser(path)))
      current = path
    }
  }

  var r = riot.route = function(arg) {
    // string
    if (arg[0]) {
      loc.hash = arg
      emit(arg)

    // function
    } else {
      fns.on('H', arg)
    }
  }

  r.exec = function(fn) {
    fn.apply(null, parser(hash()))
  }

  r.parser = function(fn) {
    parser = fn
  }

  win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)

})(riot, 'hashchange')
/*

//// How it works?


Three ways:

1. Expressions: tmpl('{ value }', data).
   Returns the result of evaluated expression as a raw object.

2. Templates: tmpl('Hi { name } { surname }', data).
   Returns a string with evaluated expressions.

3. Filters: tmpl('{ show: !done, highlight: active }', data).
   Returns a space separated list of trueish keys (mainly
   used for setting html classes), e.g. "show highlight".


// Template examples

tmpl('{ title || "Untitled" }', data)
tmpl('Results are { results ? "ready" : "loading" }', data)
tmpl('Today is { new Date() }', data)
tmpl('{ message.length > 140 && "Message is too long" }', data)
tmpl('This item got { Math.round(rating) } stars', data)
tmpl('<h1>{ title }</h1>{ body }', data)


// Falsy expressions in templates

In templates (as opposed to single expressions) all falsy values
except zero (undefined/null/false) will default to empty string:

tmpl('{ undefined } - { false } - { null } - { 0 }', {})
// will return: " - - - 0"

*/

riot._tmpl = (function() {

  var cache = {},

      // find variable names
      re_vars = /("|').+?[^\\]\1|\.\w*|\w*:|\b(?:this|true|false|null|undefined|new|typeof|Number|String|Object|Array|Math|Date|JSON)\b|([a-z_]\w*)/gi
              // [ 1            ][ 2  ][ 3 ][ 4                                                                                        ][ 5       ]
              // 1. skip quoted strings: "a b", 'a b', 'a \'b\''
              // 2. skip object properties: .name
              // 3. skip object literals: name:
              // 4. skip reserved words
              // 5. match var name

  // build a template (or get it from cache), render with data

  return function(str, data) {
    return str && (cache[str] = cache[str] || tmpl(str))(data)
  }


  // create a template instance

  function tmpl(s, p) {
    p = (s || '{}')

      // temporarily convert \{ and \} to a non-character
      .replace(/\\{/g, '\uFFF0')
      .replace(/\\}/g, '\uFFF1')

      // split string to expression and non-expresion parts
      .split(/({[\s\S]*?})/)

    return new Function('d', 'return ' + (

      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
      !p[0] && !p[2]

        // if expression, evaluate it
        ? expr(p[1])

        // if template, evaluate all expressions in it
        : '[' + p.map(function(s, i) {

            // is it an expression or a string (every second part is an expression)
            return i % 2

              // evaluate the expressions
              ? expr(s, 1)

              // process string parts of the template:
              : '"' + s

                  // preserve new lines
                  .replace(/\n/g, '\\n')

                  // escape quotes
                  .replace(/"/g, '\\"')

                + '"'

          }).join(',') + '].join("")'
      )

      // bring escaped { and } back
      .replace(/\uFFF0/g, '{')
      .replace(/\uFFF1/g, '}')

    )

  }


  // parse { ... } expression

  function expr(s, n) {
    s = s

      // convert new lines to spaces
      .replace(/\n/g, ' ')

      // trim whitespace, curly brackets, strip comments
      .replace(/^[{ ]+|[ }]+$|\/\*.+?\*\//g, '')

    // is it an object literal? i.e. { key : value }
    return /^\s*[\w-"']+ *:/.test(s)

      // if object literal, return trueish keys
      // e.g.: { show: isOpen(), done: item.done } -> "show done"
      ? '[' + s.replace(/\W*([\w-]+)\W*:([^,]+)/g, function(_, k, v) {

          // safely execute vars to prevent undefined value errors
          return v.replace(/\w[^,|& ]*/g, function(v) { return wrap(v, n) }) + '?"' + k + '":"",'

        }) + '].join(" ")'

      // if js expression, evaluate as javascript
      : wrap(s, n)

  }


  // execute js w/o breaking on errors or undefined vars

  function wrap(s, nonull) {
    return '(function(v){try{v='

        // prefix vars (name => data.name)
        + (s.replace(re_vars, function(s, _, v) { return v ? 'd.' + v : s })

          // break the expression if its empty (resulting in undefined value)
          || 'x')

      + '}finally{return '

        // default to empty string for falsy values except zero
        + (nonull ? '!v&&v!==0?"":v' : 'v')

      + '}}).call(d)'
  }

})()
;(function(riot, is_browser) {

  if (!is_browser) return

  var tmpl = riot._tmpl,
      all_tags = [],
      tag_impl = {},
      doc = document

  function each(nodes, fn) {
    for (var i = 0; i < (nodes || []).length; i++) {
      if (fn(nodes[i], i) === false) i--
    }
  }

  function extend(obj, from) {
    from && Object.keys(from).map(function(key) {
      obj[key] = from[key]
    })
    return obj
  }

  function diff(arr1, arr2) {
    return arr1.filter(function(el) {
      return arr2.indexOf(el) < 0
    })
  }

  function walk(dom, fn) {
    dom = fn(dom) === false ? dom.nextSibling : dom.firstChild

    while (dom) {
      walk(dom, fn)
      dom = dom.nextSibling
    }
  }


  function mkdom(tmpl) {
    var tag_name = tmpl.trim().slice(1, 3).toLowerCase(),
        root_tag = /td|th/.test(tag_name) ? 'tr' : tag_name == 'tr' ? 'tbody' : 'div'
        el = doc.createElement(root_tag)

    el.innerHTML = tmpl
    return el
  }


  function update(expressions, instance) {

    // allow recalculation of context data
    instance.trigger('update')

    each(expressions, function(expr) {
      var tag = expr.tag,
          dom = expr.dom

      function remAttr(name) {
        dom.removeAttribute(name)
      }

      // loops first: TODO remove from expressions arr
      if (expr.loop) {
        remAttr('each')
        return loop(expr, instance)
      }

      // custom tag
      if (tag) return tag.update ? tag.update() :
        expr.tag = createTag({ tmpl: tag[0], fn: tag[1], root: dom, parent: instance })


      var attr_name = expr.attr,
          value = tmpl(expr.expr, instance)

      if (value == null) value = ''

      // no change
      if (expr.value === value) return
      expr.value = value


      // text node
      if (!attr_name) return dom.nodeValue = value

      // attribute
      if (!value && expr.bool || /obj|func/.test(typeof value)) remAttr(attr_name)

      // event handler
      if (typeof value == 'function') {
        dom[attr_name] = function(e) {

          // cross browser event fix
          e = e || window.event
          e.which = e.which || e.charCode || e.keyCode
          e.target = e.target || e.srcElement
          e.currentTarget = dom

          // currently looped item
          e.item = instance.__item || instance

          // prevent default behaviour (by default)
          if (value.call(instance, e) !== true) {
            e.preventDefault && e.preventDefault()
            e.returnValue = false
          }

          instance.update()
        }

      // show / hide / if
      } else if (/^(show|hide|if)$/.test(attr_name)) {
        remAttr(attr_name)
        if (attr_name == 'hide') value = !value
        dom.style.display = value ? '' : 'none'

      // normal attribute
      } else {
        if (expr.bool) {
          dom[attr_name] = value
          if (!value) return
          value = attr_name
        }

        dom.setAttribute(attr_name, value)
      }

    })

    instance.trigger('updated')

  }

  function parse(root) {

    var named_elements = {},
        expressions = []

    walk(root, function(dom) {

      var type = dom.nodeType,
          value = dom.nodeValue

      // text node
      if (type == 3 && dom.parentNode.tagName != 'STYLE') {
        addExpr(dom, value)

      // element
      } else if (type == 1) {

        // loop?
        value = dom.getAttribute('each')

        if (value) {
          addExpr(dom, value, { loop: 1 })
          return false
        }

        // custom tag?
        var tag = tag_impl[dom.tagName.toLowerCase()]

        // attributes
        each(dom.attributes, function(attr) {
          var name = attr.name,
              value = attr.value

          // named elements
          if (/^(name|id)$/.test(name)) named_elements[value] = dom

          // expressions
          if (!tag) {
            var bool = name.split('__')[1]
            addExpr(dom, value, { attr: bool || name, bool: bool })
            if (bool) {
              dom.removeAttribute(name)
              return false
            }
          }

        })

        if (tag) addExpr(dom, 0, { tag: tag })

      }

    })

    return { expr: expressions, elem: named_elements }

    function addExpr(dom, value, data) {
      if (value ? value.indexOf('{') >= 0 : data) {
        var expr = { dom: dom, expr: value }
        expressions.push(extend(expr, data || {}))
      }
    }
  }



  // create new custom tag (component)
  function createTag(conf) {

    var opts = conf.opts || {},
        dom = mkdom(conf.tmpl),
        mountNode = conf.root,
        parent = conf.parent,
        ast = parse(dom),
        tag = { root: mountNode, opts: opts, parent: parent, __item: conf.item },
        attributes = {}

    // named elements
    extend(tag, ast.elem)

    // attributes
    each(mountNode.attributes, function(attr) {
      attributes[attr.name] = attr.value
    })

    function updateOpts() {
      Object.keys(attributes).map(function(name) {
        var val = opts[name] = tmpl(attributes[name], parent || tag)
        if (typeof val == 'object') mountNode.removeAttribute(name)
      })
    }

    updateOpts()

    if (!tag.on) {
      riot.observable(tag)
      delete tag.off // off method not needed
    }

    if (conf.fn) conf.fn.call(tag, opts)


    tag.update = function(data, _system) {

      /*
        If loop is defined on the root of the HTML template
        the original parent is a temporary <div/> by mkdom()
      */
      if (parent && dom && !dom.firstChild) {
        mountNode = parent.root
        dom = null
      }

      if (_system || doc.body.contains(mountNode)) {
        extend(tag, data)
        extend(tag, tag.__item)
        updateOpts()
        update(ast.expr, tag)

        // update parent
        !_system && tag.__item && parent.update()
        return true

      } else {
        tag.trigger('unmount')
      }

    }

    tag.update(0, true)

    // append to root
    while (dom.firstChild) {
      if (conf.before) mountNode.insertBefore(dom.firstChild, conf.before)
      else mountNode.appendChild(dom.firstChild)
    }


    tag.trigger('mount')

    all_tags.push(tag)

    return tag
  }


  function loop(expr, instance) {

    // initialize once
    if (expr.done) return
    expr.done = true

    var dom = expr.dom,
        prev = dom.previousSibling,
        root = dom.parentNode,
        template = dom.outerHTML,
        val = expr.expr,
        els = val.split(/\s+in\s+/),
        rendered = [],
        checksum,
        keys


    if (els[1]) {
      val = '{ ' + els[1]
      keys = els[0].slice(1).trim().split(/,\s*/)
    }

    // clean template code
    instance.one('mount', function() {
      var p = dom.parentNode
      if (p) {
        root = p
        root.removeChild(dom)
      }
    })

    function startPos() {
      return Array.prototype.indexOf.call(root.childNodes, prev) + 1
    }

    instance.on('updated', function() {

      var items = tmpl(val, instance)
          is_array = Array.isArray(items)

      if (is_array) items = items.slice(0)

      else {

        if (!items) return // some IE8 issue

        // detect Object changes
        var testsum = JSON.stringify(items)
        if (testsum == checksum) return
        checksum = testsum

        items = Object.keys(items).map(function(key, i) {
          var item = {}
          item[keys[0]] = key
          item[keys[1]] = items[key]
          return item
        })

      }

      // remove redundant
      diff(rendered, items).map(function(item) {
        var pos = rendered.indexOf(item)
        root.removeChild(root.childNodes[startPos() + pos])
        rendered.splice(pos, 1)
      })

      // add new
      diff(items, rendered).map(function(item, i) {
        var pos = items.indexOf(item)

        // string array
        if (keys && !checksum) {
          var obj = {}
          obj[keys[0]] = item
          obj[keys[1]] = pos
          item = obj
        }

        var tag = createTag({
          before: root.childNodes[startPos() + pos],
          parent: instance,
          tmpl: template,
          item: item,
          root: root
        })

        instance.on('update', function() {
          tag.update(0, true)
        })

      })

      // assign rendered
      rendered = items

    })

  }

  riot.tag = function(name, tmpl, fn) {
    fn = fn || noop,
    tag_impl[name] = [tmpl, fn]
  }

  riot.mountTo = function(node, tagName, opts) {
    var tag = tag_impl[tagName]
    return tag && createTag({ tmpl: tag[0], fn: tag[1], root: node, opts: opts })
  }

  riot.mount = function(selector, opts) {
    if (selector == '*') selector = Object.keys(tag_impl).join(', ')

    var instances = []

    each(doc.querySelectorAll(selector), function(node) {
      if (node.riot) return

      var tagName = node.tagName.toLowerCase(),
          instance = riot.mountTo(node, tagName, opts)

      if (instance) {
        instances.push(instance)
        node.riot = 1
      }
    })

    return instances
  }

  // update everything
  riot.update = function() {
    return all_tags = all_tags.filter(function(tag) {
      return !!tag.update()
    })
  }

})(riot, this.top)


// support CommonJS
if (typeof exports === 'object')
  module.exports = riot

// support AMD
else if (typeof define === 'function' && define.amd)
  define(function() { return riot })

// support browser
else
  this.riot = riot

})();
},{}]},{},[1]);
