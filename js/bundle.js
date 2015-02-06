(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/uzimith/learn/flux-todo-practice/js/components/todo-count.tag":[function(require,module,exports){
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
  return function(items) {
    _this.count = items.length;
    return _this.update();
  };
})(this));

});
},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/components/todo-remove.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-remove', '<button onclick="{ remove }" class="btn btn-default">Clear completed ({ completed })</button>', function(opts) {var RiotControl;

RiotControl = require('../riotcontrol');

this.completed = 0;

this.on('mount', (function(_this) {
  return function() {
    return RiotControl.trigger('todo_init');
  };
})(this));

RiotControl.on('todos_changed', (function(_this) {
  return function(items) {
    var item;
    _this.items = items;
    console.log(items);
    _this.completed = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
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
},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/components/todo.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo', '<div class="row"><form onsubmit="{ add }" class="form-inline"><div class="form-group"><label for="taskinput">Task</label><input id="taskinput" name="input" onkeyup="{ edit }" class="form-control"></div><button __disabled="{ !text }" class="btn btn-default">Add</button></form></div><ul><li each="{ items }"><label class="{ completed: done }"></label><input type="checkbox" onclick="{ parent.toggle }" __checked="{done}"><span>{ title }</span></li></ul><div class="row"><button __disabled="{ !items.length }" onclick="{ remove }" class="btn btn-default">Remove</button></div>', function(opts) {var RiotControl;

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
        title: _this.text,
        done: false,
        id: _this.items.length + 1
      });
      return _this.text = _this.input.value = '';
    }
  };
})(this);

this.toggle = (function(_this) {
  return function(e) {
    console.log("toggle");
    console.log(e.target);
    return RiotControl.trigger('todo_toggle');
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

riot.tag('todoapp', '<header class="navbar navbar-default navbar-static-top"><div class="container"><div class="navbar-header"><div class="navbar-brand">Todo</div></div><nav class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a><todo-count></todo-count></a></li></ul></nav></div></header><div class="container"><todo title="Demo" class="col-md-6 col-md-offset-3"></todo><todo-remove></todo-remove></div>', function(opts) {

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
      id: 1,
      title: 'Task 1',
      done: false
    }, {
      id: 2,
      title: 'Task 2',
      done: true
    }
  ];
  this.on('todo_add', (function(_this) {
    return function(newTodo) {
      _this.todos.push(newTodo);
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_remove', (function(_this) {
    return function(id) {
      delete _this.todos[id];
      return _this.trigger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_removeCompleted', (function(_this) {
    return function() {
      var id, todo, _i, _len, _ref, _results;
      _ref = _this.todos;
      _results = [];
      for (id = _i = 0, _len = _ref.length; _i < _len; id = ++_i) {
        todo = _ref[id];
        if (todo.done) {
          _results.push(delete _this.todos[id]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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

require('./components/todo-remove.tag');

RiotControl.addStore(new TodoStore);

riot.mount('todoapp');



}).call(this,"/js")

},{"./components/todo-count.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todo-count.tag","./components/todo-remove.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todo-remove.tag","./components/todo.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todo.tag","./components/todoapp.tag":"/Users/uzimith/learn/flux-todo-practice/js/components/todoapp.tag","./riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","./stores/todostore.coffee":"/Users/uzimith/learn/flux-todo-practice/js/stores/todostore.coffee","path":"/Users/uzimith/learn/flux-todo-practice/node_modules/watchify/node_modules/browserify/node_modules/path-browserify/index.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}]},{},["/Users/uzimith/learn/flux-todo-practice"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvY29tcG9uZW50cy90b2RvLWNvdW50LnRhZyIsImpzL2NvbXBvbmVudHMvdG9kby1yZW1vdmUudGFnIiwianMvY29tcG9uZW50cy90b2RvLnRhZyIsImpzL2NvbXBvbmVudHMvdG9kb2FwcC50YWciLCIvVXNlcnMvdXppbWl0aC9sZWFybi9mbHV4LXRvZG8tcHJhY3RpY2UvanMvcmlvdGNvbnRyb2wuanMiLCIvVXNlcnMvdXppbWl0aC9sZWFybi9mbHV4LXRvZG8tcHJhY3RpY2UvanMvc3RvcmVzL3RvZG9zdG9yZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqc0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxucmlvdC50YWcoJ3RvZG8tY291bnQnLCAnPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnsgY291bnQgfTwvc3Bhbj48c3Bhbj4gaXRlbXMgbGVmdDwvc3Bhbj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIFJpb3RDb250cm9sO1xuXG5SaW90Q29udHJvbCA9IHJlcXVpcmUoJy4uL3Jpb3Rjb250cm9sJyk7XG5cbnRoaXMuY291bnQgPSAwO1xuXG50aGlzLm9uKCdtb3VudCcsIChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJpb3RDb250cm9sLnRyaWdnZXIoJ3RvZG9faW5pdCcpO1xuICB9O1xufSkodGhpcykpO1xuXG5SaW90Q29udHJvbC5vbigndG9kb3NfY2hhbmdlZCcsIChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICBfdGhpcy5jb3VudCA9IGl0ZW1zLmxlbmd0aDtcbiAgICByZXR1cm4gX3RoaXMudXBkYXRlKCk7XG4gIH07XG59KSh0aGlzKSk7XG5cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5yaW90LnRhZygndG9kby1yZW1vdmUnLCAnPGJ1dHRvbiBvbmNsaWNrPVwieyByZW1vdmUgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+Q2xlYXIgY29tcGxldGVkICh7IGNvbXBsZXRlZCB9KTwvYnV0dG9uPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgUmlvdENvbnRyb2w7XG5cblJpb3RDb250cm9sID0gcmVxdWlyZSgnLi4vcmlvdGNvbnRyb2wnKTtcblxudGhpcy5jb21wbGV0ZWQgPSAwO1xuXG50aGlzLm9uKCdtb3VudCcsIChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJpb3RDb250cm9sLnRyaWdnZXIoJ3RvZG9faW5pdCcpO1xuICB9O1xufSkodGhpcykpO1xuXG5SaW90Q29udHJvbC5vbigndG9kb3NfY2hhbmdlZCcsIChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICB2YXIgaXRlbTtcbiAgICBfdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIGNvbnNvbGUubG9nKGl0ZW1zKTtcbiAgICBfdGhpcy5jb21wbGV0ZWQgPSAoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGl0ZW1zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBpdGVtc1tfaV07XG4gICAgICAgIGlmIChpdGVtLmRvbmUgPT09IHRydWUpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfSkoKSkubGVuZ3RoO1xuICAgIHJldHVybiBfdGhpcy51cGRhdGUoKTtcbiAgfTtcbn0pKHRoaXMpKTtcblxudGhpcy5yZW1vdmUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19yZW1vdmVDb21wbGV0ZWQnKTtcbiAgfTtcbn0pKHRoaXMpO1xuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxucmlvdC50YWcoJ3RvZG8nLCAnPGRpdiBjbGFzcz1cInJvd1wiPjxmb3JtIG9uc3VibWl0PVwieyBhZGQgfVwiIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj48ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPjxsYWJlbCBmb3I9XCJ0YXNraW5wdXRcIj5UYXNrPC9sYWJlbD48aW5wdXQgaWQ9XCJ0YXNraW5wdXRcIiBuYW1lPVwiaW5wdXRcIiBvbmtleXVwPVwieyBlZGl0IH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvZGl2PjxidXR0b24gX19kaXNhYmxlZD1cInsgIXRleHQgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+QWRkPC9idXR0b24+PC9mb3JtPjwvZGl2Pjx1bD48bGkgZWFjaD1cInsgaXRlbXMgfVwiPjxsYWJlbCBjbGFzcz1cInsgY29tcGxldGVkOiBkb25lIH1cIj48L2xhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbmNsaWNrPVwieyBwYXJlbnQudG9nZ2xlIH1cIiBfX2NoZWNrZWQ9XCJ7ZG9uZX1cIj48c3Bhbj57IHRpdGxlIH08L3NwYW4+PC9saT48L3VsPjxkaXYgY2xhc3M9XCJyb3dcIj48YnV0dG9uIF9fZGlzYWJsZWQ9XCJ7ICFpdGVtcy5sZW5ndGggfVwiIG9uY2xpY2s9XCJ7IHJlbW92ZSB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5SZW1vdmU8L2J1dHRvbj48L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIFJpb3RDb250cm9sO1xuXG5SaW90Q29udHJvbCA9IHJlcXVpcmUoJy4uL3Jpb3Rjb250cm9sJyk7XG5cbnRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuXG50aGlzLml0ZW1zID0gW107XG5cbnRoaXMub24oJ21vdW50JywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnQnKTtcbiAgICByZXR1cm4gUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19pbml0Jyk7XG4gIH07XG59KSh0aGlzKSk7XG5cblJpb3RDb250cm9sLm9uKCd0b2Rvc19jaGFuZ2VkJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihpdGVtcykge1xuICAgIGNvbnNvbGUubG9nKFwiY2hhbmdlZFwiKTtcbiAgICBfdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIHJldHVybiBfdGhpcy51cGRhdGUoKTtcbiAgfTtcbn0pKHRoaXMpKTtcblxudGhpcy5lZGl0ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coXCJlZGl0XCIpO1xuICAgIHJldHVybiBfdGhpcy50ZXh0ID0gZS50YXJnZXQudmFsdWU7XG4gIH07XG59KSh0aGlzKTtcblxudGhpcy5hZGQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcImFkZFwiKTtcbiAgICBpZiAoX3RoaXMudGV4dCkge1xuICAgICAgUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb19hZGQnLCB7XG4gICAgICAgIHRpdGxlOiBfdGhpcy50ZXh0LFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgaWQ6IF90aGlzLml0ZW1zLmxlbmd0aCArIDFcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF90aGlzLnRleHQgPSBfdGhpcy5pbnB1dC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfTtcbn0pKHRoaXMpO1xuXG50aGlzLnRvZ2dsZSA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwidG9nZ2xlXCIpO1xuICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcbiAgICByZXR1cm4gUmlvdENvbnRyb2wudHJpZ2dlcigndG9kb190b2dnbGUnKTtcbiAgfTtcbn0pKHRoaXMpO1xuXG50aGlzLnJlbW92ZSA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlXCIpO1xuICAgIHJldHVybiBSaW90Q29udHJvbC50cmlnZ2VyKCd0b2RvX3JlbW92ZScpO1xuICB9O1xufSkodGhpcyk7XG5cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5yaW90LnRhZygndG9kb2FwcCcsICc8aGVhZGVyIGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wXCI+PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+PGRpdiBjbGFzcz1cIm5hdmJhci1icmFuZFwiPlRvZG88L2Rpdj48L2Rpdj48bmF2IGNsYXNzPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCI+PHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+PGxpPjxhPjx0b2RvLWNvdW50PjwvdG9kby1jb3VudD48L2E+PC9saT48L3VsPjwvbmF2PjwvZGl2PjwvaGVhZGVyPjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48dG9kbyB0aXRsZT1cIkRlbW9cIiBjbGFzcz1cImNvbC1tZC02IGNvbC1tZC1vZmZzZXQtM1wiPjwvdG9kbz48dG9kby1yZW1vdmU+PC90b2RvLXJlbW92ZT48L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbn0pOyIsInZhciBSaW90Q29udHJvbCA9IHtcbiAgX3N0b3JlczogW10sXG4gIGFkZFN0b3JlKHN0b3JlKSB7XG4gICAgdGhpcy5fc3RvcmVzLnB1c2goc3RvcmUpXG4gIH0sXG4gIHRyaWdnZXIoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgIHRoaXMuX3N0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgZWwudHJpZ2dlci5hcHBseShudWxsLCBhcmdzKVxuICAgICAgfSlcbiAgfSxcbiAgb24oZXYsIGNiKSB7XG4gICAgdGhpcy5fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgZWwub24oZXYsIGNiKVxuICAgIH0pXG4gIH0sXG4gIG9mZihldiwgY2IpIHtcbiAgICB0aGlzLl9zdG9yZXMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4gICAgICBpZiAoY2IpXG4gICAgICAgIGVsLm9mZihldiwgY2IpXG4gICAgICBlbHNlXG4gICAgICAgIGVsLm9mZihldilcbiAgICB9KVxuICB9LFxuICBvbmUoZXYsIGNiKSB7XG4gICAgdGhpcy5fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgZWwub25lKGV2LCBjYilcbiAgICB9KVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFJpb3RDb250cm9sXG4iLCJyaW90ID0gcmVxdWlyZSgncmlvdCcpXG5Ub2RvU3RvcmUgPSAtPlxuICByaW90Lm9ic2VydmFibGUodGhpcylcblxuICBAdG9kb3MgPSBbXG4gICAgeyBpZDogMSwgdGl0bGU6ICdUYXNrIDEnLCBkb25lOiBmYWxzZX0sXG4gICAgeyBpZDogMiwgdGl0bGU6ICdUYXNrIDInLCBkb25lOiB0cnVlfSxcbiAgXVxuXG4gIEBvbiAndG9kb19hZGQnLCAobmV3VG9kbykgPT5cbiAgICBAdG9kb3MucHVzaChuZXdUb2RvKVxuICAgIEB0cmlnZ2VyICd0b2Rvc19jaGFuZ2VkJywgQHRvZG9zXG5cbiAgQG9uICd0b2RvX3JlbW92ZScsIChpZCk9PlxuICAgIGRlbGV0ZSBAdG9kb3NbaWRdXG4gICAgQHRyaWdnZXIgJ3RvZG9zX2NoYW5nZWQnLCBAdG9kb3NcblxuICBAb24gJ3RvZG9fcmVtb3ZlQ29tcGxldGVkJywgPT5cbiAgICBmb3IgdG9kbyxpZCBpbiBAdG9kb3NcbiAgICAgIGlmIHRvZG8uZG9uZVxuICAgICAgICBkZWxldGUgQHRvZG9zW2lkXVxuXG4gIEBvbiAndG9kb19pbml0JywgPT5cbiAgICBAdHJpZ2dlciAndG9kb3NfY2hhbmdlZCcsIEB0b2Rvc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9TdG9yZVxud2luZG93LlRvZG9TdG9yZSA9IFRvZG9TdG9yZVxuIiwiLyogUmlvdCAyLjAuNywgQGxpY2Vuc2UgTUlULCAoYykgMjAxNSBNdXV0IEluYy4gKyBjb250cmlidXRvcnMgKi9cblxuOyhmdW5jdGlvbigpIHtcblxudmFyIHJpb3QgPSB7IHZlcnNpb246ICd2Mi4wLjcnIH1cblxuJ3VzZSBzdHJpY3QnXG5cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIHZhciBjYWxsYmFja3MgPSB7fVxuXG4gIGVsLm9uID0gZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZXZlbnRzLnJlcGxhY2UoL1xcUysvZywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG4gICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICBlbC5vZmYgPSBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKGV2ZW50cyA9PSAnKicpIGNhbGxiYWNrcyA9IHt9XG4gICAgZWxzZSBpZiAoZm4pIHtcbiAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbZXZlbnRzXVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyAoY2IgPSBhcnIgJiYgYXJyW2ldKTsgKytpKSB7XG4gICAgICAgIGlmIChjYiA9PSBmbikgeyBhcnIuc3BsaWNlKGksIDEpOyBpLS0gfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGNhbGxiYWNrc1tuYW1lXSA9IFtdXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8vIG9ubHkgc2luZ2xlIGV2ZW50IHN1cHBvcnRlZFxuICBlbC5vbmUgPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmIChmbikgZm4ub25lID0gMVxuICAgIHJldHVybiBlbC5vbihuYW1lLCBmbilcbiAgfVxuXG4gIGVsLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZucyA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGZuOyAoZm4gPSBmbnNbaV0pOyArK2kpIHtcbiAgICAgIGlmICghZm4uYnVzeSkge1xuICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgaWYgKGZuLm9uZSkgeyBmbnMuc3BsaWNlKGksIDEpOyBpLS0gfVxuICAgICAgICAgZWxzZSBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfSAvLyBNYWtlcyBzZWxmLXJlbW92YWwgcG9zc2libGUgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgcmV0dXJuIGVsXG5cbn1cbjsoZnVuY3Rpb24ocmlvdCwgZXZ0KSB7XG5cbiAgLy8gYnJvd3NlcnMgb25seVxuICBpZiAoIXRoaXMudG9wKSByZXR1cm5cblxuICB2YXIgbG9jID0gbG9jYXRpb24sXG4gICAgICBmbnMgPSByaW90Lm9ic2VydmFibGUoKSxcbiAgICAgIGN1cnJlbnQgPSBoYXNoKCksXG4gICAgICB3aW4gPSB3aW5kb3dcblxuICBmdW5jdGlvbiBoYXNoKCkge1xuICAgIHJldHVybiBsb2MuaGFzaC5zbGljZSgxKVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VyKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpXG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KHBhdGgpIHtcbiAgICBpZiAocGF0aC50eXBlKSBwYXRoID0gaGFzaCgpXG5cbiAgICBpZiAocGF0aCAhPSBjdXJyZW50KSB7XG4gICAgICBmbnMudHJpZ2dlci5hcHBseShudWxsLCBbJ0gnXS5jb25jYXQocGFyc2VyKHBhdGgpKSlcbiAgICAgIGN1cnJlbnQgPSBwYXRoXG4gICAgfVxuICB9XG5cbiAgdmFyIHIgPSByaW90LnJvdXRlID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgLy8gc3RyaW5nXG4gICAgaWYgKGFyZ1swXSkge1xuICAgICAgbG9jLmhhc2ggPSBhcmdcbiAgICAgIGVtaXQoYXJnKVxuXG4gICAgLy8gZnVuY3Rpb25cbiAgICB9IGVsc2Uge1xuICAgICAgZm5zLm9uKCdIJywgYXJnKVxuICAgIH1cbiAgfVxuXG4gIHIuZXhlYyA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgZm4uYXBwbHkobnVsbCwgcGFyc2VyKGhhc2goKSkpXG4gIH1cblxuICByLnBhcnNlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcGFyc2VyID0gZm5cbiAgfVxuXG4gIHdpbi5hZGRFdmVudExpc3RlbmVyID8gd2luLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBlbWl0LCBmYWxzZSkgOiB3aW4uYXR0YWNoRXZlbnQoJ29uJyArIGV2dCwgZW1pdClcblxufSkocmlvdCwgJ2hhc2hjaGFuZ2UnKVxuLypcblxuLy8vLyBIb3cgaXQgd29ya3M/XG5cblxuVGhyZWUgd2F5czpcblxuMS4gRXhwcmVzc2lvbnM6IHRtcGwoJ3sgdmFsdWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRlZCBleHByZXNzaW9uIGFzIGEgcmF3IG9iamVjdC5cblxuMi4gVGVtcGxhdGVzOiB0bXBsKCdIaSB7IG5hbWUgfSB7IHN1cm5hbWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHN0cmluZyB3aXRoIGV2YWx1YXRlZCBleHByZXNzaW9ucy5cblxuMy4gRmlsdGVyczogdG1wbCgneyBzaG93OiAhZG9uZSwgaGlnaGxpZ2h0OiBhY3RpdmUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIHRydWVpc2gga2V5cyAobWFpbmx5XG4gICB1c2VkIGZvciBzZXR0aW5nIGh0bWwgY2xhc3NlcyksIGUuZy4gXCJzaG93IGhpZ2hsaWdodFwiLlxuXG5cbi8vIFRlbXBsYXRlIGV4YW1wbGVzXG5cbnRtcGwoJ3sgdGl0bGUgfHwgXCJVbnRpdGxlZFwiIH0nLCBkYXRhKVxudG1wbCgnUmVzdWx0cyBhcmUgeyByZXN1bHRzID8gXCJyZWFkeVwiIDogXCJsb2FkaW5nXCIgfScsIGRhdGEpXG50bXBsKCdUb2RheSBpcyB7IG5ldyBEYXRlKCkgfScsIGRhdGEpXG50bXBsKCd7IG1lc3NhZ2UubGVuZ3RoID4gMTQwICYmIFwiTWVzc2FnZSBpcyB0b28gbG9uZ1wiIH0nLCBkYXRhKVxudG1wbCgnVGhpcyBpdGVtIGdvdCB7IE1hdGgucm91bmQocmF0aW5nKSB9IHN0YXJzJywgZGF0YSlcbnRtcGwoJzxoMT57IHRpdGxlIH08L2gxPnsgYm9keSB9JywgZGF0YSlcblxuXG4vLyBGYWxzeSBleHByZXNzaW9ucyBpbiB0ZW1wbGF0ZXNcblxuSW4gdGVtcGxhdGVzIChhcyBvcHBvc2VkIHRvIHNpbmdsZSBleHByZXNzaW9ucykgYWxsIGZhbHN5IHZhbHVlc1xuZXhjZXB0IHplcm8gKHVuZGVmaW5lZC9udWxsL2ZhbHNlKSB3aWxsIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nOlxuXG50bXBsKCd7IHVuZGVmaW5lZCB9IC0geyBmYWxzZSB9IC0geyBudWxsIH0gLSB7IDAgfScsIHt9KVxuLy8gd2lsbCByZXR1cm46IFwiIC0gLSAtIDBcIlxuXG4qL1xuXG5yaW90Ll90bXBsID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBjYWNoZSA9IHt9LFxuXG4gICAgICAvLyBmaW5kIHZhcmlhYmxlIG5hbWVzXG4gICAgICByZV92YXJzID0gLyhcInwnKS4rP1teXFxcXF1cXDF8XFwuXFx3KnxcXHcqOnxcXGIoPzp0aGlzfHRydWV8ZmFsc2V8bnVsbHx1bmRlZmluZWR8bmV3fHR5cGVvZnxOdW1iZXJ8U3RyaW5nfE9iamVjdHxBcnJheXxNYXRofERhdGV8SlNPTilcXGJ8KFthLXpfXVxcdyopL2dpXG4gICAgICAgICAgICAgIC8vIFsgMSAgICAgICAgICAgIF1bIDIgIF1bIDMgXVsgNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWyA1ICAgICAgIF1cbiAgICAgICAgICAgICAgLy8gMS4gc2tpcCBxdW90ZWQgc3RyaW5nczogXCJhIGJcIiwgJ2EgYicsICdhIFxcJ2JcXCcnXG4gICAgICAgICAgICAgIC8vIDIuIHNraXAgb2JqZWN0IHByb3BlcnRpZXM6IC5uYW1lXG4gICAgICAgICAgICAgIC8vIDMuIHNraXAgb2JqZWN0IGxpdGVyYWxzOiBuYW1lOlxuICAgICAgICAgICAgICAvLyA0LiBza2lwIHJlc2VydmVkIHdvcmRzXG4gICAgICAgICAgICAgIC8vIDUuIG1hdGNoIHZhciBuYW1lXG5cbiAgLy8gYnVpbGQgYSB0ZW1wbGF0ZSAob3IgZ2V0IGl0IGZyb20gY2FjaGUpLCByZW5kZXIgd2l0aCBkYXRhXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0ciwgZGF0YSkge1xuICAgIHJldHVybiBzdHIgJiYgKGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIHx8IHRtcGwoc3RyKSkoZGF0YSlcbiAgfVxuXG5cbiAgLy8gY3JlYXRlIGEgdGVtcGxhdGUgaW5zdGFuY2VcblxuICBmdW5jdGlvbiB0bXBsKHMsIHApIHtcbiAgICBwID0gKHMgfHwgJ3t9JylcblxuICAgICAgLy8gdGVtcG9yYXJpbHkgY29udmVydCBcXHsgYW5kIFxcfSB0byBhIG5vbi1jaGFyYWN0ZXJcbiAgICAgIC5yZXBsYWNlKC9cXFxcey9nLCAnXFx1RkZGMCcpXG4gICAgICAucmVwbGFjZSgvXFxcXH0vZywgJ1xcdUZGRjEnKVxuXG4gICAgICAvLyBzcGxpdCBzdHJpbmcgdG8gZXhwcmVzc2lvbiBhbmQgbm9uLWV4cHJlc2lvbiBwYXJ0c1xuICAgICAgLnNwbGl0KC8oe1tcXHNcXFNdKj99KS8pXG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdkJywgJ3JldHVybiAnICsgKFxuXG4gICAgICAvLyBpcyBpdCBhIHNpbmdsZSBleHByZXNzaW9uIG9yIGEgdGVtcGxhdGU/IGkuZS4ge3h9IG9yIDxiPnt4fTwvYj5cbiAgICAgICFwWzBdICYmICFwWzJdXG5cbiAgICAgICAgLy8gaWYgZXhwcmVzc2lvbiwgZXZhbHVhdGUgaXRcbiAgICAgICAgPyBleHByKHBbMV0pXG5cbiAgICAgICAgLy8gaWYgdGVtcGxhdGUsIGV2YWx1YXRlIGFsbCBleHByZXNzaW9ucyBpbiBpdFxuICAgICAgICA6ICdbJyArIHAubWFwKGZ1bmN0aW9uKHMsIGkpIHtcblxuICAgICAgICAgICAgLy8gaXMgaXQgYW4gZXhwcmVzc2lvbiBvciBhIHN0cmluZyAoZXZlcnkgc2Vjb25kIHBhcnQgaXMgYW4gZXhwcmVzc2lvbilcbiAgICAgICAgICAgIHJldHVybiBpICUgMlxuXG4gICAgICAgICAgICAgIC8vIGV2YWx1YXRlIHRoZSBleHByZXNzaW9uc1xuICAgICAgICAgICAgICA/IGV4cHIocywgMSlcblxuICAgICAgICAgICAgICAvLyBwcm9jZXNzIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGU6XG4gICAgICAgICAgICAgIDogJ1wiJyArIHNcblxuICAgICAgICAgICAgICAgICAgLy8gcHJlc2VydmUgbmV3IGxpbmVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzY2FwZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcblxuICAgICAgICAgICAgICAgICsgJ1wiJ1xuXG4gICAgICAgICAgfSkuam9pbignLCcpICsgJ10uam9pbihcIlwiKSdcbiAgICAgIClcblxuICAgICAgLy8gYnJpbmcgZXNjYXBlZCB7IGFuZCB9IGJhY2tcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYwL2csICd7JylcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYxL2csICd9JylcblxuICAgIClcblxuICB9XG5cblxuICAvLyBwYXJzZSB7IC4uLiB9IGV4cHJlc3Npb25cblxuICBmdW5jdGlvbiBleHByKHMsIG4pIHtcbiAgICBzID0gc1xuXG4gICAgICAvLyBjb252ZXJ0IG5ldyBsaW5lcyB0byBzcGFjZXNcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgJyAnKVxuXG4gICAgICAvLyB0cmltIHdoaXRlc3BhY2UsIGN1cmx5IGJyYWNrZXRzLCBzdHJpcCBjb21tZW50c1xuICAgICAgLnJlcGxhY2UoL15beyBdK3xbIH1dKyR8XFwvXFwqLis/XFwqXFwvL2csICcnKVxuXG4gICAgLy8gaXMgaXQgYW4gb2JqZWN0IGxpdGVyYWw/IGkuZS4geyBrZXkgOiB2YWx1ZSB9XG4gICAgcmV0dXJuIC9eXFxzKltcXHctXCInXSsgKjovLnRlc3QocylcblxuICAgICAgLy8gaWYgb2JqZWN0IGxpdGVyYWwsIHJldHVybiB0cnVlaXNoIGtleXNcbiAgICAgIC8vIGUuZy46IHsgc2hvdzogaXNPcGVuKCksIGRvbmU6IGl0ZW0uZG9uZSB9IC0+IFwic2hvdyBkb25lXCJcbiAgICAgID8gJ1snICsgcy5yZXBsYWNlKC9cXFcqKFtcXHctXSspXFxXKjooW14sXSspL2csIGZ1bmN0aW9uKF8sIGssIHYpIHtcblxuICAgICAgICAgIC8vIHNhZmVseSBleGVjdXRlIHZhcnMgdG8gcHJldmVudCB1bmRlZmluZWQgdmFsdWUgZXJyb3JzXG4gICAgICAgICAgcmV0dXJuIHYucmVwbGFjZSgvXFx3W14sfCYgXSovZywgZnVuY3Rpb24odikgeyByZXR1cm4gd3JhcCh2LCBuKSB9KSArICc/XCInICsgayArICdcIjpcIlwiLCdcblxuICAgICAgICB9KSArICddLmpvaW4oXCIgXCIpJ1xuXG4gICAgICAvLyBpZiBqcyBleHByZXNzaW9uLCBldmFsdWF0ZSBhcyBqYXZhc2NyaXB0XG4gICAgICA6IHdyYXAocywgbilcblxuICB9XG5cblxuICAvLyBleGVjdXRlIGpzIHcvbyBicmVha2luZyBvbiBlcnJvcnMgb3IgdW5kZWZpbmVkIHZhcnNcblxuICBmdW5jdGlvbiB3cmFwKHMsIG5vbnVsbCkge1xuICAgIHJldHVybiAnKGZ1bmN0aW9uKHYpe3RyeXt2PSdcblxuICAgICAgICAvLyBwcmVmaXggdmFycyAobmFtZSA9PiBkYXRhLm5hbWUpXG4gICAgICAgICsgKHMucmVwbGFjZShyZV92YXJzLCBmdW5jdGlvbihzLCBfLCB2KSB7IHJldHVybiB2ID8gJ2QuJyArIHYgOiBzIH0pXG5cbiAgICAgICAgICAvLyBicmVhayB0aGUgZXhwcmVzc2lvbiBpZiBpdHMgZW1wdHkgKHJlc3VsdGluZyBpbiB1bmRlZmluZWQgdmFsdWUpXG4gICAgICAgICAgfHwgJ3gnKVxuXG4gICAgICArICd9ZmluYWxseXtyZXR1cm4gJ1xuXG4gICAgICAgIC8vIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciBmYWxzeSB2YWx1ZXMgZXhjZXB0IHplcm9cbiAgICAgICAgKyAobm9udWxsID8gJyF2JiZ2IT09MD9cIlwiOnYnIDogJ3YnKVxuXG4gICAgICArICd9fSkuY2FsbChkKSdcbiAgfVxuXG59KSgpXG47KGZ1bmN0aW9uKHJpb3QsIGlzX2Jyb3dzZXIpIHtcblxuICBpZiAoIWlzX2Jyb3dzZXIpIHJldHVyblxuXG4gIHZhciB0bXBsID0gcmlvdC5fdG1wbCxcbiAgICAgIGFsbF90YWdzID0gW10sXG4gICAgICB0YWdfaW1wbCA9IHt9LFxuICAgICAgZG9jID0gZG9jdW1lbnRcblxuICBmdW5jdGlvbiBlYWNoKG5vZGVzLCBmbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgKG5vZGVzIHx8IFtdKS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGZuKG5vZGVzW2ldLCBpKSA9PT0gZmFsc2UpIGktLVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dGVuZChvYmosIGZyb20pIHtcbiAgICBmcm9tICYmIE9iamVjdC5rZXlzKGZyb20pLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIG9ialtrZXldID0gZnJvbVtrZXldXG4gICAgfSlcbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBmdW5jdGlvbiBkaWZmKGFycjEsIGFycjIpIHtcbiAgICByZXR1cm4gYXJyMS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBhcnIyLmluZGV4T2YoZWwpIDwgMFxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiB3YWxrKGRvbSwgZm4pIHtcbiAgICBkb20gPSBmbihkb20pID09PSBmYWxzZSA/IGRvbS5uZXh0U2libGluZyA6IGRvbS5maXJzdENoaWxkXG5cbiAgICB3aGlsZSAoZG9tKSB7XG4gICAgICB3YWxrKGRvbSwgZm4pXG4gICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG1rZG9tKHRtcGwpIHtcbiAgICB2YXIgdGFnX25hbWUgPSB0bXBsLnRyaW0oKS5zbGljZSgxLCAzKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICByb290X3RhZyA9IC90ZHx0aC8udGVzdCh0YWdfbmFtZSkgPyAndHInIDogdGFnX25hbWUgPT0gJ3RyJyA/ICd0Ym9keScgOiAnZGl2J1xuICAgICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KHJvb3RfdGFnKVxuXG4gICAgZWwuaW5uZXJIVE1MID0gdG1wbFxuICAgIHJldHVybiBlbFxuICB9XG5cblxuICBmdW5jdGlvbiB1cGRhdGUoZXhwcmVzc2lvbnMsIGluc3RhbmNlKSB7XG5cbiAgICAvLyBhbGxvdyByZWNhbGN1bGF0aW9uIG9mIGNvbnRleHQgZGF0YVxuICAgIGluc3RhbmNlLnRyaWdnZXIoJ3VwZGF0ZScpXG5cbiAgICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByKSB7XG4gICAgICB2YXIgdGFnID0gZXhwci50YWcsXG4gICAgICAgICAgZG9tID0gZXhwci5kb21cblxuICAgICAgZnVuY3Rpb24gcmVtQXR0cihuYW1lKSB7XG4gICAgICAgIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgIH1cblxuICAgICAgLy8gbG9vcHMgZmlyc3Q6IFRPRE8gcmVtb3ZlIGZyb20gZXhwcmVzc2lvbnMgYXJyXG4gICAgICBpZiAoZXhwci5sb29wKSB7XG4gICAgICAgIHJlbUF0dHIoJ2VhY2gnKVxuICAgICAgICByZXR1cm4gbG9vcChleHByLCBpbnN0YW5jZSlcbiAgICAgIH1cblxuICAgICAgLy8gY3VzdG9tIHRhZ1xuICAgICAgaWYgKHRhZykgcmV0dXJuIHRhZy51cGRhdGUgPyB0YWcudXBkYXRlKCkgOlxuICAgICAgICBleHByLnRhZyA9IGNyZWF0ZVRhZyh7IHRtcGw6IHRhZ1swXSwgZm46IHRhZ1sxXSwgcm9vdDogZG9tLCBwYXJlbnQ6IGluc3RhbmNlIH0pXG5cblxuICAgICAgdmFyIGF0dHJfbmFtZSA9IGV4cHIuYXR0cixcbiAgICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCBpbnN0YW5jZSlcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gJydcblxuICAgICAgLy8gbm8gY2hhbmdlXG4gICAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgICAgZXhwci52YWx1ZSA9IHZhbHVlXG5cblxuICAgICAgLy8gdGV4dCBub2RlXG4gICAgICBpZiAoIWF0dHJfbmFtZSkgcmV0dXJuIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZVxuXG4gICAgICAvLyBhdHRyaWJ1dGVcbiAgICAgIGlmICghdmFsdWUgJiYgZXhwci5ib29sIHx8IC9vYmp8ZnVuYy8udGVzdCh0eXBlb2YgdmFsdWUpKSByZW1BdHRyKGF0dHJfbmFtZSlcblxuICAgICAgLy8gZXZlbnQgaGFuZGxlclxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRvbVthdHRyX25hbWVdID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcbiAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnRcbiAgICAgICAgICBlLndoaWNoID0gZS53aGljaCB8fCBlLmNoYXJDb2RlIHx8IGUua2V5Q29kZVxuICAgICAgICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gZG9tXG5cbiAgICAgICAgICAvLyBjdXJyZW50bHkgbG9vcGVkIGl0ZW1cbiAgICAgICAgICBlLml0ZW0gPSBpbnN0YW5jZS5fX2l0ZW0gfHwgaW5zdGFuY2VcblxuICAgICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXIgKGJ5IGRlZmF1bHQpXG4gICAgICAgICAgaWYgKHZhbHVlLmNhbGwoaW5zdGFuY2UsIGUpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ICYmIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5zdGFuY2UudXBkYXRlKClcbiAgICAgICAgfVxuXG4gICAgICAvLyBzaG93IC8gaGlkZSAvIGlmXG4gICAgICB9IGVsc2UgaWYgKC9eKHNob3d8aGlkZXxpZikkLy50ZXN0KGF0dHJfbmFtZSkpIHtcbiAgICAgICAgcmVtQXR0cihhdHRyX25hbWUpXG4gICAgICAgIGlmIChhdHRyX25hbWUgPT0gJ2hpZGUnKSB2YWx1ZSA9ICF2YWx1ZVxuICAgICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgICAgLy8gbm9ybWFsIGF0dHJpYnV0ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgICAgIGRvbVthdHRyX25hbWVdID0gdmFsdWVcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm5cbiAgICAgICAgICB2YWx1ZSA9IGF0dHJfbmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIHZhbHVlKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIGluc3RhbmNlLnRyaWdnZXIoJ3VwZGF0ZWQnKVxuXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZShyb290KSB7XG5cbiAgICB2YXIgbmFtZWRfZWxlbWVudHMgPSB7fSxcbiAgICAgICAgZXhwcmVzc2lvbnMgPSBbXVxuXG4gICAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcblxuICAgICAgdmFyIHR5cGUgPSBkb20ubm9kZVR5cGUsXG4gICAgICAgICAgdmFsdWUgPSBkb20ubm9kZVZhbHVlXG5cbiAgICAgIC8vIHRleHQgbm9kZVxuICAgICAgaWYgKHR5cGUgPT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9ICdTVFlMRScpIHtcbiAgICAgICAgYWRkRXhwcihkb20sIHZhbHVlKVxuXG4gICAgICAvLyBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gMSkge1xuXG4gICAgICAgIC8vIGxvb3A/XG4gICAgICAgIHZhbHVlID0gZG9tLmdldEF0dHJpYnV0ZSgnZWFjaCcpXG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgYWRkRXhwcihkb20sIHZhbHVlLCB7IGxvb3A6IDEgfSlcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGN1c3RvbSB0YWc/XG4gICAgICAgIHZhciB0YWcgPSB0YWdfaW1wbFtkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXVxuXG4gICAgICAgIC8vIGF0dHJpYnV0ZXNcbiAgICAgICAgZWFjaChkb20uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxuICAgICAgICAgICAgICB2YWx1ZSA9IGF0dHIudmFsdWVcblxuICAgICAgICAgIC8vIG5hbWVkIGVsZW1lbnRzXG4gICAgICAgICAgaWYgKC9eKG5hbWV8aWQpJC8udGVzdChuYW1lKSkgbmFtZWRfZWxlbWVudHNbdmFsdWVdID0gZG9tXG5cbiAgICAgICAgICAvLyBleHByZXNzaW9uc1xuICAgICAgICAgIGlmICghdGFnKSB7XG4gICAgICAgICAgICB2YXIgYm9vbCA9IG5hbWUuc3BsaXQoJ19fJylbMV1cbiAgICAgICAgICAgIGFkZEV4cHIoZG9tLCB2YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICAgIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRhZykgYWRkRXhwcihkb20sIDAsIHsgdGFnOiB0YWcgfSlcblxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIHJldHVybiB7IGV4cHI6IGV4cHJlc3Npb25zLCBlbGVtOiBuYW1lZF9lbGVtZW50cyB9XG5cbiAgICBmdW5jdGlvbiBhZGRFeHByKGRvbSwgdmFsdWUsIGRhdGEpIHtcbiAgICAgIGlmICh2YWx1ZSA/IHZhbHVlLmluZGV4T2YoJ3snKSA+PSAwIDogZGF0YSkge1xuICAgICAgICB2YXIgZXhwciA9IHsgZG9tOiBkb20sIGV4cHI6IHZhbHVlIH1cbiAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHRlbmQoZXhwciwgZGF0YSB8fCB7fSkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuXG4gIC8vIGNyZWF0ZSBuZXcgY3VzdG9tIHRhZyAoY29tcG9uZW50KVxuICBmdW5jdGlvbiBjcmVhdGVUYWcoY29uZikge1xuXG4gICAgdmFyIG9wdHMgPSBjb25mLm9wdHMgfHwge30sXG4gICAgICAgIGRvbSA9IG1rZG9tKGNvbmYudG1wbCksXG4gICAgICAgIG1vdW50Tm9kZSA9IGNvbmYucm9vdCxcbiAgICAgICAgcGFyZW50ID0gY29uZi5wYXJlbnQsXG4gICAgICAgIGFzdCA9IHBhcnNlKGRvbSksXG4gICAgICAgIHRhZyA9IHsgcm9vdDogbW91bnROb2RlLCBvcHRzOiBvcHRzLCBwYXJlbnQ6IHBhcmVudCwgX19pdGVtOiBjb25mLml0ZW0gfSxcbiAgICAgICAgYXR0cmlidXRlcyA9IHt9XG5cbiAgICAvLyBuYW1lZCBlbGVtZW50c1xuICAgIGV4dGVuZCh0YWcsIGFzdC5lbGVtKVxuXG4gICAgLy8gYXR0cmlidXRlc1xuICAgIGVhY2gobW91bnROb2RlLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIGF0dHJpYnV0ZXNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWVcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlT3B0cygpIHtcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciB2YWwgPSBvcHRzW25hbWVdID0gdG1wbChhdHRyaWJ1dGVzW25hbWVdLCBwYXJlbnQgfHwgdGFnKVxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgbW91bnROb2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVPcHRzKClcblxuICAgIGlmICghdGFnLm9uKSB7XG4gICAgICByaW90Lm9ic2VydmFibGUodGFnKVxuICAgICAgZGVsZXRlIHRhZy5vZmYgLy8gb2ZmIG1ldGhvZCBub3QgbmVlZGVkXG4gICAgfVxuXG4gICAgaWYgKGNvbmYuZm4pIGNvbmYuZm4uY2FsbCh0YWcsIG9wdHMpXG5cblxuICAgIHRhZy51cGRhdGUgPSBmdW5jdGlvbihkYXRhLCBfc3lzdGVtKSB7XG5cbiAgICAgIC8qXG4gICAgICAgIElmIGxvb3AgaXMgZGVmaW5lZCBvbiB0aGUgcm9vdCBvZiB0aGUgSFRNTCB0ZW1wbGF0ZVxuICAgICAgICB0aGUgb3JpZ2luYWwgcGFyZW50IGlzIGEgdGVtcG9yYXJ5IDxkaXYvPiBieSBta2RvbSgpXG4gICAgICAqL1xuICAgICAgaWYgKHBhcmVudCAmJiBkb20gJiYgIWRvbS5maXJzdENoaWxkKSB7XG4gICAgICAgIG1vdW50Tm9kZSA9IHBhcmVudC5yb290XG4gICAgICAgIGRvbSA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKF9zeXN0ZW0gfHwgZG9jLmJvZHkuY29udGFpbnMobW91bnROb2RlKSkge1xuICAgICAgICBleHRlbmQodGFnLCBkYXRhKVxuICAgICAgICBleHRlbmQodGFnLCB0YWcuX19pdGVtKVxuICAgICAgICB1cGRhdGVPcHRzKClcbiAgICAgICAgdXBkYXRlKGFzdC5leHByLCB0YWcpXG5cbiAgICAgICAgLy8gdXBkYXRlIHBhcmVudFxuICAgICAgICAhX3N5c3RlbSAmJiB0YWcuX19pdGVtICYmIHBhcmVudC51cGRhdGUoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWcudHJpZ2dlcigndW5tb3VudCcpXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICB0YWcudXBkYXRlKDAsIHRydWUpXG5cbiAgICAvLyBhcHBlbmQgdG8gcm9vdFxuICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkge1xuICAgICAgaWYgKGNvbmYuYmVmb3JlKSBtb3VudE5vZGUuaW5zZXJ0QmVmb3JlKGRvbS5maXJzdENoaWxkLCBjb25mLmJlZm9yZSlcbiAgICAgIGVsc2UgbW91bnROb2RlLmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKVxuICAgIH1cblxuXG4gICAgdGFnLnRyaWdnZXIoJ21vdW50JylcblxuICAgIGFsbF90YWdzLnB1c2godGFnKVxuXG4gICAgcmV0dXJuIHRhZ1xuICB9XG5cblxuICBmdW5jdGlvbiBsb29wKGV4cHIsIGluc3RhbmNlKSB7XG5cbiAgICAvLyBpbml0aWFsaXplIG9uY2VcbiAgICBpZiAoZXhwci5kb25lKSByZXR1cm5cbiAgICBleHByLmRvbmUgPSB0cnVlXG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICAgIHByZXYgPSBkb20ucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgICAgIHRlbXBsYXRlID0gZG9tLm91dGVySFRNTCxcbiAgICAgICAgdmFsID0gZXhwci5leHByLFxuICAgICAgICBlbHMgPSB2YWwuc3BsaXQoL1xccytpblxccysvKSxcbiAgICAgICAgcmVuZGVyZWQgPSBbXSxcbiAgICAgICAgY2hlY2tzdW0sXG4gICAgICAgIGtleXNcblxuXG4gICAgaWYgKGVsc1sxXSkge1xuICAgICAgdmFsID0gJ3sgJyArIGVsc1sxXVxuICAgICAga2V5cyA9IGVsc1swXS5zbGljZSgxKS50cmltKCkuc3BsaXQoLyxcXHMqLylcbiAgICB9XG5cbiAgICAvLyBjbGVhbiB0ZW1wbGF0ZSBjb2RlXG4gICAgaW5zdGFuY2Uub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHAgPSBkb20ucGFyZW50Tm9kZVxuICAgICAgaWYgKHApIHtcbiAgICAgICAgcm9vdCA9IHBcbiAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChkb20pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIHN0YXJ0UG9zKCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwocm9vdC5jaGlsZE5vZGVzLCBwcmV2KSArIDFcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5vbigndXBkYXRlZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgaXRlbXMgPSB0bXBsKHZhbCwgaW5zdGFuY2UpXG4gICAgICAgICAgaXNfYXJyYXkgPSBBcnJheS5pc0FycmF5KGl0ZW1zKVxuXG4gICAgICBpZiAoaXNfYXJyYXkpIGl0ZW1zID0gaXRlbXMuc2xpY2UoMClcblxuICAgICAgZWxzZSB7XG5cbiAgICAgICAgaWYgKCFpdGVtcykgcmV0dXJuIC8vIHNvbWUgSUU4IGlzc3VlXG5cbiAgICAgICAgLy8gZGV0ZWN0IE9iamVjdCBjaGFuZ2VzXG4gICAgICAgIHZhciB0ZXN0c3VtID0gSlNPTi5zdHJpbmdpZnkoaXRlbXMpXG4gICAgICAgIGlmICh0ZXN0c3VtID09IGNoZWNrc3VtKSByZXR1cm5cbiAgICAgICAgY2hlY2tzdW0gPSB0ZXN0c3VtXG5cbiAgICAgICAgaXRlbXMgPSBPYmplY3Qua2V5cyhpdGVtcykubWFwKGZ1bmN0aW9uKGtleSwgaSkge1xuICAgICAgICAgIHZhciBpdGVtID0ge31cbiAgICAgICAgICBpdGVtW2tleXNbMF1dID0ga2V5XG4gICAgICAgICAgaXRlbVtrZXlzWzFdXSA9IGl0ZW1zW2tleV1cbiAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9KVxuXG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSByZWR1bmRhbnRcbiAgICAgIGRpZmYocmVuZGVyZWQsIGl0ZW1zKS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgcG9zID0gcmVuZGVyZWQuaW5kZXhPZihpdGVtKVxuICAgICAgICByb290LnJlbW92ZUNoaWxkKHJvb3QuY2hpbGROb2Rlc1tzdGFydFBvcygpICsgcG9zXSlcbiAgICAgICAgcmVuZGVyZWQuc3BsaWNlKHBvcywgMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIGFkZCBuZXdcbiAgICAgIGRpZmYoaXRlbXMsIHJlbmRlcmVkKS5tYXAoZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICB2YXIgcG9zID0gaXRlbXMuaW5kZXhPZihpdGVtKVxuXG4gICAgICAgIC8vIHN0cmluZyBhcnJheVxuICAgICAgICBpZiAoa2V5cyAmJiAhY2hlY2tzdW0pIHtcbiAgICAgICAgICB2YXIgb2JqID0ge31cbiAgICAgICAgICBvYmpba2V5c1swXV0gPSBpdGVtXG4gICAgICAgICAgb2JqW2tleXNbMV1dID0gcG9zXG4gICAgICAgICAgaXRlbSA9IG9ialxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRhZyA9IGNyZWF0ZVRhZyh7XG4gICAgICAgICAgYmVmb3JlOiByb290LmNoaWxkTm9kZXNbc3RhcnRQb3MoKSArIHBvc10sXG4gICAgICAgICAgcGFyZW50OiBpbnN0YW5jZSxcbiAgICAgICAgICB0bXBsOiB0ZW1wbGF0ZSxcbiAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgIHJvb3Q6IHJvb3RcbiAgICAgICAgfSlcblxuICAgICAgICBpbnN0YW5jZS5vbigndXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGFnLnVwZGF0ZSgwLCB0cnVlKVxuICAgICAgICB9KVxuXG4gICAgICB9KVxuXG4gICAgICAvLyBhc3NpZ24gcmVuZGVyZWRcbiAgICAgIHJlbmRlcmVkID0gaXRlbXNcblxuICAgIH0pXG5cbiAgfVxuXG4gIHJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgdG1wbCwgZm4pIHtcbiAgICBmbiA9IGZuIHx8IG5vb3AsXG4gICAgdGFnX2ltcGxbbmFtZV0gPSBbdG1wbCwgZm5dXG4gIH1cblxuICByaW90Lm1vdW50VG8gPSBmdW5jdGlvbihub2RlLCB0YWdOYW1lLCBvcHRzKSB7XG4gICAgdmFyIHRhZyA9IHRhZ19pbXBsW3RhZ05hbWVdXG4gICAgcmV0dXJuIHRhZyAmJiBjcmVhdGVUYWcoeyB0bXBsOiB0YWdbMF0sIGZuOiB0YWdbMV0sIHJvb3Q6IG5vZGUsIG9wdHM6IG9wdHMgfSlcbiAgfVxuXG4gIHJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PSAnKicpIHNlbGVjdG9yID0gT2JqZWN0LmtleXModGFnX2ltcGwpLmpvaW4oJywgJylcblxuICAgIHZhciBpbnN0YW5jZXMgPSBbXVxuXG4gICAgZWFjaChkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnJpb3QpIHJldHVyblxuXG4gICAgICB2YXIgdGFnTmFtZSA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgIGluc3RhbmNlID0gcmlvdC5tb3VudFRvKG5vZGUsIHRhZ05hbWUsIG9wdHMpXG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZXMucHVzaChpbnN0YW5jZSlcbiAgICAgICAgbm9kZS5yaW90ID0gMVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW5zdGFuY2VzXG4gIH1cblxuICAvLyB1cGRhdGUgZXZlcnl0aGluZ1xuICByaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhbGxfdGFncyA9IGFsbF90YWdzLmZpbHRlcihmdW5jdGlvbih0YWcpIHtcbiAgICAgIHJldHVybiAhIXRhZy51cGRhdGUoKVxuICAgIH0pXG4gIH1cblxufSkocmlvdCwgdGhpcy50b3ApXG5cblxuLy8gc3VwcG9ydCBDb21tb25KU1xuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgbW9kdWxlLmV4cG9ydHMgPSByaW90XG5cbi8vIHN1cHBvcnQgQU1EXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHJpb3QgfSlcblxuLy8gc3VwcG9ydCBicm93c2VyXG5lbHNlXG4gIHRoaXMucmlvdCA9IHJpb3RcblxufSkoKTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
