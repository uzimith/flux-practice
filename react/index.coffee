window.React = require('react')
window.Flummox = require('flummox')
window.Actions = Flummox.Actions
window.Store = Flummox.Store
window.Flux = Flummox.Flux
window.FluxComponent = require('flummox/component')
window.jade = require('react-jade')
window._ = require('lodash')

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
