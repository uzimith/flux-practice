riot = require('riot')
TodoStore = require('./stores/todostore.coffee')
RiotControl = require('./riotcontrol')


normalizedPath = require("path").join(__dirname, "components")

require('./components/todoapp.tag')
require('./components/todo.tag')
require('./components/todo-count.tag')

RiotControl.addStore(new TodoStore)
riot.mount('todoapp')
