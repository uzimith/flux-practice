message-editor
  textarea(name='input' onkeyup='{ edit }')
  script.
    @edit = (e) =>
      @text = e.target.value
