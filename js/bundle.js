(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js":[function(require,module,exports){
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

},{}],"/Users/uzimith/learn/flux-todo-practice/js/todo.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo', '<div class="row"><ul><li each="{ items }"><label class="{ completed: done }"><input type="checked" onclick="{ parent.toggle }"></div></label></li></ul><form onsubmit="{ add }"><input name="input" onkeyup="{ edit }"></form><button __disabled="{ !text }">Add { items.length + 1 }</button></form><button __disabled="{ !items.length }" onclick="{ remove }">Remove</button></div>', function(opts) {var RiotControl, add, edit, remove, toggle;

RiotControl = require('./riotcontrol');

this.disabled = true;

this.items = [];

this.on('mount', (function(_this) {
  return function() {};
})(this));

RiotControl.trigger('todo_init');

RiotControl.on('todos_changed', (function(_this) {
  return function(items) {
    _this.items = items;
    return _this.update();
  };
})(this));

edit = (function(_this) {
  return function(e) {
    return _this.text = e.target.value;
  };
})(this);

add = (function(_this) {
  return function(e) {
    if (_this.text) {
      RiotControl.trigger('todo_add', {
        title: _this.text
      });
      return _this.text = _this.input.value = '';
    }
  };
})(this);

toggle = (function(_this) {
  return function(e) {
    var item;
    item = e.item;
    item.done = !item.done;
    return true;
  };
})(this);

remove = (function(_this) {
  return function(e) {
    return RiotControl.trigger('todo_remove');
  };
})(this);

});
},{"./riotcontrol":"/Users/uzimith/learn/flux-todo-practice/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/todoapp.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todoapp', '<div class="row"><h1>Todo</h1><todo title="Demo" class="small-6 small-centered columns"></todo></div>', function(opts) {

});
},{"riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/js/todostore.coffee":[function(require,module,exports){
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
      return _this.triger('todos_changed', _this.todos);
    };
  })(this));
  this.on('todo_remove', (function(_this) {
    return function() {
      _this.todos.pop();
      return _this.triger('todos_changed', _this.todos);
    };
  })(this));
  return this.on('todo_init', (function(_this) {
    return function() {
      return _this.triger('todos_changed', _this.todos);
    };
  })(this));
};

module.exports = TodoStore;



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
},{}],"/Users/uzimith/learn/flux-todo-practice":[function(require,module,exports){
"use strict";

var riot = require("riot");
require("./todostore.coffee");
require("./todo.tag");
require("./todoapp.tag");

riot.mount("*");

},{"./todo.tag":"/Users/uzimith/learn/flux-todo-practice/js/todo.tag","./todoapp.tag":"/Users/uzimith/learn/flux-todo-practice/js/todoapp.tag","./todostore.coffee":"/Users/uzimith/learn/flux-todo-practice/js/todostore.coffee","riot":"/Users/uzimith/learn/flux-todo-practice/node_modules/riot/riot.js"}]},{},["/Users/uzimith/learn/flux-todo-practice"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3V6aW1pdGgvbGVhcm4vZmx1eC10b2RvLXByYWN0aWNlL2pzL3Jpb3Rjb250cm9sLmpzIiwianMvdG9kby50YWciLCJqcy90b2RvYXBwLnRhZyIsIi9Vc2Vycy91emltaXRoL2xlYXJuL2ZsdXgtdG9kby1wcmFjdGljZS9qcy90b2Rvc3RvcmUuY29mZmVlIiwibm9kZV9tb2R1bGVzL3Jpb3QvcmlvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBSSxXQUFXLEdBQUc7QUFDaEIsU0FBTyxFQUFFLEVBQUU7QUFDWCxVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFO0FBQ2QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDekI7QUFDRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixRQUFJLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNqQyxRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUMvQixRQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDN0IsQ0FBQyxDQUFBO0dBQ0w7QUFDRCxJQUFFLEVBQUEsWUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ1QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxFQUFFLEVBQUM7QUFDL0IsUUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7S0FDZCxDQUFDLENBQUE7R0FDSDtBQUNELEtBQUcsRUFBQSxhQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDVixRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8s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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBSaW90Q29udHJvbCA9IHtcbiAgX3N0b3JlczogW10sXG4gIGFkZFN0b3JlKHN0b3JlKSB7XG4gICAgdGhpcy5fc3RvcmVzLnB1c2goc3RvcmUpXG4gIH0sXG4gIHRyaWdnZXIoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgIHRoaXMuX3N0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgZWwudHJpZ2dlci5hcHBseShudWxsLCBhcmdzKVxuICAgICAgfSlcbiAgfSxcbiAgb24oZXYsIGNiKSB7XG4gICAgdGhpcy5fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgZWwub24oZXYsIGNiKVxuICAgIH0pXG4gIH0sXG4gIG9mZihldiwgY2IpIHtcbiAgICB0aGlzLl9zdG9yZXMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4gICAgICBpZiAoY2IpXG4gICAgICAgIGVsLm9mZihldiwgY2IpXG4gICAgICBlbHNlXG4gICAgICAgIGVsLm9mZihldilcbiAgICB9KVxuICB9LFxuICBvbmUoZXYsIGNiKSB7XG4gICAgdGhpcy5fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgZWwub25lKGV2LCBjYilcbiAgICB9KVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFJpb3RDb250cm9sXG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxucmlvdC50YWcoJ3RvZG8nLCAnPGRpdiBjbGFzcz1cInJvd1wiPjx1bD48bGkgZWFjaD1cInsgaXRlbXMgfVwiPjxsYWJlbCBjbGFzcz1cInsgY29tcGxldGVkOiBkb25lIH1cIj48aW5wdXQgdHlwZT1cImNoZWNrZWRcIiBvbmNsaWNrPVwieyBwYXJlbnQudG9nZ2xlIH1cIj48L2Rpdj48L2xhYmVsPjwvbGk+PC91bD48Zm9ybSBvbnN1Ym1pdD1cInsgYWRkIH1cIj48aW5wdXQgbmFtZT1cImlucHV0XCIgb25rZXl1cD1cInsgZWRpdCB9XCI+PC9mb3JtPjxidXR0b24gX19kaXNhYmxlZD1cInsgIXRleHQgfVwiPkFkZCB7IGl0ZW1zLmxlbmd0aCArIDEgfTwvYnV0dG9uPjwvZm9ybT48YnV0dG9uIF9fZGlzYWJsZWQ9XCJ7ICFpdGVtcy5sZW5ndGggfVwiIG9uY2xpY2s9XCJ7IHJlbW92ZSB9XCI+UmVtb3ZlPC9idXR0b24+PC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBSaW90Q29udHJvbCwgYWRkLCBlZGl0LCByZW1vdmUsIHRvZ2dsZTtcblxuUmlvdENvbnRyb2wgPSByZXF1aXJlKCcuL3Jpb3Rjb250cm9sJyk7XG5cbnRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuXG50aGlzLml0ZW1zID0gW107XG5cbnRoaXMub24oJ21vdW50JywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHt9O1xufSkodGhpcykpO1xuXG5SaW90Q29udHJvbC50cmlnZ2VyKCd0b2RvX2luaXQnKTtcblxuUmlvdENvbnRyb2wub24oJ3RvZG9zX2NoYW5nZWQnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgX3RoaXMuaXRlbXMgPSBpdGVtcztcbiAgICByZXR1cm4gX3RoaXMudXBkYXRlKCk7XG4gIH07XG59KSh0aGlzKSk7XG5cbmVkaXQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gX3RoaXMudGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xuICB9O1xufSkodGhpcyk7XG5cbmFkZCA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIGlmIChfdGhpcy50ZXh0KSB7XG4gICAgICBSaW90Q29udHJvbC50cmlnZ2VyKCd0b2RvX2FkZCcsIHtcbiAgICAgICAgdGl0bGU6IF90aGlzLnRleHRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF90aGlzLnRleHQgPSBfdGhpcy5pbnB1dC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfTtcbn0pKHRoaXMpO1xuXG50b2dnbGUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgaXRlbTtcbiAgICBpdGVtID0gZS5pdGVtO1xuICAgIGl0ZW0uZG9uZSA9ICFpdGVtLmRvbmU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59KSh0aGlzKTtcblxucmVtb3ZlID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIFJpb3RDb250cm9sLnRyaWdnZXIoJ3RvZG9fcmVtb3ZlJyk7XG4gIH07XG59KSh0aGlzKTtcblxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbnJpb3QudGFnKCd0b2RvYXBwJywgJzxkaXYgY2xhc3M9XCJyb3dcIj48aDE+VG9kbzwvaDE+PHRvZG8gdGl0bGU9XCJEZW1vXCIgY2xhc3M9XCJzbWFsbC02IHNtYWxsLWNlbnRlcmVkIGNvbHVtbnNcIj48L3RvZG8+PC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xuXG59KTsiLCJyaW90ID0gcmVxdWlyZSgncmlvdCcpXG5Ub2RvU3RvcmUgPSAtPlxuICByaW90Lm9ic2VydmFibGUodGhpcylcblxuICBAdG9kb3MgPSBbXG4gICAgeyB0aXRsZTogJ1Rhc2sgMScsIGRvbmU6IGZhbHNlfSxcbiAgICB7IHRpdGxlOiAnVGFzayAyJywgZG9uZTogZmFsc2V9LFxuICBdXG5cbiAgQG9uICd0b2RvX2FkZCcsIChuZXdUb2RvKSA9PlxuICAgIEB0b2Rvcy5wdXNoKG5ld1RvZG8pXG4gICAgQHRyaWdlciAndG9kb3NfY2hhbmdlZCcsIEB0b2Rvc1xuXG4gIEBvbiAndG9kb19yZW1vdmUnLCA9PlxuICAgIEB0b2Rvcy5wb3AoKVxuICAgIEB0cmlnZXIgJ3RvZG9zX2NoYW5nZWQnLCBAdG9kb3NcblxuICBAb24gJ3RvZG9faW5pdCcsID0+XG4gICAgQHRyaWdlciAndG9kb3NfY2hhbmdlZCcsIEB0b2Rvc1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9TdG9yZVxuIiwiLyogUmlvdCAyLjAuNywgQGxpY2Vuc2UgTUlULCAoYykgMjAxNSBNdXV0IEluYy4gKyBjb250cmlidXRvcnMgKi9cblxuOyhmdW5jdGlvbigpIHtcblxudmFyIHJpb3QgPSB7IHZlcnNpb246ICd2Mi4wLjcnIH1cblxuJ3VzZSBzdHJpY3QnXG5cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIHZhciBjYWxsYmFja3MgPSB7fVxuXG4gIGVsLm9uID0gZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZXZlbnRzLnJlcGxhY2UoL1xcUysvZywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG4gICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICBlbC5vZmYgPSBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKGV2ZW50cyA9PSAnKicpIGNhbGxiYWNrcyA9IHt9XG4gICAgZWxzZSBpZiAoZm4pIHtcbiAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbZXZlbnRzXVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyAoY2IgPSBhcnIgJiYgYXJyW2ldKTsgKytpKSB7XG4gICAgICAgIGlmIChjYiA9PSBmbikgeyBhcnIuc3BsaWNlKGksIDEpOyBpLS0gfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGNhbGxiYWNrc1tuYW1lXSA9IFtdXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8vIG9ubHkgc2luZ2xlIGV2ZW50IHN1cHBvcnRlZFxuICBlbC5vbmUgPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmIChmbikgZm4ub25lID0gMVxuICAgIHJldHVybiBlbC5vbihuYW1lLCBmbilcbiAgfVxuXG4gIGVsLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZucyA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGZuOyAoZm4gPSBmbnNbaV0pOyArK2kpIHtcbiAgICAgIGlmICghZm4uYnVzeSkge1xuICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgaWYgKGZuLm9uZSkgeyBmbnMuc3BsaWNlKGksIDEpOyBpLS0gfVxuICAgICAgICAgZWxzZSBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfSAvLyBNYWtlcyBzZWxmLXJlbW92YWwgcG9zc2libGUgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgcmV0dXJuIGVsXG5cbn1cbjsoZnVuY3Rpb24ocmlvdCwgZXZ0KSB7XG5cbiAgLy8gYnJvd3NlcnMgb25seVxuICBpZiAoIXRoaXMudG9wKSByZXR1cm5cblxuICB2YXIgbG9jID0gbG9jYXRpb24sXG4gICAgICBmbnMgPSByaW90Lm9ic2VydmFibGUoKSxcbiAgICAgIGN1cnJlbnQgPSBoYXNoKCksXG4gICAgICB3aW4gPSB3aW5kb3dcblxuICBmdW5jdGlvbiBoYXNoKCkge1xuICAgIHJldHVybiBsb2MuaGFzaC5zbGljZSgxKVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VyKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpXG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KHBhdGgpIHtcbiAgICBpZiAocGF0aC50eXBlKSBwYXRoID0gaGFzaCgpXG5cbiAgICBpZiAocGF0aCAhPSBjdXJyZW50KSB7XG4gICAgICBmbnMudHJpZ2dlci5hcHBseShudWxsLCBbJ0gnXS5jb25jYXQocGFyc2VyKHBhdGgpKSlcbiAgICAgIGN1cnJlbnQgPSBwYXRoXG4gICAgfVxuICB9XG5cbiAgdmFyIHIgPSByaW90LnJvdXRlID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgLy8gc3RyaW5nXG4gICAgaWYgKGFyZ1swXSkge1xuICAgICAgbG9jLmhhc2ggPSBhcmdcbiAgICAgIGVtaXQoYXJnKVxuXG4gICAgLy8gZnVuY3Rpb25cbiAgICB9IGVsc2Uge1xuICAgICAgZm5zLm9uKCdIJywgYXJnKVxuICAgIH1cbiAgfVxuXG4gIHIuZXhlYyA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgZm4uYXBwbHkobnVsbCwgcGFyc2VyKGhhc2goKSkpXG4gIH1cblxuICByLnBhcnNlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcGFyc2VyID0gZm5cbiAgfVxuXG4gIHdpbi5hZGRFdmVudExpc3RlbmVyID8gd2luLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBlbWl0LCBmYWxzZSkgOiB3aW4uYXR0YWNoRXZlbnQoJ29uJyArIGV2dCwgZW1pdClcblxufSkocmlvdCwgJ2hhc2hjaGFuZ2UnKVxuLypcblxuLy8vLyBIb3cgaXQgd29ya3M/XG5cblxuVGhyZWUgd2F5czpcblxuMS4gRXhwcmVzc2lvbnM6IHRtcGwoJ3sgdmFsdWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRlZCBleHByZXNzaW9uIGFzIGEgcmF3IG9iamVjdC5cblxuMi4gVGVtcGxhdGVzOiB0bXBsKCdIaSB7IG5hbWUgfSB7IHN1cm5hbWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHN0cmluZyB3aXRoIGV2YWx1YXRlZCBleHByZXNzaW9ucy5cblxuMy4gRmlsdGVyczogdG1wbCgneyBzaG93OiAhZG9uZSwgaGlnaGxpZ2h0OiBhY3RpdmUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIHRydWVpc2gga2V5cyAobWFpbmx5XG4gICB1c2VkIGZvciBzZXR0aW5nIGh0bWwgY2xhc3NlcyksIGUuZy4gXCJzaG93IGhpZ2hsaWdodFwiLlxuXG5cbi8vIFRlbXBsYXRlIGV4YW1wbGVzXG5cbnRtcGwoJ3sgdGl0bGUgfHwgXCJVbnRpdGxlZFwiIH0nLCBkYXRhKVxudG1wbCgnUmVzdWx0cyBhcmUgeyByZXN1bHRzID8gXCJyZWFkeVwiIDogXCJsb2FkaW5nXCIgfScsIGRhdGEpXG50bXBsKCdUb2RheSBpcyB7IG5ldyBEYXRlKCkgfScsIGRhdGEpXG50bXBsKCd7IG1lc3NhZ2UubGVuZ3RoID4gMTQwICYmIFwiTWVzc2FnZSBpcyB0b28gbG9uZ1wiIH0nLCBkYXRhKVxudG1wbCgnVGhpcyBpdGVtIGdvdCB7IE1hdGgucm91bmQocmF0aW5nKSB9IHN0YXJzJywgZGF0YSlcbnRtcGwoJzxoMT57IHRpdGxlIH08L2gxPnsgYm9keSB9JywgZGF0YSlcblxuXG4vLyBGYWxzeSBleHByZXNzaW9ucyBpbiB0ZW1wbGF0ZXNcblxuSW4gdGVtcGxhdGVzIChhcyBvcHBvc2VkIHRvIHNpbmdsZSBleHByZXNzaW9ucykgYWxsIGZhbHN5IHZhbHVlc1xuZXhjZXB0IHplcm8gKHVuZGVmaW5lZC9udWxsL2ZhbHNlKSB3aWxsIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nOlxuXG50bXBsKCd7IHVuZGVmaW5lZCB9IC0geyBmYWxzZSB9IC0geyBudWxsIH0gLSB7IDAgfScsIHt9KVxuLy8gd2lsbCByZXR1cm46IFwiIC0gLSAtIDBcIlxuXG4qL1xuXG5yaW90Ll90bXBsID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBjYWNoZSA9IHt9LFxuXG4gICAgICAvLyBmaW5kIHZhcmlhYmxlIG5hbWVzXG4gICAgICByZV92YXJzID0gLyhcInwnKS4rP1teXFxcXF1cXDF8XFwuXFx3KnxcXHcqOnxcXGIoPzp0aGlzfHRydWV8ZmFsc2V8bnVsbHx1bmRlZmluZWR8bmV3fHR5cGVvZnxOdW1iZXJ8U3RyaW5nfE9iamVjdHxBcnJheXxNYXRofERhdGV8SlNPTilcXGJ8KFthLXpfXVxcdyopL2dpXG4gICAgICAgICAgICAgIC8vIFsgMSAgICAgICAgICAgIF1bIDIgIF1bIDMgXVsgNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWyA1ICAgICAgIF1cbiAgICAgICAgICAgICAgLy8gMS4gc2tpcCBxdW90ZWQgc3RyaW5nczogXCJhIGJcIiwgJ2EgYicsICdhIFxcJ2JcXCcnXG4gICAgICAgICAgICAgIC8vIDIuIHNraXAgb2JqZWN0IHByb3BlcnRpZXM6IC5uYW1lXG4gICAgICAgICAgICAgIC8vIDMuIHNraXAgb2JqZWN0IGxpdGVyYWxzOiBuYW1lOlxuICAgICAgICAgICAgICAvLyA0LiBza2lwIHJlc2VydmVkIHdvcmRzXG4gICAgICAgICAgICAgIC8vIDUuIG1hdGNoIHZhciBuYW1lXG5cbiAgLy8gYnVpbGQgYSB0ZW1wbGF0ZSAob3IgZ2V0IGl0IGZyb20gY2FjaGUpLCByZW5kZXIgd2l0aCBkYXRhXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0ciwgZGF0YSkge1xuICAgIHJldHVybiBzdHIgJiYgKGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIHx8IHRtcGwoc3RyKSkoZGF0YSlcbiAgfVxuXG5cbiAgLy8gY3JlYXRlIGEgdGVtcGxhdGUgaW5zdGFuY2VcblxuICBmdW5jdGlvbiB0bXBsKHMsIHApIHtcbiAgICBwID0gKHMgfHwgJ3t9JylcblxuICAgICAgLy8gdGVtcG9yYXJpbHkgY29udmVydCBcXHsgYW5kIFxcfSB0byBhIG5vbi1jaGFyYWN0ZXJcbiAgICAgIC5yZXBsYWNlKC9cXFxcey9nLCAnXFx1RkZGMCcpXG4gICAgICAucmVwbGFjZSgvXFxcXH0vZywgJ1xcdUZGRjEnKVxuXG4gICAgICAvLyBzcGxpdCBzdHJpbmcgdG8gZXhwcmVzc2lvbiBhbmQgbm9uLWV4cHJlc2lvbiBwYXJ0c1xuICAgICAgLnNwbGl0KC8oe1tcXHNcXFNdKj99KS8pXG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdkJywgJ3JldHVybiAnICsgKFxuXG4gICAgICAvLyBpcyBpdCBhIHNpbmdsZSBleHByZXNzaW9uIG9yIGEgdGVtcGxhdGU/IGkuZS4ge3h9IG9yIDxiPnt4fTwvYj5cbiAgICAgICFwWzBdICYmICFwWzJdXG5cbiAgICAgICAgLy8gaWYgZXhwcmVzc2lvbiwgZXZhbHVhdGUgaXRcbiAgICAgICAgPyBleHByKHBbMV0pXG5cbiAgICAgICAgLy8gaWYgdGVtcGxhdGUsIGV2YWx1YXRlIGFsbCBleHByZXNzaW9ucyBpbiBpdFxuICAgICAgICA6ICdbJyArIHAubWFwKGZ1bmN0aW9uKHMsIGkpIHtcblxuICAgICAgICAgICAgLy8gaXMgaXQgYW4gZXhwcmVzc2lvbiBvciBhIHN0cmluZyAoZXZlcnkgc2Vjb25kIHBhcnQgaXMgYW4gZXhwcmVzc2lvbilcbiAgICAgICAgICAgIHJldHVybiBpICUgMlxuXG4gICAgICAgICAgICAgIC8vIGV2YWx1YXRlIHRoZSBleHByZXNzaW9uc1xuICAgICAgICAgICAgICA/IGV4cHIocywgMSlcblxuICAgICAgICAgICAgICAvLyBwcm9jZXNzIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGU6XG4gICAgICAgICAgICAgIDogJ1wiJyArIHNcblxuICAgICAgICAgICAgICAgICAgLy8gcHJlc2VydmUgbmV3IGxpbmVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzY2FwZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcblxuICAgICAgICAgICAgICAgICsgJ1wiJ1xuXG4gICAgICAgICAgfSkuam9pbignLCcpICsgJ10uam9pbihcIlwiKSdcbiAgICAgIClcblxuICAgICAgLy8gYnJpbmcgZXNjYXBlZCB7IGFuZCB9IGJhY2tcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYwL2csICd7JylcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYxL2csICd9JylcblxuICAgIClcblxuICB9XG5cblxuICAvLyBwYXJzZSB7IC4uLiB9IGV4cHJlc3Npb25cblxuICBmdW5jdGlvbiBleHByKHMsIG4pIHtcbiAgICBzID0gc1xuXG4gICAgICAvLyBjb252ZXJ0IG5ldyBsaW5lcyB0byBzcGFjZXNcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgJyAnKVxuXG4gICAgICAvLyB0cmltIHdoaXRlc3BhY2UsIGN1cmx5IGJyYWNrZXRzLCBzdHJpcCBjb21tZW50c1xuICAgICAgLnJlcGxhY2UoL15beyBdK3xbIH1dKyR8XFwvXFwqLis/XFwqXFwvL2csICcnKVxuXG4gICAgLy8gaXMgaXQgYW4gb2JqZWN0IGxpdGVyYWw/IGkuZS4geyBrZXkgOiB2YWx1ZSB9XG4gICAgcmV0dXJuIC9eXFxzKltcXHctXCInXSsgKjovLnRlc3QocylcblxuICAgICAgLy8gaWYgb2JqZWN0IGxpdGVyYWwsIHJldHVybiB0cnVlaXNoIGtleXNcbiAgICAgIC8vIGUuZy46IHsgc2hvdzogaXNPcGVuKCksIGRvbmU6IGl0ZW0uZG9uZSB9IC0+IFwic2hvdyBkb25lXCJcbiAgICAgID8gJ1snICsgcy5yZXBsYWNlKC9cXFcqKFtcXHctXSspXFxXKjooW14sXSspL2csIGZ1bmN0aW9uKF8sIGssIHYpIHtcblxuICAgICAgICAgIC8vIHNhZmVseSBleGVjdXRlIHZhcnMgdG8gcHJldmVudCB1bmRlZmluZWQgdmFsdWUgZXJyb3JzXG4gICAgICAgICAgcmV0dXJuIHYucmVwbGFjZSgvXFx3W14sfCYgXSovZywgZnVuY3Rpb24odikgeyByZXR1cm4gd3JhcCh2LCBuKSB9KSArICc/XCInICsgayArICdcIjpcIlwiLCdcblxuICAgICAgICB9KSArICddLmpvaW4oXCIgXCIpJ1xuXG4gICAgICAvLyBpZiBqcyBleHByZXNzaW9uLCBldmFsdWF0ZSBhcyBqYXZhc2NyaXB0XG4gICAgICA6IHdyYXAocywgbilcblxuICB9XG5cblxuICAvLyBleGVjdXRlIGpzIHcvbyBicmVha2luZyBvbiBlcnJvcnMgb3IgdW5kZWZpbmVkIHZhcnNcblxuICBmdW5jdGlvbiB3cmFwKHMsIG5vbnVsbCkge1xuICAgIHJldHVybiAnKGZ1bmN0aW9uKHYpe3RyeXt2PSdcblxuICAgICAgICAvLyBwcmVmaXggdmFycyAobmFtZSA9PiBkYXRhLm5hbWUpXG4gICAgICAgICsgKHMucmVwbGFjZShyZV92YXJzLCBmdW5jdGlvbihzLCBfLCB2KSB7IHJldHVybiB2ID8gJ2QuJyArIHYgOiBzIH0pXG5cbiAgICAgICAgICAvLyBicmVhayB0aGUgZXhwcmVzc2lvbiBpZiBpdHMgZW1wdHkgKHJlc3VsdGluZyBpbiB1bmRlZmluZWQgdmFsdWUpXG4gICAgICAgICAgfHwgJ3gnKVxuXG4gICAgICArICd9ZmluYWxseXtyZXR1cm4gJ1xuXG4gICAgICAgIC8vIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciBmYWxzeSB2YWx1ZXMgZXhjZXB0IHplcm9cbiAgICAgICAgKyAobm9udWxsID8gJyF2JiZ2IT09MD9cIlwiOnYnIDogJ3YnKVxuXG4gICAgICArICd9fSkuY2FsbChkKSdcbiAgfVxuXG59KSgpXG47KGZ1bmN0aW9uKHJpb3QsIGlzX2Jyb3dzZXIpIHtcblxuICBpZiAoIWlzX2Jyb3dzZXIpIHJldHVyblxuXG4gIHZhciB0bXBsID0gcmlvdC5fdG1wbCxcbiAgICAgIGFsbF90YWdzID0gW10sXG4gICAgICB0YWdfaW1wbCA9IHt9LFxuICAgICAgZG9jID0gZG9jdW1lbnRcblxuICBmdW5jdGlvbiBlYWNoKG5vZGVzLCBmbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgKG5vZGVzIHx8IFtdKS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGZuKG5vZGVzW2ldLCBpKSA9PT0gZmFsc2UpIGktLVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dGVuZChvYmosIGZyb20pIHtcbiAgICBmcm9tICYmIE9iamVjdC5rZXlzKGZyb20pLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIG9ialtrZXldID0gZnJvbVtrZXldXG4gICAgfSlcbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBmdW5jdGlvbiBkaWZmKGFycjEsIGFycjIpIHtcbiAgICByZXR1cm4gYXJyMS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBhcnIyLmluZGV4T2YoZWwpIDwgMFxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiB3YWxrKGRvbSwgZm4pIHtcbiAgICBkb20gPSBmbihkb20pID09PSBmYWxzZSA/IGRvbS5uZXh0U2libGluZyA6IGRvbS5maXJzdENoaWxkXG5cbiAgICB3aGlsZSAoZG9tKSB7XG4gICAgICB3YWxrKGRvbSwgZm4pXG4gICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG1rZG9tKHRtcGwpIHtcbiAgICB2YXIgdGFnX25hbWUgPSB0bXBsLnRyaW0oKS5zbGljZSgxLCAzKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICByb290X3RhZyA9IC90ZHx0aC8udGVzdCh0YWdfbmFtZSkgPyAndHInIDogdGFnX25hbWUgPT0gJ3RyJyA/ICd0Ym9keScgOiAnZGl2J1xuICAgICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KHJvb3RfdGFnKVxuXG4gICAgZWwuaW5uZXJIVE1MID0gdG1wbFxuICAgIHJldHVybiBlbFxuICB9XG5cblxuICBmdW5jdGlvbiB1cGRhdGUoZXhwcmVzc2lvbnMsIGluc3RhbmNlKSB7XG5cbiAgICAvLyBhbGxvdyByZWNhbGN1bGF0aW9uIG9mIGNvbnRleHQgZGF0YVxuICAgIGluc3RhbmNlLnRyaWdnZXIoJ3VwZGF0ZScpXG5cbiAgICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByKSB7XG4gICAgICB2YXIgdGFnID0gZXhwci50YWcsXG4gICAgICAgICAgZG9tID0gZXhwci5kb21cblxuICAgICAgZnVuY3Rpb24gcmVtQXR0cihuYW1lKSB7XG4gICAgICAgIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgIH1cblxuICAgICAgLy8gbG9vcHMgZmlyc3Q6IFRPRE8gcmVtb3ZlIGZyb20gZXhwcmVzc2lvbnMgYXJyXG4gICAgICBpZiAoZXhwci5sb29wKSB7XG4gICAgICAgIHJlbUF0dHIoJ2VhY2gnKVxuICAgICAgICByZXR1cm4gbG9vcChleHByLCBpbnN0YW5jZSlcbiAgICAgIH1cblxuICAgICAgLy8gY3VzdG9tIHRhZ1xuICAgICAgaWYgKHRhZykgcmV0dXJuIHRhZy51cGRhdGUgPyB0YWcudXBkYXRlKCkgOlxuICAgICAgICBleHByLnRhZyA9IGNyZWF0ZVRhZyh7IHRtcGw6IHRhZ1swXSwgZm46IHRhZ1sxXSwgcm9vdDogZG9tLCBwYXJlbnQ6IGluc3RhbmNlIH0pXG5cblxuICAgICAgdmFyIGF0dHJfbmFtZSA9IGV4cHIuYXR0cixcbiAgICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCBpbnN0YW5jZSlcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gJydcblxuICAgICAgLy8gbm8gY2hhbmdlXG4gICAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgICAgZXhwci52YWx1ZSA9IHZhbHVlXG5cblxuICAgICAgLy8gdGV4dCBub2RlXG4gICAgICBpZiAoIWF0dHJfbmFtZSkgcmV0dXJuIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZVxuXG4gICAgICAvLyBhdHRyaWJ1dGVcbiAgICAgIGlmICghdmFsdWUgJiYgZXhwci5ib29sIHx8IC9vYmp8ZnVuYy8udGVzdCh0eXBlb2YgdmFsdWUpKSByZW1BdHRyKGF0dHJfbmFtZSlcblxuICAgICAgLy8gZXZlbnQgaGFuZGxlclxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRvbVthdHRyX25hbWVdID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcbiAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnRcbiAgICAgICAgICBlLndoaWNoID0gZS53aGljaCB8fCBlLmNoYXJDb2RlIHx8IGUua2V5Q29kZVxuICAgICAgICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gZG9tXG5cbiAgICAgICAgICAvLyBjdXJyZW50bHkgbG9vcGVkIGl0ZW1cbiAgICAgICAgICBlLml0ZW0gPSBpbnN0YW5jZS5fX2l0ZW0gfHwgaW5zdGFuY2VcblxuICAgICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXIgKGJ5IGRlZmF1bHQpXG4gICAgICAgICAgaWYgKHZhbHVlLmNhbGwoaW5zdGFuY2UsIGUpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ICYmIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5zdGFuY2UudXBkYXRlKClcbiAgICAgICAgfVxuXG4gICAgICAvLyBzaG93IC8gaGlkZSAvIGlmXG4gICAgICB9IGVsc2UgaWYgKC9eKHNob3d8aGlkZXxpZikkLy50ZXN0KGF0dHJfbmFtZSkpIHtcbiAgICAgICAgcmVtQXR0cihhdHRyX25hbWUpXG4gICAgICAgIGlmIChhdHRyX25hbWUgPT0gJ2hpZGUnKSB2YWx1ZSA9ICF2YWx1ZVxuICAgICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgICAgLy8gbm9ybWFsIGF0dHJpYnV0ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgICAgIGRvbVthdHRyX25hbWVdID0gdmFsdWVcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm5cbiAgICAgICAgICB2YWx1ZSA9IGF0dHJfbmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIHZhbHVlKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIGluc3RhbmNlLnRyaWdnZXIoJ3VwZGF0ZWQnKVxuXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZShyb290KSB7XG5cbiAgICB2YXIgbmFtZWRfZWxlbWVudHMgPSB7fSxcbiAgICAgICAgZXhwcmVzc2lvbnMgPSBbXVxuXG4gICAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcblxuICAgICAgdmFyIHR5cGUgPSBkb20ubm9kZVR5cGUsXG4gICAgICAgICAgdmFsdWUgPSBkb20ubm9kZVZhbHVlXG5cbiAgICAgIC8vIHRleHQgbm9kZVxuICAgICAgaWYgKHR5cGUgPT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9ICdTVFlMRScpIHtcbiAgICAgICAgYWRkRXhwcihkb20sIHZhbHVlKVxuXG4gICAgICAvLyBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gMSkge1xuXG4gICAgICAgIC8vIGxvb3A/XG4gICAgICAgIHZhbHVlID0gZG9tLmdldEF0dHJpYnV0ZSgnZWFjaCcpXG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgYWRkRXhwcihkb20sIHZhbHVlLCB7IGxvb3A6IDEgfSlcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGN1c3RvbSB0YWc/XG4gICAgICAgIHZhciB0YWcgPSB0YWdfaW1wbFtkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXVxuXG4gICAgICAgIC8vIGF0dHJpYnV0ZXNcbiAgICAgICAgZWFjaChkb20uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxuICAgICAgICAgICAgICB2YWx1ZSA9IGF0dHIudmFsdWVcblxuICAgICAgICAgIC8vIG5hbWVkIGVsZW1lbnRzXG4gICAgICAgICAgaWYgKC9eKG5hbWV8aWQpJC8udGVzdChuYW1lKSkgbmFtZWRfZWxlbWVudHNbdmFsdWVdID0gZG9tXG5cbiAgICAgICAgICAvLyBleHByZXNzaW9uc1xuICAgICAgICAgIGlmICghdGFnKSB7XG4gICAgICAgICAgICB2YXIgYm9vbCA9IG5hbWUuc3BsaXQoJ19fJylbMV1cbiAgICAgICAgICAgIGFkZEV4cHIoZG9tLCB2YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICAgIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRhZykgYWRkRXhwcihkb20sIDAsIHsgdGFnOiB0YWcgfSlcblxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIHJldHVybiB7IGV4cHI6IGV4cHJlc3Npb25zLCBlbGVtOiBuYW1lZF9lbGVtZW50cyB9XG5cbiAgICBmdW5jdGlvbiBhZGRFeHByKGRvbSwgdmFsdWUsIGRhdGEpIHtcbiAgICAgIGlmICh2YWx1ZSA/IHZhbHVlLmluZGV4T2YoJ3snKSA+PSAwIDogZGF0YSkge1xuICAgICAgICB2YXIgZXhwciA9IHsgZG9tOiBkb20sIGV4cHI6IHZhbHVlIH1cbiAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHRlbmQoZXhwciwgZGF0YSB8fCB7fSkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuXG4gIC8vIGNyZWF0ZSBuZXcgY3VzdG9tIHRhZyAoY29tcG9uZW50KVxuICBmdW5jdGlvbiBjcmVhdGVUYWcoY29uZikge1xuXG4gICAgdmFyIG9wdHMgPSBjb25mLm9wdHMgfHwge30sXG4gICAgICAgIGRvbSA9IG1rZG9tKGNvbmYudG1wbCksXG4gICAgICAgIG1vdW50Tm9kZSA9IGNvbmYucm9vdCxcbiAgICAgICAgcGFyZW50ID0gY29uZi5wYXJlbnQsXG4gICAgICAgIGFzdCA9IHBhcnNlKGRvbSksXG4gICAgICAgIHRhZyA9IHsgcm9vdDogbW91bnROb2RlLCBvcHRzOiBvcHRzLCBwYXJlbnQ6IHBhcmVudCwgX19pdGVtOiBjb25mLml0ZW0gfSxcbiAgICAgICAgYXR0cmlidXRlcyA9IHt9XG5cbiAgICAvLyBuYW1lZCBlbGVtZW50c1xuICAgIGV4dGVuZCh0YWcsIGFzdC5lbGVtKVxuXG4gICAgLy8gYXR0cmlidXRlc1xuICAgIGVhY2gobW91bnROb2RlLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIGF0dHJpYnV0ZXNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWVcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlT3B0cygpIHtcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciB2YWwgPSBvcHRzW25hbWVdID0gdG1wbChhdHRyaWJ1dGVzW25hbWVdLCBwYXJlbnQgfHwgdGFnKVxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgbW91bnROb2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVPcHRzKClcblxuICAgIGlmICghdGFnLm9uKSB7XG4gICAgICByaW90Lm9ic2VydmFibGUodGFnKVxuICAgICAgZGVsZXRlIHRhZy5vZmYgLy8gb2ZmIG1ldGhvZCBub3QgbmVlZGVkXG4gICAgfVxuXG4gICAgaWYgKGNvbmYuZm4pIGNvbmYuZm4uY2FsbCh0YWcsIG9wdHMpXG5cblxuICAgIHRhZy51cGRhdGUgPSBmdW5jdGlvbihkYXRhLCBfc3lzdGVtKSB7XG5cbiAgICAgIC8qXG4gICAgICAgIElmIGxvb3AgaXMgZGVmaW5lZCBvbiB0aGUgcm9vdCBvZiB0aGUgSFRNTCB0ZW1wbGF0ZVxuICAgICAgICB0aGUgb3JpZ2luYWwgcGFyZW50IGlzIGEgdGVtcG9yYXJ5IDxkaXYvPiBieSBta2RvbSgpXG4gICAgICAqL1xuICAgICAgaWYgKHBhcmVudCAmJiBkb20gJiYgIWRvbS5maXJzdENoaWxkKSB7XG4gICAgICAgIG1vdW50Tm9kZSA9IHBhcmVudC5yb290XG4gICAgICAgIGRvbSA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKF9zeXN0ZW0gfHwgZG9jLmJvZHkuY29udGFpbnMobW91bnROb2RlKSkge1xuICAgICAgICBleHRlbmQodGFnLCBkYXRhKVxuICAgICAgICBleHRlbmQodGFnLCB0YWcuX19pdGVtKVxuICAgICAgICB1cGRhdGVPcHRzKClcbiAgICAgICAgdXBkYXRlKGFzdC5leHByLCB0YWcpXG5cbiAgICAgICAgLy8gdXBkYXRlIHBhcmVudFxuICAgICAgICAhX3N5c3RlbSAmJiB0YWcuX19pdGVtICYmIHBhcmVudC51cGRhdGUoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWcudHJpZ2dlcigndW5tb3VudCcpXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICB0YWcudXBkYXRlKDAsIHRydWUpXG5cbiAgICAvLyBhcHBlbmQgdG8gcm9vdFxuICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkge1xuICAgICAgaWYgKGNvbmYuYmVmb3JlKSBtb3VudE5vZGUuaW5zZXJ0QmVmb3JlKGRvbS5maXJzdENoaWxkLCBjb25mLmJlZm9yZSlcbiAgICAgIGVsc2UgbW91bnROb2RlLmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKVxuICAgIH1cblxuXG4gICAgdGFnLnRyaWdnZXIoJ21vdW50JylcblxuICAgIGFsbF90YWdzLnB1c2godGFnKVxuXG4gICAgcmV0dXJuIHRhZ1xuICB9XG5cblxuICBmdW5jdGlvbiBsb29wKGV4cHIsIGluc3RhbmNlKSB7XG5cbiAgICAvLyBpbml0aWFsaXplIG9uY2VcbiAgICBpZiAoZXhwci5kb25lKSByZXR1cm5cbiAgICBleHByLmRvbmUgPSB0cnVlXG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICAgIHByZXYgPSBkb20ucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgICAgIHRlbXBsYXRlID0gZG9tLm91dGVySFRNTCxcbiAgICAgICAgdmFsID0gZXhwci5leHByLFxuICAgICAgICBlbHMgPSB2YWwuc3BsaXQoL1xccytpblxccysvKSxcbiAgICAgICAgcmVuZGVyZWQgPSBbXSxcbiAgICAgICAgY2hlY2tzdW0sXG4gICAgICAgIGtleXNcblxuXG4gICAgaWYgKGVsc1sxXSkge1xuICAgICAgdmFsID0gJ3sgJyArIGVsc1sxXVxuICAgICAga2V5cyA9IGVsc1swXS5zbGljZSgxKS50cmltKCkuc3BsaXQoLyxcXHMqLylcbiAgICB9XG5cbiAgICAvLyBjbGVhbiB0ZW1wbGF0ZSBjb2RlXG4gICAgaW5zdGFuY2Uub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHAgPSBkb20ucGFyZW50Tm9kZVxuICAgICAgaWYgKHApIHtcbiAgICAgICAgcm9vdCA9IHBcbiAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChkb20pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIHN0YXJ0UG9zKCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwocm9vdC5jaGlsZE5vZGVzLCBwcmV2KSArIDFcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5vbigndXBkYXRlZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgaXRlbXMgPSB0bXBsKHZhbCwgaW5zdGFuY2UpXG4gICAgICAgICAgaXNfYXJyYXkgPSBBcnJheS5pc0FycmF5KGl0ZW1zKVxuXG4gICAgICBpZiAoaXNfYXJyYXkpIGl0ZW1zID0gaXRlbXMuc2xpY2UoMClcblxuICAgICAgZWxzZSB7XG5cbiAgICAgICAgaWYgKCFpdGVtcykgcmV0dXJuIC8vIHNvbWUgSUU4IGlzc3VlXG5cbiAgICAgICAgLy8gZGV0ZWN0IE9iamVjdCBjaGFuZ2VzXG4gICAgICAgIHZhciB0ZXN0c3VtID0gSlNPTi5zdHJpbmdpZnkoaXRlbXMpXG4gICAgICAgIGlmICh0ZXN0c3VtID09IGNoZWNrc3VtKSByZXR1cm5cbiAgICAgICAgY2hlY2tzdW0gPSB0ZXN0c3VtXG5cbiAgICAgICAgaXRlbXMgPSBPYmplY3Qua2V5cyhpdGVtcykubWFwKGZ1bmN0aW9uKGtleSwgaSkge1xuICAgICAgICAgIHZhciBpdGVtID0ge31cbiAgICAgICAgICBpdGVtW2tleXNbMF1dID0ga2V5XG4gICAgICAgICAgaXRlbVtrZXlzWzFdXSA9IGl0ZW1zW2tleV1cbiAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9KVxuXG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSByZWR1bmRhbnRcbiAgICAgIGRpZmYocmVuZGVyZWQsIGl0ZW1zKS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgcG9zID0gcmVuZGVyZWQuaW5kZXhPZihpdGVtKVxuICAgICAgICByb290LnJlbW92ZUNoaWxkKHJvb3QuY2hpbGROb2Rlc1tzdGFydFBvcygpICsgcG9zXSlcbiAgICAgICAgcmVuZGVyZWQuc3BsaWNlKHBvcywgMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIGFkZCBuZXdcbiAgICAgIGRpZmYoaXRlbXMsIHJlbmRlcmVkKS5tYXAoZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICB2YXIgcG9zID0gaXRlbXMuaW5kZXhPZihpdGVtKVxuXG4gICAgICAgIC8vIHN0cmluZyBhcnJheVxuICAgICAgICBpZiAoa2V5cyAmJiAhY2hlY2tzdW0pIHtcbiAgICAgICAgICB2YXIgb2JqID0ge31cbiAgICAgICAgICBvYmpba2V5c1swXV0gPSBpdGVtXG4gICAgICAgICAgb2JqW2tleXNbMV1dID0gcG9zXG4gICAgICAgICAgaXRlbSA9IG9ialxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRhZyA9IGNyZWF0ZVRhZyh7XG4gICAgICAgICAgYmVmb3JlOiByb290LmNoaWxkTm9kZXNbc3RhcnRQb3MoKSArIHBvc10sXG4gICAgICAgICAgcGFyZW50OiBpbnN0YW5jZSxcbiAgICAgICAgICB0bXBsOiB0ZW1wbGF0ZSxcbiAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgIHJvb3Q6IHJvb3RcbiAgICAgICAgfSlcblxuICAgICAgICBpbnN0YW5jZS5vbigndXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGFnLnVwZGF0ZSgwLCB0cnVlKVxuICAgICAgICB9KVxuXG4gICAgICB9KVxuXG4gICAgICAvLyBhc3NpZ24gcmVuZGVyZWRcbiAgICAgIHJlbmRlcmVkID0gaXRlbXNcblxuICAgIH0pXG5cbiAgfVxuXG4gIHJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgdG1wbCwgZm4pIHtcbiAgICBmbiA9IGZuIHx8IG5vb3AsXG4gICAgdGFnX2ltcGxbbmFtZV0gPSBbdG1wbCwgZm5dXG4gIH1cblxuICByaW90Lm1vdW50VG8gPSBmdW5jdGlvbihub2RlLCB0YWdOYW1lLCBvcHRzKSB7XG4gICAgdmFyIHRhZyA9IHRhZ19pbXBsW3RhZ05hbWVdXG4gICAgcmV0dXJuIHRhZyAmJiBjcmVhdGVUYWcoeyB0bXBsOiB0YWdbMF0sIGZuOiB0YWdbMV0sIHJvb3Q6IG5vZGUsIG9wdHM6IG9wdHMgfSlcbiAgfVxuXG4gIHJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PSAnKicpIHNlbGVjdG9yID0gT2JqZWN0LmtleXModGFnX2ltcGwpLmpvaW4oJywgJylcblxuICAgIHZhciBpbnN0YW5jZXMgPSBbXVxuXG4gICAgZWFjaChkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnJpb3QpIHJldHVyblxuXG4gICAgICB2YXIgdGFnTmFtZSA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgIGluc3RhbmNlID0gcmlvdC5tb3VudFRvKG5vZGUsIHRhZ05hbWUsIG9wdHMpXG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZXMucHVzaChpbnN0YW5jZSlcbiAgICAgICAgbm9kZS5yaW90ID0gMVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW5zdGFuY2VzXG4gIH1cblxuICAvLyB1cGRhdGUgZXZlcnl0aGluZ1xuICByaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhbGxfdGFncyA9IGFsbF90YWdzLmZpbHRlcihmdW5jdGlvbih0YWcpIHtcbiAgICAgIHJldHVybiAhIXRhZy51cGRhdGUoKVxuICAgIH0pXG4gIH1cblxufSkocmlvdCwgdGhpcy50b3ApXG5cblxuLy8gc3VwcG9ydCBDb21tb25KU1xuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgbW9kdWxlLmV4cG9ydHMgPSByaW90XG5cbi8vIHN1cHBvcnQgQU1EXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHJpb3QgfSlcblxuLy8gc3VwcG9ydCBicm93c2VyXG5lbHNlXG4gIHRoaXMucmlvdCA9IHJpb3RcblxufSkoKTsiXX0=
