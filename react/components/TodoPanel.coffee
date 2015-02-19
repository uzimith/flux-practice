TodoItem = require('./TodoItem.coffee')

class TodoPanel extends React.Component
  constructor: ->
    @state = {
      newTodoText: ""
    }

  render: =>
    jade.compile("""
      div
        ul
          each todo in todos
            li(key=todo.id)
              TodoItem(todo=todo flux=flux)
        form(onSubmit=onSubmitForm)
          input(type="text" value=newTodoText onChange=handleTodoTextChange)
          input(type="submit" value="Add Todo")
        button(onClick=clearCompletedTodos) clear completed
    """)(_.assign(@, @props, @state))

  handleTodoTextChange: (e) =>
    @setState newTodoText: e.target.value

  onSubmitForm: (e) =>
    e.preventDefault()
    if @state.newTodoText.trim()
      @props.flux.getActions("todo").createTodo(@state.newTodoText)
      @setState({newTodoText: ""})

  clearCompletedTodos: (e) =>
    @props.flux.getActions("todo").clearCompletedTodos()

module.exports = TodoPanel
