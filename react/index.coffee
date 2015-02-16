React = require('react')
Flummox = require('flummox')
Actions = Flummox.Actions
Store = Flummox.Store
Flux = Flummox.Flux
FluxComponent = require('flummox/component')
jade = require('react-jade')
_ = require('lodash')

class TodoActions extends Actions
  createTodo: (text) ->
    id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
    {
      id: id
      text: text
      complete: false
    }

  toggleTodo: (todo) ->
    todo.id

  clearCompletedTodos: ->
    null

class TodoStore extends Store
  constructor: (flux) ->
    super
    todoActions = flux.getActionIds('todo')
    @register(todoActions.createTodo, @handleNewTodo)
    @register(todoActions.toggleTodo, @toggleTodo)
    @register(todoActions.clearCompletedTodos, @clearCompletedTodos)
    @state = {
      todos: {
        1: {
          id: 1
          complete: true
          text: "hoge"
        },
        2: {
          id: 2
          complete: false
          text: "fuga"
        }
      }
    }

  handleNewTodo: (todo) =>
    todos = @state.todos
    todos[todo.id] = todo
    @setState todos: todos

  toggleTodo: (id) =>
    todos = @state.todos
    todos[id].complete = !todos[id].complete
    @setState todos: todos

  clearCompletedTodos: =>
    todos = @state.todos
    newTodos = {}
    for index, todo of todos
      newTodos[todo.id] = todo unless todo.complete
    @setState todos: newTodos


class AppFlux extends Flux
  constructor: ->
    super
    @createActions('todo', TodoActions)
    @createStore('todo', TodoStore, @)

class Application extends React.Component
  render: =>
    jade.compile("""
      FluxComponent(flux=flux connectToStores=['todo'])
        TodoPanel
    """)(_.assign(@, @props, @state))

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

class TodoItem extends React.Component
  @propTypes:
    todo: React.PropTypes.object.isRequired

  render: ->
    cx = React.addons.classSet
    classes = cx {
      complete: @props.todo.complete
    }
    jade.compile("""
      span(className=classes onClick=onClick)= todo.text
    """)(_.assign(@, @props, @state))

  onClick: =>
    @props.flux.getActions("todo").toggleTodo(@todo)

flux = new AppFlux

React.render(React.createFactory(Application)(flux: flux), document.getElementById('container'))
