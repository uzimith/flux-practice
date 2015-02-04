todo
  .row
    ul
      li(each='{ items }')
        label(class='{ completed: done }')
          input(type="checked" onclick='{ parent.toggle }')
    form(onsubmit='{ add }')
      input(name="input" onkeyup='{ edit }')
      button(disabled='{ !text }') Add { items.length + 1 }
    button(disabled='{ !items.length }' onclick='{ remove }') Remove
    script.
      RiotControl = require('./riotcontrol')

      @disabled =  true
      @items = []

      @on 'mount', =>
      RiotControl.trigger 'todo_init'

      RiotControl.on 'todos_changed', (items)=>
        @items = items
        @update()

      edit = (e) =>
        @text = e.target.value

      add = (e) =>
        if (@text)
          RiotControl.trigger('todo_add', {title: @text})
          @text = @input.value = ''

      toggle = (e) =>
        item = e.item
        item.done = !item.done
        true

      remove = (e) =>
        RiotControl.trigger('todo_remove')

