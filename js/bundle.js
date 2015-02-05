(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/uzimith/learn/flux-todo-practice/js/components/todo-count.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-count', '<span class="badge">{ count }</span>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.count = 0;

this.on('mount', (function(_this) {
  return function() {
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(items) {
    _this.count = items.length;
    return _this.update();
  };
})(this));

});
},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/components/todo.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo', '<ul><li each="{ items }"><label class="{ completed: done }"></label><input type="checkbox" onclick="{ parent.toggle }"><span>{ title }</span></li></ul><div class="row"><form onsubmit="{ add }" class="form-inline"><div class="form-group"><label for="taskinput">Task</label><input id="taskinput" name="input" onkeyup="{ edit }" class="form-control"></div><button __disabled="{ !text }" class="btn btn-default">Add { items.length + 1 }</button></form></div><div class="row"><button __disabled="{ !items.length }" onclick="{ remove }" class="btn btn-default">Remove</button></div>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.disabled = true;

this.items = [];

this.on('mount', (function(_this) {
  return function() {
    console.log('mount');
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(items) {
    console.log("changed");
    _this.items = items;
    return _this.update();
  };
})(this));

this.edit = (function(_this) {
  return function(e) {
    console.log("edit");
    return _this.text = e.target.value;
  };
})(this);

this.add = (function(_this) {
  return function(e) {
    console.log("add");
    if (_this.text) {
      RiotControl.trigger('todo_add', {
        title: _this.text
      });
      return _this.text = _this.input.value = '';
    }
  };
})(this);

this.toggle = (function(_this) {
  return function(e) {
    var item;
    console.log("toggle");
    item = e.item;
    item.done = !item.done;
    return true;
  };
})(this);

this.remove = (function(_this) {
  return function(e) {
    console.log("remove");
    return RiotControl.trigger('todo_remove');
  };
})(this);

});
},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/components/todoapp.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todoapp', '<header class="navbar navbar-default navbar-static-top"><div class="container"><div class="navbar-header"><div class="navbar-brand">Todo</div></div><nav class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a><todo-count></todo-count></a></li></ul></nav></div></header><div class="container"><todo title="Demo" class="col-md-6 col-md-offset-3"></todo></div>', function(opts) {

});
},{"riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js":[function(require,module,exports){
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

},{}],"/Users/uzimith/learn/flux-todo-practice/js/stores/todostore.coffee":[function(require,module,exports){
var TodoStore, riot;

riot = require('riot');

TodoStore = function() {
  riot.observable(this);
  this.todos = [
    {
      title: 'Task 1',
      done: false
    }, {
      title: 'Task 2',
      done: false
    }
  ];
  this.on('todo_add', (function(_this) {
    return function(newTodo) {
      _this.todos.push(newTodo);
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_remove', (function(_this) {
    return function() {
      _this.todos.pop();
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



},{"riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js":[function(require,module,exports){
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
},{}],"/Users/uzimith/learn/flux-todo-practice/node_modules/watchify/node_modules/browserify/node_modules/path-browserify/index.js":[function(require,module,exports){
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

},{"_process":"/Users/uzimith/learn/flux-todo-practice/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/uzimith/learn/flux-todo-practice/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

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
process.umask = function() { return 0; };

},{}],"/Users/uzimith/learn/flux-todo-practice":[function(require,module,exports){
(function (__dirname){
var RiotControl, TodoStore, normalizedPath, riot;

riot = require('riot');

TodoStore = require('./stores/todostore.coffee');

RiotControl = require('./riotcontrol');

normalizedPath = require("path").join(__dirname, "components");

require('./components/todoapp.tag');

require('./components/todo.tag');

require('./components/todo-count.tag');

RiotControl.addStore(new TodoStore);

riot.mount('todoapp');



}).call(this,"/js")

},{"./components/todo-count.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todo-count.tag","./components/todo.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todo.tag","./components/todoapp.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todoapp.tag","./riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","./stores/todostore.coffee":"/Users/uzimith/learn/flux-todo-practice/js/stores/todostore.coffee","path":"/Users/uzimith/learn/flux-todo-practice/node_modules/watchify/node_modules/browserify/node_modules/path-browserify/index.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}]},{},["/Users/uzimith/learn/flux-todo-practice"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvY29tcG9uZW50cy90b2RvLWNvdW50LnRhZyIsImpzL2NvbXBvbmVudHMvdG9kby50YWciLCJqcy9jb21wb25lbnRzL3RvZG9hcHAudGFnIiwiL1VzZXJzL3V6aW1pdGgvbGVhcm4vZmx1eC10b2RvLXByYWN0aWNlL2pzL3Jpb3Rjb250cm9sLmpzIiwiL1VzZXJzL3V6aW1pdGgvbGVhcm4vZmx1eC10b2RvLXByYWN0aWNlL2pzL3N0b3Jlcy90b2Rvc3RvcmUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3Jpb3QvcmlvdC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDanNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbnJpb3QudGFnKCd0b2RvLWNvdW50JywgJzxzcGFuIGNsYXNzPVwiYmFkZ2VcIj57IGNvdW50IH08L3NwYW4+JywgZnVuY3Rpb24ob3B0cykge3ZhciBSaW90Q29udHJvbDtcblxuUmlvdENvbnRyb2wgPSByZXF1aXJlKCcuLi9yaW90Y29udHJvbCcpO1xuXG50aGlzLmNvdW50ID0gMDtcblxudGhpcy5vbignbW91bnQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSaW90Q29udHJvbC50cmlnZ2VyKCd0b2RvX2luaXQnKTtcbiAgfTtcbn0pKHRoaXMpKTtcblxuUmlvdENvbnRyb2wub24oJ3RvZG9zX2NoYW5nZWQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgX3RoaXMuY291bnQgPSBpdGVtcy5sZW5ndGg7XG4gICAgcmV0dXJuIF90aGlzLnVwZGF0ZSgpO1xuICB9O1xufSkodGhpcykpO1xuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxucmlvdC50YWcoJ3RvZG8nLCAnPHVsPjxsaSBlYWNoPVwieyBpdGVtcyB9XCI+PGxhYmVsIGNsYXNzPVwieyBjb21wbGV0ZWQ6IGRvbmUgfVwiPjwvbGFiZWw+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uY2xpY2s9XCJ7IHBhcmVudC50b2dnbGUgfVwiPjxzcGFuPnsgdGl0bGUgfTwvc3Bhbj48L2xpPjwvdWw+PGRpdiBjbGFzcz1cInJvd1wiPjxmb3JtIG9uc3VibWl0PVwieyBhZGQgfVwiIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj48ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPjxsYWJlbCBmb3I9XCJ0YXNraW5wdXRcIj5UYXNrPC9sYWJlbD48aW5wdXQgaWQ9XCJ0YXNraW5wdXRcIiBuYW1lPVwiaW5wdXRcIiBvbmtleXVwPVwieyBlZGl0IH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvZGl2PjxidXR0b24gX19kaXNhYmxlZD1cInsgIXRleHQgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+QWRkIHsgaXRlbXMubGVuZ3RoICsgMSB9PC9idXR0b24+PC9mb3JtPjwvZGl2PjxkaXYgY2xhc3M9XCJyb3dcIj48YnV0dG9uIF9fZGlzYWJsZWQ9XCJ7ICFpdGVtcy5sZW5ndGggfVwiIG9uY2xpY2s9XCJ7IHJlbW92ZSB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5SZW1vdmU8L2J1dHRvbj48L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIFJpb3RDb250cm9sO1xuXG5SaW90Q29udHJvbCA9IHJlcXVpcmUoJy4uL3Jpb3Rjb250cm9sJyk7XG5cbnRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuXG50aGlzLml0ZW1zID0gW107XG5cbnRoaXMub24oJ21vdW50JywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnQnKTtcbiAgICByZXR1cm4gUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19pbml0Jyk7XG4gIH07XG59KSh0aGlzKSk7XG5cblJpb3RDb250cm9sLm9uKCd0b2Rvc19jaGFuZ2VkJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihpdGVtcykge1xuICAgIGNvbnNvbGUubG9nKFwiY2hhbmdlZFwiKTtcbiAgICBfdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIHJldHVybiBfdGhpcy51cGRhdGUoKTtcbiAgfTtcbn0pKHRoaXMpKTtcblxudGhpcy5lZGl0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coXCJlZGl0XCIpO1xuICAgIHJldHVybiBfdGhpcy50ZXh0ID0gZS50YXJnZXQudmFsdWU7XG4gIH07XG59KSh0aGlzKTtcblxudGhpcy5hZGQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcImFkZFwiKTtcbiAgICBpZiAoX3RoaXMudGV4dCkge1xuICAgICAgUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19hZGQnLCB7XG4gICAgICAgIHRpdGxlOiBfdGhpcy50ZXh0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfdGhpcy50ZXh0ID0gX3RoaXMuaW5wdXQudmFsdWUgPSAnJztcbiAgICB9XG4gIH07XG59KSh0aGlzKTtcblxudGhpcy50b2dnbGUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgaXRlbTtcbiAgICBjb25zb2xlLmxvZyhcInRvZ2dsZVwiKTtcbiAgICBpdGVtID0gZS5pdGVtO1xuICAgIGl0ZW0uZG9uZSA9ICFpdGVtLmRvbmU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59KSh0aGlzKTtcblxudGhpcy5yZW1vdmUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlbW92ZVwiKTtcbiAgICByZXR1cm4gUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19yZW1vdmUnKTtcbiAgfTtcbn0pKHRoaXMpO1xuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxucmlvdC50YWcoJ3RvZG9hcHAnLCAnPGhlYWRlciBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcFwiPjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPjxkaXYgY2xhc3M9XCJuYXZiYXItYnJhbmRcIj5Ub2RvPC9kaXY+PC9kaXY+PG5hdiBjbGFzcz1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZVwiPjx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodFwiPjxsaT48YT48dG9kby1jb3VudD48L3RvZG8tY291bnQ+PC9hPjwvbGk+PC91bD48L25hdj48L2Rpdj48L2hlYWRlcj48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PHRvZG8gdGl0bGU9XCJEZW1vXCIgY2xhc3M9XCJjb2wtbWQtNiBjb2wtbWQtb2Zmc2V0LTNcIj48L3RvZG8+PC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xuXG59KTsiLCJ2YXIgUmlvdENvbnRyb2wgPSB7XG4gIF9zdG9yZXM6IFtdLFxuICBhZGRTdG9yZShzdG9yZSkge1xuICAgIHRoaXMuX3N0b3Jlcy5wdXNoKHN0b3JlKVxuICB9LFxuICB0cmlnZ2VyKCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICB0aGlzLl9zdG9yZXMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4gICAgICAgIGVsLnRyaWdnZXIuYXBwbHkobnVsbCwgYXJncylcbiAgICAgIH0pXG4gIH0sXG4gIG9uKGV2LCBjYikge1xuICAgIHRoaXMuX3N0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICAgIGVsLm9uKGV2LCBjYilcbiAgICB9KVxuICB9LFxuICBvZmYoZXYsIGNiKSB7XG4gICAgdGhpcy5fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgaWYgKGNiKVxuICAgICAgICBlbC5vZmYoZXYsIGNiKVxuICAgICAgZWxzZVxuICAgICAgICBlbC5vZmYoZXYpXG4gICAgfSlcbiAgfSxcbiAgb25lKGV2LCBjYikge1xuICAgIHRoaXMuX3N0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICAgIGVsLm9uZShldiwgY2IpXG4gICAgfSlcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBSaW90Q29udHJvbFxuIiwicmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuVG9kb1N0b3JlID0gLT5cbiAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpXG5cbiAgQHRvZG9zID0gW1xuICAgIHsgdGl0bGU6ICdUYXNrIDEnLCBkb25lOiBmYWxzZX0sXG4gICAgeyB0aXRsZTogJ1Rhc2sgMicsIGRvbmU6IGZhbHNlfSxcbiAgXVxuXG4gIEBvbiAndG9kb19hZGQnLCAobmV3VG9kbykgPT5cbiAgICBAdG9kb3MucHVzaChuZXdUb2RvKVxuICAgIEB0cmlnZ2VyICd0b2Rvc19jaGFuZ2VkJywgQHRvZG9zXG5cbiAgQG9uICd0b2RvX3JlbW92ZScsID0+XG4gICAgQHRvZG9zLnBvcCgpXG4gICAgQHRyaWdnZXIgJ3RvZG9zX2NoYW5nZWQnLCBAdG9kb3NcblxuICBAb24gJ3RvZG9faW5pdCcsID0+XG4gICAgQHRyaWdnZXIgJ3RvZG9zX2NoYW5nZWQnLCBAdG9kb3NcblxubW9kdWxlLmV4cG9ydHMgPSBUb2RvU3RvcmVcbndpbmRvdy5Ub2RvU3RvcmUgPSBUb2RvU3RvcmVcbiIsIi8qIFJpb3QgMi4wLjcsIEBsaWNlbnNlIE1JVCwgKGMpIDIwMTUgTXV1dCBJbmMuICsgY29udHJpYnV0b3JzICovXG5cbjsoZnVuY3Rpb24oKSB7XG5cbnZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuMC43JyB9XG5cbid1c2Ugc3RyaWN0J1xuXG5yaW90Lm9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIGVsID0gZWwgfHwge31cblxuICB2YXIgY2FsbGJhY2tzID0ge31cblxuICBlbC5vbiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGV2ZW50cy5yZXBsYWNlKC9cXFMrL2csIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAoY2FsbGJhY2tzW25hbWVdID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdKS5wdXNoKGZuKVxuICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgZWwub2ZmID0gZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmIChldmVudHMgPT0gJyonKSBjYWxsYmFja3MgPSB7fVxuICAgIGVsc2UgaWYgKGZuKSB7XG4gICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW2V2ZW50c11cbiAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgKGNiID0gYXJyICYmIGFycltpXSk7ICsraSkge1xuICAgICAgICBpZiAoY2IgPT0gZm4pIHsgYXJyLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRzLnJlcGxhY2UoL1xcUysvZywgZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjYWxsYmFja3NbbmFtZV0gPSBbXVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvLyBvbmx5IHNpbmdsZSBldmVudCBzdXBwb3J0ZWRcbiAgZWwub25lID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAoZm4pIGZuLm9uZSA9IDFcbiAgICByZXR1cm4gZWwub24obmFtZSwgZm4pXG4gIH1cblxuICBlbC50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICBmbnMgPSBjYWxsYmFja3NbbmFtZV0gfHwgW11cblxuICAgIGZvciAodmFyIGkgPSAwLCBmbjsgKGZuID0gZm5zW2ldKTsgKytpKSB7XG4gICAgICBpZiAoIWZuLmJ1c3kpIHtcbiAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgIGlmIChmbi5vbmUpIHsgZm5zLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgICAgIGVsc2UgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH0gLy8gTWFrZXMgc2VsZi1yZW1vdmFsIHBvc3NpYmxlIGR1cmluZyBpdGVyYXRpb25cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIHJldHVybiBlbFxuXG59XG47KGZ1bmN0aW9uKHJpb3QsIGV2dCkge1xuXG4gIC8vIGJyb3dzZXJzIG9ubHlcbiAgaWYgKCF0aGlzLnRvcCkgcmV0dXJuXG5cbiAgdmFyIGxvYyA9IGxvY2F0aW9uLFxuICAgICAgZm5zID0gcmlvdC5vYnNlcnZhYmxlKCksXG4gICAgICBjdXJyZW50ID0gaGFzaCgpLFxuICAgICAgd2luID0gd2luZG93XG5cbiAgZnVuY3Rpb24gaGFzaCgpIHtcbiAgICByZXR1cm4gbG9jLmhhc2guc2xpY2UoMSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlcihwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChwYXRoKSB7XG4gICAgaWYgKHBhdGgudHlwZSkgcGF0aCA9IGhhc2goKVxuXG4gICAgaWYgKHBhdGggIT0gY3VycmVudCkge1xuICAgICAgZm5zLnRyaWdnZXIuYXBwbHkobnVsbCwgWydIJ10uY29uY2F0KHBhcnNlcihwYXRoKSkpXG4gICAgICBjdXJyZW50ID0gcGF0aFxuICAgIH1cbiAgfVxuXG4gIHZhciByID0gcmlvdC5yb3V0ZSA9IGZ1bmN0aW9uKGFyZykge1xuICAgIC8vIHN0cmluZ1xuICAgIGlmIChhcmdbMF0pIHtcbiAgICAgIGxvYy5oYXNoID0gYXJnXG4gICAgICBlbWl0KGFyZylcblxuICAgIC8vIGZ1bmN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGZucy5vbignSCcsIGFyZylcbiAgICB9XG4gIH1cblxuICByLmV4ZWMgPSBmdW5jdGlvbihmbikge1xuICAgIGZuLmFwcGx5KG51bGwsIHBhcnNlcihoYXNoKCkpKVxuICB9XG5cbiAgci5wYXJzZXIgPSBmdW5jdGlvbihmbikge1xuICAgIHBhcnNlciA9IGZuXG4gIH1cblxuICB3aW4uYWRkRXZlbnRMaXN0ZW5lciA/IHdpbi5hZGRFdmVudExpc3RlbmVyKGV2dCwgZW1pdCwgZmFsc2UpIDogd2luLmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIGVtaXQpXG5cbn0pKHJpb3QsICdoYXNoY2hhbmdlJylcbi8qXG5cbi8vLy8gSG93IGl0IHdvcmtzP1xuXG5cblRocmVlIHdheXM6XG5cbjEuIEV4cHJlc3Npb25zOiB0bXBsKCd7IHZhbHVlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgdGhlIHJlc3VsdCBvZiBldmFsdWF0ZWQgZXhwcmVzc2lvbiBhcyBhIHJhdyBvYmplY3QuXG5cbjIuIFRlbXBsYXRlczogdG1wbCgnSGkgeyBuYW1lIH0geyBzdXJuYW1lIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzdHJpbmcgd2l0aCBldmFsdWF0ZWQgZXhwcmVzc2lvbnMuXG5cbjMuIEZpbHRlcnM6IHRtcGwoJ3sgc2hvdzogIWRvbmUsIGhpZ2hsaWdodDogYWN0aXZlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiB0cnVlaXNoIGtleXMgKG1haW5seVxuICAgdXNlZCBmb3Igc2V0dGluZyBodG1sIGNsYXNzZXMpLCBlLmcuIFwic2hvdyBoaWdobGlnaHRcIi5cblxuXG4vLyBUZW1wbGF0ZSBleGFtcGxlc1xuXG50bXBsKCd7IHRpdGxlIHx8IFwiVW50aXRsZWRcIiB9JywgZGF0YSlcbnRtcGwoJ1Jlc3VsdHMgYXJlIHsgcmVzdWx0cyA/IFwicmVhZHlcIiA6IFwibG9hZGluZ1wiIH0nLCBkYXRhKVxudG1wbCgnVG9kYXkgaXMgeyBuZXcgRGF0ZSgpIH0nLCBkYXRhKVxudG1wbCgneyBtZXNzYWdlLmxlbmd0aCA+IDE0MCAmJiBcIk1lc3NhZ2UgaXMgdG9vIGxvbmdcIiB9JywgZGF0YSlcbnRtcGwoJ1RoaXMgaXRlbSBnb3QgeyBNYXRoLnJvdW5kKHJhdGluZykgfSBzdGFycycsIGRhdGEpXG50bXBsKCc8aDE+eyB0aXRsZSB9PC9oMT57IGJvZHkgfScsIGRhdGEpXG5cblxuLy8gRmFsc3kgZXhwcmVzc2lvbnMgaW4gdGVtcGxhdGVzXG5cbkluIHRlbXBsYXRlcyAoYXMgb3Bwb3NlZCB0byBzaW5nbGUgZXhwcmVzc2lvbnMpIGFsbCBmYWxzeSB2YWx1ZXNcbmV4Y2VwdCB6ZXJvICh1bmRlZmluZWQvbnVsbC9mYWxzZSkgd2lsbCBkZWZhdWx0IHRvIGVtcHR5IHN0cmluZzpcblxudG1wbCgneyB1bmRlZmluZWQgfSAtIHsgZmFsc2UgfSAtIHsgbnVsbCB9IC0geyAwIH0nLCB7fSlcbi8vIHdpbGwgcmV0dXJuOiBcIiAtIC0gLSAwXCJcblxuKi9cblxucmlvdC5fdG1wbCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgY2FjaGUgPSB7fSxcblxuICAgICAgLy8gZmluZCB2YXJpYWJsZSBuYW1lc1xuICAgICAgcmVfdmFycyA9IC8oXCJ8JykuKz9bXlxcXFxdXFwxfFxcLlxcdyp8XFx3Kjp8XFxiKD86dGhpc3x0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkfG5ld3x0eXBlb2Z8TnVtYmVyfFN0cmluZ3xPYmplY3R8QXJyYXl8TWF0aHxEYXRlfEpTT04pXFxifChbYS16X11cXHcqKS9naVxuICAgICAgICAgICAgICAvLyBbIDEgICAgICAgICAgICBdWyAyICBdWyAzIF1bIDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVsgNSAgICAgICBdXG4gICAgICAgICAgICAgIC8vIDEuIHNraXAgcXVvdGVkIHN0cmluZ3M6IFwiYSBiXCIsICdhIGInLCAnYSBcXCdiXFwnJ1xuICAgICAgICAgICAgICAvLyAyLiBza2lwIG9iamVjdCBwcm9wZXJ0aWVzOiAubmFtZVxuICAgICAgICAgICAgICAvLyAzLiBza2lwIG9iamVjdCBsaXRlcmFsczogbmFtZTpcbiAgICAgICAgICAgICAgLy8gNC4gc2tpcCByZXNlcnZlZCB3b3Jkc1xuICAgICAgICAgICAgICAvLyA1LiBtYXRjaCB2YXIgbmFtZVxuXG4gIC8vIGJ1aWxkIGEgdGVtcGxhdGUgKG9yIGdldCBpdCBmcm9tIGNhY2hlKSwgcmVuZGVyIHdpdGggZGF0YVxuXG4gIHJldHVybiBmdW5jdGlvbihzdHIsIGRhdGEpIHtcbiAgICByZXR1cm4gc3RyICYmIChjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSB8fCB0bXBsKHN0cikpKGRhdGEpXG4gIH1cblxuXG4gIC8vIGNyZWF0ZSBhIHRlbXBsYXRlIGluc3RhbmNlXG5cbiAgZnVuY3Rpb24gdG1wbChzLCBwKSB7XG4gICAgcCA9IChzIHx8ICd7fScpXG5cbiAgICAgIC8vIHRlbXBvcmFyaWx5IGNvbnZlcnQgXFx7IGFuZCBcXH0gdG8gYSBub24tY2hhcmFjdGVyXG4gICAgICAucmVwbGFjZSgvXFxcXHsvZywgJ1xcdUZGRjAnKVxuICAgICAgLnJlcGxhY2UoL1xcXFx9L2csICdcXHVGRkYxJylcblxuICAgICAgLy8gc3BsaXQgc3RyaW5nIHRvIGV4cHJlc3Npb24gYW5kIG5vbi1leHByZXNpb24gcGFydHNcbiAgICAgIC5zcGxpdCgvKHtbXFxzXFxTXSo/fSkvKVxuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignZCcsICdyZXR1cm4gJyArIChcblxuICAgICAgLy8gaXMgaXQgYSBzaW5nbGUgZXhwcmVzc2lvbiBvciBhIHRlbXBsYXRlPyBpLmUuIHt4fSBvciA8Yj57eH08L2I+XG4gICAgICAhcFswXSAmJiAhcFsyXVxuXG4gICAgICAgIC8vIGlmIGV4cHJlc3Npb24sIGV2YWx1YXRlIGl0XG4gICAgICAgID8gZXhwcihwWzFdKVxuXG4gICAgICAgIC8vIGlmIHRlbXBsYXRlLCBldmFsdWF0ZSBhbGwgZXhwcmVzc2lvbnMgaW4gaXRcbiAgICAgICAgOiAnWycgKyBwLm1hcChmdW5jdGlvbihzLCBpKSB7XG5cbiAgICAgICAgICAgIC8vIGlzIGl0IGFuIGV4cHJlc3Npb24gb3IgYSBzdHJpbmcgKGV2ZXJ5IHNlY29uZCBwYXJ0IGlzIGFuIGV4cHJlc3Npb24pXG4gICAgICAgICAgICByZXR1cm4gaSAlIDJcblxuICAgICAgICAgICAgICAvLyBldmFsdWF0ZSB0aGUgZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgPyBleHByKHMsIDEpXG5cbiAgICAgICAgICAgICAgLy8gcHJvY2VzcyBzdHJpbmcgcGFydHMgb2YgdGhlIHRlbXBsYXRlOlxuICAgICAgICAgICAgICA6ICdcIicgKyBzXG5cbiAgICAgICAgICAgICAgICAgIC8vIHByZXNlcnZlIG5ldyBsaW5lc1xuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxuXG4gICAgICAgICAgICAgICAgICAvLyBlc2NhcGUgcXVvdGVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpXG5cbiAgICAgICAgICAgICAgICArICdcIidcblxuICAgICAgICAgIH0pLmpvaW4oJywnKSArICddLmpvaW4oXCJcIiknXG4gICAgICApXG5cbiAgICAgIC8vIGJyaW5nIGVzY2FwZWQgeyBhbmQgfSBiYWNrXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMC9nLCAneycpXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMS9nLCAnfScpXG5cbiAgICApXG5cbiAgfVxuXG5cbiAgLy8gcGFyc2UgeyAuLi4gfSBleHByZXNzaW9uXG5cbiAgZnVuY3Rpb24gZXhwcihzLCBuKSB7XG4gICAgcyA9IHNcblxuICAgICAgLy8gY29udmVydCBuZXcgbGluZXMgdG8gc3BhY2VzXG4gICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcblxuICAgICAgLy8gdHJpbSB3aGl0ZXNwYWNlLCBjdXJseSBicmFja2V0cywgc3RyaXAgY29tbWVudHNcbiAgICAgIC5yZXBsYWNlKC9eW3sgXSt8WyB9XSskfFxcL1xcKi4rP1xcKlxcLy9nLCAnJylcblxuICAgIC8vIGlzIGl0IGFuIG9iamVjdCBsaXRlcmFsPyBpLmUuIHsga2V5IDogdmFsdWUgfVxuICAgIHJldHVybiAvXlxccypbXFx3LVwiJ10rICo6Ly50ZXN0KHMpXG5cbiAgICAgIC8vIGlmIG9iamVjdCBsaXRlcmFsLCByZXR1cm4gdHJ1ZWlzaCBrZXlzXG4gICAgICAvLyBlLmcuOiB7IHNob3c6IGlzT3BlbigpLCBkb25lOiBpdGVtLmRvbmUgfSAtPiBcInNob3cgZG9uZVwiXG4gICAgICA/ICdbJyArIHMucmVwbGFjZSgvXFxXKihbXFx3LV0rKVxcVyo6KFteLF0rKS9nLCBmdW5jdGlvbihfLCBrLCB2KSB7XG5cbiAgICAgICAgICAvLyBzYWZlbHkgZXhlY3V0ZSB2YXJzIHRvIHByZXZlbnQgdW5kZWZpbmVkIHZhbHVlIGVycm9yc1xuICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoL1xcd1teLHwmIF0qL2csIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHdyYXAodiwgbikgfSkgKyAnP1wiJyArIGsgKyAnXCI6XCJcIiwnXG5cbiAgICAgICAgfSkgKyAnXS5qb2luKFwiIFwiKSdcblxuICAgICAgLy8gaWYganMgZXhwcmVzc2lvbiwgZXZhbHVhdGUgYXMgamF2YXNjcmlwdFxuICAgICAgOiB3cmFwKHMsIG4pXG5cbiAgfVxuXG5cbiAgLy8gZXhlY3V0ZSBqcyB3L28gYnJlYWtpbmcgb24gZXJyb3JzIG9yIHVuZGVmaW5lZCB2YXJzXG5cbiAgZnVuY3Rpb24gd3JhcChzLCBub251bGwpIHtcbiAgICByZXR1cm4gJyhmdW5jdGlvbih2KXt0cnl7dj0nXG5cbiAgICAgICAgLy8gcHJlZml4IHZhcnMgKG5hbWUgPT4gZGF0YS5uYW1lKVxuICAgICAgICArIChzLnJlcGxhY2UocmVfdmFycywgZnVuY3Rpb24ocywgXywgdikgeyByZXR1cm4gdiA/ICdkLicgKyB2IDogcyB9KVxuXG4gICAgICAgICAgLy8gYnJlYWsgdGhlIGV4cHJlc3Npb24gaWYgaXRzIGVtcHR5IChyZXN1bHRpbmcgaW4gdW5kZWZpbmVkIHZhbHVlKVxuICAgICAgICAgIHx8ICd4JylcblxuICAgICAgKyAnfWZpbmFsbHl7cmV0dXJuICdcblxuICAgICAgICAvLyBkZWZhdWx0IHRvIGVtcHR5IHN0cmluZyBmb3IgZmFsc3kgdmFsdWVzIGV4Y2VwdCB6ZXJvXG4gICAgICAgICsgKG5vbnVsbCA/ICchdiYmdiE9PTA/XCJcIjp2JyA6ICd2JylcblxuICAgICAgKyAnfX0pLmNhbGwoZCknXG4gIH1cblxufSkoKVxuOyhmdW5jdGlvbihyaW90LCBpc19icm93c2VyKSB7XG5cbiAgaWYgKCFpc19icm93c2VyKSByZXR1cm5cblxuICB2YXIgdG1wbCA9IHJpb3QuX3RtcGwsXG4gICAgICBhbGxfdGFncyA9IFtdLFxuICAgICAgdGFnX2ltcGwgPSB7fSxcbiAgICAgIGRvYyA9IGRvY3VtZW50XG5cbiAgZnVuY3Rpb24gZWFjaChub2RlcywgZm4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IChub2RlcyB8fCBbXSkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChmbihub2Rlc1tpXSwgaSkgPT09IGZhbHNlKSBpLS1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBleHRlbmQob2JqLCBmcm9tKSB7XG4gICAgZnJvbSAmJiBPYmplY3Qua2V5cyhmcm9tKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICBvYmpba2V5XSA9IGZyb21ba2V5XVxuICAgIH0pXG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgZnVuY3Rpb24gZGlmZihhcnIxLCBhcnIyKSB7XG4gICAgcmV0dXJuIGFycjEuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gYXJyMi5pbmRleE9mKGVsKSA8IDBcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gd2Fsayhkb20sIGZuKSB7XG4gICAgZG9tID0gZm4oZG9tKSA9PT0gZmFsc2UgPyBkb20ubmV4dFNpYmxpbmcgOiBkb20uZmlyc3RDaGlsZFxuXG4gICAgd2hpbGUgKGRvbSkge1xuICAgICAgd2Fsayhkb20sIGZuKVxuICAgICAgZG9tID0gZG9tLm5leHRTaWJsaW5nXG4gICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBta2RvbSh0bXBsKSB7XG4gICAgdmFyIHRhZ19uYW1lID0gdG1wbC50cmltKCkuc2xpY2UoMSwgMykudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgcm9vdF90YWcgPSAvdGR8dGgvLnRlc3QodGFnX25hbWUpID8gJ3RyJyA6IHRhZ19uYW1lID09ICd0cicgPyAndGJvZHknIDogJ2RpdidcbiAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudChyb290X3RhZylcblxuICAgIGVsLmlubmVySFRNTCA9IHRtcGxcbiAgICByZXR1cm4gZWxcbiAgfVxuXG5cbiAgZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCBpbnN0YW5jZSkge1xuXG4gICAgLy8gYWxsb3cgcmVjYWxjdWxhdGlvbiBvZiBjb250ZXh0IGRhdGFcbiAgICBpbnN0YW5jZS50cmlnZ2VyKCd1cGRhdGUnKVxuXG4gICAgZWFjaChleHByZXNzaW9ucywgZnVuY3Rpb24oZXhwcikge1xuICAgICAgdmFyIHRhZyA9IGV4cHIudGFnLFxuICAgICAgICAgIGRvbSA9IGV4cHIuZG9tXG5cbiAgICAgIGZ1bmN0aW9uIHJlbUF0dHIobmFtZSkge1xuICAgICAgICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICB9XG5cbiAgICAgIC8vIGxvb3BzIGZpcnN0OiBUT0RPIHJlbW92ZSBmcm9tIGV4cHJlc3Npb25zIGFyclxuICAgICAgaWYgKGV4cHIubG9vcCkge1xuICAgICAgICByZW1BdHRyKCdlYWNoJylcbiAgICAgICAgcmV0dXJuIGxvb3AoZXhwciwgaW5zdGFuY2UpXG4gICAgICB9XG5cbiAgICAgIC8vIGN1c3RvbSB0YWdcbiAgICAgIGlmICh0YWcpIHJldHVybiB0YWcudXBkYXRlID8gdGFnLnVwZGF0ZSgpIDpcbiAgICAgICAgZXhwci50YWcgPSBjcmVhdGVUYWcoeyB0bXBsOiB0YWdbMF0sIGZuOiB0YWdbMV0sIHJvb3Q6IGRvbSwgcGFyZW50OiBpbnN0YW5jZSB9KVxuXG5cbiAgICAgIHZhciBhdHRyX25hbWUgPSBleHByLmF0dHIsXG4gICAgICAgICAgdmFsdWUgPSB0bXBsKGV4cHIuZXhwciwgaW5zdGFuY2UpXG5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9ICcnXG5cbiAgICAgIC8vIG5vIGNoYW5nZVxuICAgICAgaWYgKGV4cHIudmFsdWUgPT09IHZhbHVlKSByZXR1cm5cbiAgICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG5cbiAgICAgIC8vIHRleHQgbm9kZVxuICAgICAgaWYgKCFhdHRyX25hbWUpIHJldHVybiBkb20ubm9kZVZhbHVlID0gdmFsdWVcblxuICAgICAgLy8gYXR0cmlidXRlXG4gICAgICBpZiAoIXZhbHVlICYmIGV4cHIuYm9vbCB8fCAvb2JqfGZ1bmMvLnRlc3QodHlwZW9mIHZhbHVlKSkgcmVtQXR0cihhdHRyX25hbWUpXG5cbiAgICAgIC8vIGV2ZW50IGhhbmRsZXJcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkb21bYXR0cl9uYW1lXSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgIC8vIGNyb3NzIGJyb3dzZXIgZXZlbnQgZml4XG4gICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XG4gICAgICAgICAgZS53aGljaCA9IGUud2hpY2ggfHwgZS5jaGFyQ29kZSB8fCBlLmtleUNvZGVcbiAgICAgICAgICBlLnRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IGRvbVxuXG4gICAgICAgICAgLy8gY3VycmVudGx5IGxvb3BlZCBpdGVtXG4gICAgICAgICAgZS5pdGVtID0gaW5zdGFuY2UuX19pdGVtIHx8IGluc3RhbmNlXG5cbiAgICAgICAgICAvLyBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3VyIChieSBkZWZhdWx0KVxuICAgICAgICAgIGlmICh2YWx1ZS5jYWxsKGluc3RhbmNlLCBlKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCAmJiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpXG4gICAgICAgIH1cblxuICAgICAgLy8gc2hvdyAvIGhpZGUgLyBpZlxuICAgICAgfSBlbHNlIGlmICgvXihzaG93fGhpZGV8aWYpJC8udGVzdChhdHRyX25hbWUpKSB7XG4gICAgICAgIHJlbUF0dHIoYXR0cl9uYW1lKVxuICAgICAgICBpZiAoYXR0cl9uYW1lID09ICdoaWRlJykgdmFsdWUgPSAhdmFsdWVcbiAgICAgICAgZG9tLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG5cbiAgICAgIC8vIG5vcm1hbCBhdHRyaWJ1dGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChleHByLmJvb2wpIHtcbiAgICAgICAgICBkb21bYXR0cl9uYW1lXSA9IHZhbHVlXG4gICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuXG4gICAgICAgICAgdmFsdWUgPSBhdHRyX25hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCB2YWx1ZSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICBpbnN0YW5jZS50cmlnZ2VyKCd1cGRhdGVkJylcblxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2Uocm9vdCkge1xuXG4gICAgdmFyIG5hbWVkX2VsZW1lbnRzID0ge30sXG4gICAgICAgIGV4cHJlc3Npb25zID0gW11cblxuICAgIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG5cbiAgICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlLFxuICAgICAgICAgIHZhbHVlID0gZG9tLm5vZGVWYWx1ZVxuXG4gICAgICAvLyB0ZXh0IG5vZGVcbiAgICAgIGlmICh0eXBlID09IDMgJiYgZG9tLnBhcmVudE5vZGUudGFnTmFtZSAhPSAnU1RZTEUnKSB7XG4gICAgICAgIGFkZEV4cHIoZG9tLCB2YWx1ZSlcblxuICAgICAgLy8gZWxlbWVudFxuICAgICAgfSBlbHNlIGlmICh0eXBlID09IDEpIHtcblxuICAgICAgICAvLyBsb29wP1xuICAgICAgICB2YWx1ZSA9IGRvbS5nZXRBdHRyaWJ1dGUoJ2VhY2gnKVxuXG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIGFkZEV4cHIoZG9tLCB2YWx1ZSwgeyBsb29wOiAxIH0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjdXN0b20gdGFnP1xuICAgICAgICB2YXIgdGFnID0gdGFnX2ltcGxbZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cblxuICAgICAgICAvLyBhdHRyaWJ1dGVzXG4gICAgICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZSxcbiAgICAgICAgICAgICAgdmFsdWUgPSBhdHRyLnZhbHVlXG5cbiAgICAgICAgICAvLyBuYW1lZCBlbGVtZW50c1xuICAgICAgICAgIGlmICgvXihuYW1lfGlkKSQvLnRlc3QobmFtZSkpIG5hbWVkX2VsZW1lbnRzW3ZhbHVlXSA9IGRvbVxuXG4gICAgICAgICAgLy8gZXhwcmVzc2lvbnNcbiAgICAgICAgICBpZiAoIXRhZykge1xuICAgICAgICAgICAgdmFyIGJvb2wgPSBuYW1lLnNwbGl0KCdfXycpWzFdXG4gICAgICAgICAgICBhZGRFeHByKGRvbSwgdmFsdWUsIHsgYXR0cjogYm9vbCB8fCBuYW1lLCBib29sOiBib29sIH0pXG4gICAgICAgICAgICBpZiAoYm9vbCkge1xuICAgICAgICAgICAgICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIGlmICh0YWcpIGFkZEV4cHIoZG9tLCAwLCB7IHRhZzogdGFnIH0pXG5cbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZXR1cm4geyBleHByOiBleHByZXNzaW9ucywgZWxlbTogbmFtZWRfZWxlbWVudHMgfVxuXG4gICAgZnVuY3Rpb24gYWRkRXhwcihkb20sIHZhbHVlLCBkYXRhKSB7XG4gICAgICBpZiAodmFsdWUgPyB2YWx1ZS5pbmRleE9mKCd7JykgPj0gMCA6IGRhdGEpIHtcbiAgICAgICAgdmFyIGV4cHIgPSB7IGRvbTogZG9tLCBleHByOiB2YWx1ZSB9XG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKGV4cHIsIGRhdGEgfHwge30pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cblxuICAvLyBjcmVhdGUgbmV3IGN1c3RvbSB0YWcgKGNvbXBvbmVudClcbiAgZnVuY3Rpb24gY3JlYXRlVGFnKGNvbmYpIHtcblxuICAgIHZhciBvcHRzID0gY29uZi5vcHRzIHx8IHt9LFxuICAgICAgICBkb20gPSBta2RvbShjb25mLnRtcGwpLFxuICAgICAgICBtb3VudE5vZGUgPSBjb25mLnJvb3QsXG4gICAgICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxuICAgICAgICBhc3QgPSBwYXJzZShkb20pLFxuICAgICAgICB0YWcgPSB7IHJvb3Q6IG1vdW50Tm9kZSwgb3B0czogb3B0cywgcGFyZW50OiBwYXJlbnQsIF9faXRlbTogY29uZi5pdGVtIH0sXG4gICAgICAgIGF0dHJpYnV0ZXMgPSB7fVxuXG4gICAgLy8gbmFtZWQgZWxlbWVudHNcbiAgICBleHRlbmQodGFnLCBhc3QuZWxlbSlcblxuICAgIC8vIGF0dHJpYnV0ZXNcbiAgICBlYWNoKG1vdW50Tm9kZS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBhdHRyaWJ1dGVzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlXG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZU9wdHMoKSB7XG4gICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB2YXIgdmFsID0gb3B0c1tuYW1lXSA9IHRtcGwoYXR0cmlidXRlc1tuYW1lXSwgcGFyZW50IHx8IHRhZylcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpIG1vdW50Tm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlT3B0cygpXG5cbiAgICBpZiAoIXRhZy5vbikge1xuICAgICAgcmlvdC5vYnNlcnZhYmxlKHRhZylcbiAgICAgIGRlbGV0ZSB0YWcub2ZmIC8vIG9mZiBtZXRob2Qgbm90IG5lZWRlZFxuICAgIH1cblxuICAgIGlmIChjb25mLmZuKSBjb25mLmZuLmNhbGwodGFnLCBvcHRzKVxuXG5cbiAgICB0YWcudXBkYXRlID0gZnVuY3Rpb24oZGF0YSwgX3N5c3RlbSkge1xuXG4gICAgICAvKlxuICAgICAgICBJZiBsb29wIGlzIGRlZmluZWQgb24gdGhlIHJvb3Qgb2YgdGhlIEhUTUwgdGVtcGxhdGVcbiAgICAgICAgdGhlIG9yaWdpbmFsIHBhcmVudCBpcyBhIHRlbXBvcmFyeSA8ZGl2Lz4gYnkgbWtkb20oKVxuICAgICAgKi9cbiAgICAgIGlmIChwYXJlbnQgJiYgZG9tICYmICFkb20uZmlyc3RDaGlsZCkge1xuICAgICAgICBtb3VudE5vZGUgPSBwYXJlbnQucm9vdFxuICAgICAgICBkb20gPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmIChfc3lzdGVtIHx8IGRvYy5ib2R5LmNvbnRhaW5zKG1vdW50Tm9kZSkpIHtcbiAgICAgICAgZXh0ZW5kKHRhZywgZGF0YSlcbiAgICAgICAgZXh0ZW5kKHRhZywgdGFnLl9faXRlbSlcbiAgICAgICAgdXBkYXRlT3B0cygpXG4gICAgICAgIHVwZGF0ZShhc3QuZXhwciwgdGFnKVxuXG4gICAgICAgIC8vIHVwZGF0ZSBwYXJlbnRcbiAgICAgICAgIV9zeXN0ZW0gJiYgdGFnLl9faXRlbSAmJiBwYXJlbnQudXBkYXRlKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFnLnRyaWdnZXIoJ3VubW91bnQnKVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgdGFnLnVwZGF0ZSgwLCB0cnVlKVxuXG4gICAgLy8gYXBwZW5kIHRvIHJvb3RcbiAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGlmIChjb25mLmJlZm9yZSkgbW91bnROb2RlLmluc2VydEJlZm9yZShkb20uZmlyc3RDaGlsZCwgY29uZi5iZWZvcmUpXG4gICAgICBlbHNlIG1vdW50Tm9kZS5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZClcbiAgICB9XG5cblxuICAgIHRhZy50cmlnZ2VyKCdtb3VudCcpXG5cbiAgICBhbGxfdGFncy5wdXNoKHRhZylcblxuICAgIHJldHVybiB0YWdcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbG9vcChleHByLCBpbnN0YW5jZSkge1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBvbmNlXG4gICAgaWYgKGV4cHIuZG9uZSkgcmV0dXJuXG4gICAgZXhwci5kb25lID0gdHJ1ZVxuXG4gICAgdmFyIGRvbSA9IGV4cHIuZG9tLFxuICAgICAgICBwcmV2ID0gZG9tLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgcm9vdCA9IGRvbS5wYXJlbnROb2RlLFxuICAgICAgICB0ZW1wbGF0ZSA9IGRvbS5vdXRlckhUTUwsXG4gICAgICAgIHZhbCA9IGV4cHIuZXhwcixcbiAgICAgICAgZWxzID0gdmFsLnNwbGl0KC9cXHMraW5cXHMrLyksXG4gICAgICAgIHJlbmRlcmVkID0gW10sXG4gICAgICAgIGNoZWNrc3VtLFxuICAgICAgICBrZXlzXG5cblxuICAgIGlmIChlbHNbMV0pIHtcbiAgICAgIHZhbCA9ICd7ICcgKyBlbHNbMV1cbiAgICAgIGtleXMgPSBlbHNbMF0uc2xpY2UoMSkudHJpbSgpLnNwbGl0KC8sXFxzKi8pXG4gICAgfVxuXG4gICAgLy8gY2xlYW4gdGVtcGxhdGUgY29kZVxuICAgIGluc3RhbmNlLm9uZSgnbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwID0gZG9tLnBhcmVudE5vZGVcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIHJvb3QgPSBwXG4gICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoZG9tKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBzdGFydFBvcygpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHJvb3QuY2hpbGROb2RlcywgcHJldikgKyAxXG4gICAgfVxuXG4gICAgaW5zdGFuY2Uub24oJ3VwZGF0ZWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIGl0ZW1zID0gdG1wbCh2YWwsIGluc3RhbmNlKVxuICAgICAgICAgIGlzX2FycmF5ID0gQXJyYXkuaXNBcnJheShpdGVtcylcblxuICAgICAgaWYgKGlzX2FycmF5KSBpdGVtcyA9IGl0ZW1zLnNsaWNlKDApXG5cbiAgICAgIGVsc2Uge1xuXG4gICAgICAgIGlmICghaXRlbXMpIHJldHVybiAvLyBzb21lIElFOCBpc3N1ZVxuXG4gICAgICAgIC8vIGRldGVjdCBPYmplY3QgY2hhbmdlc1xuICAgICAgICB2YXIgdGVzdHN1bSA9IEpTT04uc3RyaW5naWZ5KGl0ZW1zKVxuICAgICAgICBpZiAodGVzdHN1bSA9PSBjaGVja3N1bSkgcmV0dXJuXG4gICAgICAgIGNoZWNrc3VtID0gdGVzdHN1bVxuXG4gICAgICAgIGl0ZW1zID0gT2JqZWN0LmtleXMoaXRlbXMpLm1hcChmdW5jdGlvbihrZXksIGkpIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IHt9XG4gICAgICAgICAgaXRlbVtrZXlzWzBdXSA9IGtleVxuICAgICAgICAgIGl0ZW1ba2V5c1sxXV0gPSBpdGVtc1trZXldXG4gICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgfSlcblxuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgcmVkdW5kYW50XG4gICAgICBkaWZmKHJlbmRlcmVkLCBpdGVtcykubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHBvcyA9IHJlbmRlcmVkLmluZGV4T2YoaXRlbSlcbiAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChyb290LmNoaWxkTm9kZXNbc3RhcnRQb3MoKSArIHBvc10pXG4gICAgICAgIHJlbmRlcmVkLnNwbGljZShwb3MsIDEpXG4gICAgICB9KVxuXG4gICAgICAvLyBhZGQgbmV3XG4gICAgICBkaWZmKGl0ZW1zLCByZW5kZXJlZCkubWFwKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgdmFyIHBvcyA9IGl0ZW1zLmluZGV4T2YoaXRlbSlcblxuICAgICAgICAvLyBzdHJpbmcgYXJyYXlcbiAgICAgICAgaWYgKGtleXMgJiYgIWNoZWNrc3VtKSB7XG4gICAgICAgICAgdmFyIG9iaiA9IHt9XG4gICAgICAgICAgb2JqW2tleXNbMF1dID0gaXRlbVxuICAgICAgICAgIG9ialtrZXlzWzFdXSA9IHBvc1xuICAgICAgICAgIGl0ZW0gPSBvYmpcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YWcgPSBjcmVhdGVUYWcoe1xuICAgICAgICAgIGJlZm9yZTogcm9vdC5jaGlsZE5vZGVzW3N0YXJ0UG9zKCkgKyBwb3NdLFxuICAgICAgICAgIHBhcmVudDogaW5zdGFuY2UsXG4gICAgICAgICAgdG1wbDogdGVtcGxhdGUsXG4gICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICByb290OiByb290XG4gICAgICAgIH0pXG5cbiAgICAgICAgaW5zdGFuY2Uub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRhZy51cGRhdGUoMCwgdHJ1ZSlcbiAgICAgICAgfSlcblxuICAgICAgfSlcblxuICAgICAgLy8gYXNzaWduIHJlbmRlcmVkXG4gICAgICByZW5kZXJlZCA9IGl0ZW1zXG5cbiAgICB9KVxuXG4gIH1cblxuICByaW90LnRhZyA9IGZ1bmN0aW9uKG5hbWUsIHRtcGwsIGZuKSB7XG4gICAgZm4gPSBmbiB8fCBub29wLFxuICAgIHRhZ19pbXBsW25hbWVdID0gW3RtcGwsIGZuXVxuICB9XG5cbiAgcmlvdC5tb3VudFRvID0gZnVuY3Rpb24obm9kZSwgdGFnTmFtZSwgb3B0cykge1xuICAgIHZhciB0YWcgPSB0YWdfaW1wbFt0YWdOYW1lXVxuICAgIHJldHVybiB0YWcgJiYgY3JlYXRlVGFnKHsgdG1wbDogdGFnWzBdLCBmbjogdGFnWzFdLCByb290OiBub2RlLCBvcHRzOiBvcHRzIH0pXG4gIH1cblxuICByaW90Lm1vdW50ID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9wdHMpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT0gJyonKSBzZWxlY3RvciA9IE9iamVjdC5rZXlzKHRhZ19pbXBsKS5qb2luKCcsICcpXG5cbiAgICB2YXIgaW5zdGFuY2VzID0gW11cblxuICAgIGVhY2goZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS5yaW90KSByZXR1cm5cblxuICAgICAgdmFyIHRhZ05hbWUgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICBpbnN0YW5jZSA9IHJpb3QubW91bnRUbyhub2RlLCB0YWdOYW1lLCBvcHRzKVxuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgaW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpXG4gICAgICAgIG5vZGUucmlvdCA9IDFcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGluc3RhbmNlc1xuICB9XG5cbiAgLy8gdXBkYXRlIGV2ZXJ5dGhpbmdcbiAgcmlvdC51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYWxsX3RhZ3MgPSBhbGxfdGFncy5maWx0ZXIoZnVuY3Rpb24odGFnKSB7XG4gICAgICByZXR1cm4gISF0YWcudXBkYXRlKClcbiAgICB9KVxuICB9XG5cbn0pKHJpb3QsIHRoaXMudG9wKVxuXG5cbi8vIHN1cHBvcnQgQ29tbW9uSlNcbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gIG1vZHVsZS5leHBvcnRzID0gcmlvdFxuXG4vLyBzdXBwb3J0IEFNRFxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiByaW90IH0pXG5cbi8vIHN1cHBvcnQgYnJvd3NlclxuZWxzZVxuICB0aGlzLnJpb3QgPSByaW90XG5cbn0pKCk7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
