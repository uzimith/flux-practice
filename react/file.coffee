React = require('react')
jade = require('react-jade')
_ = require('lodash')

class Counter extends React.Component
  constructor: ->
    @state =
      count: 0
  tick: =>
    @setState count: @state.count + 1
  render: =>
    jade.compileFile("./counter.jade")(_.assign {}, @, @props, @state)

React.render(React.createFactory(Counter)(), document.getElementById('container'))
