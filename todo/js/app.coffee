riot = require('riot')
TodoStore = require('./stores/TodoStore.coffee')
RiotControl = require('./riotcontrol.js')

require('./components/app.tag')
require('./components/todo.tag')
require('./components/todo-count.tag')
require('./components/todo-remove.tag')
require('./components/todo-item.tag')

RiotControl.addStore(new TodoStore)
riot.mount('*')
