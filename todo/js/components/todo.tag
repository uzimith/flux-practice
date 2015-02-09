todo
  .row
    form.form-inline(onsubmit='{ add }')
      .form-group
        label(for="taskinput") Task
        input#taskinput.form-control(name="input" onkeyup='{ edit }')
      button.btn.btn-default(disabled='{ !text }') Add
  ul.list-group
    li.list-group-item(each='{ _, task in todos }')
      todo-item(task='{task}')
  .row
    todo-remove
  script.
    RiotControl = require('../riotcontrol')
    TodoAction = require('../actions/TodoAction.coffee')

    @disabled =  true
    @todos = {}

    @on 'mount', =>
      RiotControl.trigger 'todo_init'

    RiotControl.on 'todos_changed', (todos)=>
      @todos = todos
      @update()

    @edit = (e) =>
      @text = e.target.value

    @add = (e) =>
      if (@text)
        TodoAction.add(@text)
        @text = @input.value = ''
