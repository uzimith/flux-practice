message-editor
  form(onsubmit='{ add }')
    textarea.form-control(name='input' onchange='{ edit }' onkeydown='{ keydown }')
  script.
    MessageAction = require('../actions/MessageAction.coffee')

    ENTER_KEY_CODE = 13

    @edit = (e) =>

    @keydown = (e) =>
      if e.keyCode is ENTER_KEY_CODE
        @add(e)
        return false
      else
        @text = e.target.value
        return true

    @add = (e) =>
      if (@text)
        MessageAction.add(@text, opts['thread-id'])
        @text = @input.value = ''
