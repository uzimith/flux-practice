TodoPanel = require('./TodoPanel.coffee')

class Application extends React.Component
  render: =>
    jade.compile("""
      FluxComponent(flux=flux connectToStores=['todo'])
        TodoPanel
    """)(_.assign(@, @props, @state))

module.exports = Application
