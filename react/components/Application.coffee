React = require('react')
jade = require('react-jade')
_ = require('lodash')

TodoPanel = require('./TodoPanel.coffee')
FluxComponent = require('flummox/component')


class Application extends React.Component
  render: =>
    jade.compile("""
      FluxComponent(flux=flux connectToStores=['todo'])
        TodoPanel
    """)(_.assign(@, @props, @state))

module.exports = Application
