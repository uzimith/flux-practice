todo
  .row
    form.form-inline(onsubmit='{ add }')
      .form-group
        label(for="taskinput") Task
        input#taskinput.form-control(name="input" onkeyup='{ edit }')
      button.btn.btn-default(disabled='{ !text }') Add
  ul
    li(each='{ items }')
      label(class='{ completed: done }')
      input(type="checkbox" onclick='{ parent.toggle }' checked='{done}')
      span { title }
  .row
    button.btn.btn-default(disabled='{ !items.length }' onclick='{ remove }') Remove
  script.
    RiotControl = require('../riotcontrol')
    @disabled =  true
    @items = []

    @on 'mount', =>
      console.log('mount')
      RiotControl.trigger 'todo_init'

    RiotControl.on 'todos_changed', (items)=>
      console.log("changed")
      @items = items
      @update()

    @edit = (e) =>
      console.log("edit")
      @text = e.target.value

    @add = (e) =>
      console.log("add")
      if (@text)
        RiotControl.trigger('todo_add', {title: @text, done: false, id: @items.length + 1})
        @text = @input.value = ''

    @toggle = (e) =>
      console.log("toggle")
      console.log(e.target)
      RiotControl.trigger('todo_toggle', {id: 1})

    @remove = (e) =>
      console.log("remove")
      RiotControl.trigger('todo_remove')

