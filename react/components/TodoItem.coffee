React = require('react')

jade = require('react-jade')
_ = require('lodash')

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

module.exports = TodoItem
