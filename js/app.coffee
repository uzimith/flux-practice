riot = require('riot')
TodoStore = require('./stores/todostore.coffee')
RiotControl = require('./riotcontrol')


normalizedPath = require("path").join(__dirname, "components")

require('./components/app.tag')
require('./components/todo.tag')
require('./components/todo-count.tag')
require('./components/todo-remove.tag')
require('./components/task.tag')

RiotControl.addStore(new TodoStore)
riot.mount('*')
