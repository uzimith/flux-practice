(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/app.coffee":[function(require,module,exports){
var RiotControl, TodoStore, riot;

riot = require('riot');

TodoStore = require('./stores/TodoStore.coffee');

RiotControl = require('./riotcontrol.js');

require('./components/app.tag');

require('./components/todo.tag');

require('./components/todo-count.tag');

require('./components/todo-remove.tag');

require('./components/todo-item.tag');

RiotControl.addStore(new TodoStore);

riot.mount('*');



},{"./components/app.tag":"/Users/uzimith/learn/flux-todo-practice/todo/js/components/app.tag","./components/todo-count.tag":"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-count.tag","./components/todo-item.tag":"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-item.tag","./components/todo-remove.tag":"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-remove.tag","./components/todo.tag":"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo.tag","./riotcontrol.js":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js","./stores/TodoStore.coffee":"/Users/uzimith/learn/flux-todo-practice/todo/js/stores/TodoStore.coffee","riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/actions/TodoAction.coffee":[function(require,module,exports){
var RiotControl, TodoAction;

RiotControl = require('../riotcontrol');

TodoAction = {
  add: function(text) {
    return RiotControl.trigger('todo_add', {
      title: text,
      done: false
    });
  },
  toggle: function(task) {
    return RiotControl.trigger('todo_toggle', task.id);
  },
  destroy: function(task) {
    return RiotControl.trigger('todo_remove', task.id);
  },
  destroyCompleted: function() {
    return RiotControl.trigger('todo_removeCompleted');
  }
};

module.exports = TodoAction;



},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/components/app.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('app', '<header class="navbar navbar-default navbar-static-top"><div class="container"><div class="navbar-header"><div class="navbar-brand">Todo</div></div><nav class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a><todo-count></todo-count></a></li></ul></nav></div></header><div class="container"><todo title="Demo" class="col-md-6 col-md-offset-3"></todo></div>', function(opts) {

});
},{"riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-count.tag":[function(require,module,exports){
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
},{"../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-item.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-item', '<div onmouseover="{ hover }" onmouseout="{ unhover }" class="clearfix todo { completed: opts.task.done }"><label><input type="checkbox" onclick="{ toggle }" __checked="{ opts.task.done }"><span> { opts.task.title } </span></label><button show="{isHover}" onclick="{ remove }" class="pull-right btn btn-xs btn-default"><span class="glyphicon glyphicon-remove"></span></button></div>', function(opts) {var RiotControl, TodoAction;

RiotControl = require('../riotcontrol');

TodoAction = require('../actions/TodoAction.coffee');

this.isHover = false;

this.toggle = (function(_this) {
  return function(e) {
    TodoAction.toggle(opts.task);
    return true;
  };
})(this);

this.remove = (function(_this) {
  return function(e) {
    return TodoAction.destroy(opts.task);
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
},{"../actions/TodoAction.coffee":"/Users/uzimith/learn/flux-todo-practice/todo/js/actions/TodoAction.coffee","../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo-remove.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo-remove', '<button if="{ completed != 0}" onclick="{ remove }" class="pull-right btn btn-danger btn-xs">Clear completed ({ completed })</button>', function(opts) {var RiotControl, TodoAction;

RiotControl = require('../riotcontrol');

TodoAction = require('../actions/TodoAction.coffee');

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
    return TodoAction.destroyCompleted();
  };
})(this);

});
},{"../actions/TodoAction.coffee":"/Users/uzimith/learn/flux-todo-practice/todo/js/actions/TodoAction.coffee","../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/components/todo.tag":[function(require,module,exports){
var riot = require('riot');

riot.tag('todo', '<div class="row"><form onsubmit="{ add }" class="form-inline"><div class="form-group"><label for="taskinput">Task</label><input id="taskinput" name="input" onkeyup="{ edit }" class="form-control"></div><button __disabled="{ !text }" class="btn btn-default">Add</button></form></div><ul class="list-group"><li each="{ _, task in todos }" class="list-group-item"><todo-item task="{task}"></todo-item></li></ul><div class="row"><todo-remove></todo-remove></div>', function(opts) {var RiotControl, TodoAction;

RiotControl = require('../riotcontrol');

TodoAction = require('../actions/TodoAction.coffee');

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
      TodoAction.add(_this.text);
      return _this.text = _this.input.value = '';
    }
  };
})(this);

});
},{"../actions/TodoAction.coffee":"/Users/uzimith/learn/flux-todo-practice/todo/js/actions/TodoAction.coffee","../riotcontrol":"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js","riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/js/riotcontrol.js":[function(require,module,exports){
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

},{}],"/Users/uzimith/learn/flux-todo-practice/todo/js/stores/TodoStore.coffee":[function(require,module,exports){
var TodoStore, riot;

riot = require('riot');

TodoStore = function() {
  riot.observable(this);
  this.todos = {};
  this.on('todo_add', (function(_this) {
    return function(newTodo) {
      var id;
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



},{"riot":"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js"}],"/Users/uzimith/learn/flux-todo-practice/todo/node_modules/riot/riot.js":[function(require,module,exports){
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
},{}]},{},["./js/app.coffee"])


//# sourceMappingURL=bundle.js.map