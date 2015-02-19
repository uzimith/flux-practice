window.React = require('react')
Flux = require('flummox').Flux

Application = require('./components/Application.coffee')
TodoActions = require('./actions/TodoActions.coffee')
TodoStore = require('./stores/TodoStore.coffee')

class AppFlux extends Flux
  constructor: ->
    super
    @createActions('todo', TodoActions)
    @createStore('todo', TodoStore, @)

flux = new AppFlux

React.render(React.createFactory(Application)(flux: flux), document.getElementById('container'))
# React.render(React.createFactory(Application)(), document.getElementById('container'))
