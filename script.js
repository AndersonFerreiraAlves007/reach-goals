function persistMessages(messages) {
  localStorage.setItem('messages', JSON.stringify(messages))
}

function persistPeriod(period) {
  localStorage.setItem('period', JSON.stringify(period))
}

function getMessages() {
  const messagesString = localStorage.getItem('messages')
  return messagesString ? JSON.parse(messagesString) : []
}

/* const data = [
  {
    name: 'nofap',
    perido: {
      start: new Date(),
      end: new Date()
    },
    messages: [
      {
        content: message,
        type: type,
        date: new Date()
      },
      {
        content: message,
        type: type,
        date: new Date()
      },
    ]
  }
] */

function getPeriod() {
  const messagePeriod = localStorage.getItem('period')
  if(messagePeriod) {
    const json = JSON.parse(messagePeriod)
    return {
      start: new Date(json.start),
      end: new Date(json.end)
    }
  } else {
    return {
      start: new Date(),
      end: new Date()
    }
  }
}

///////////////////LISTAGEM DE MENSAGENS//////////////////

function renderMessage(listMessagesElement, message) {
  listMessagesElement.innerHTML += `
    <div>${message.content}</div>
  `
}

function clearListMessage(listMessagesElement) {
  listMessagesElement.innerHTML = ''
}

function renderListMessages(listMessagesElement, messages) {
  clearListMessage(listMessagesElement)
  messages.reverse().forEach(message => renderMessage(listMessagesElement, message))
}

///////////////////LISTAGEM DE MENSAGENS//////////////////

function calculateDays(period) {
  const timeStart = period.start.getTime()
  const timeEnd = period.end.getTime()

  return parseInt((timeEnd - timeStart)/(60 * 60 * 1000 * 24), 10)
}

function formatDate(date) {
  return `${formatNumber(date.getDate())}/${formatNumber(date.getMonth() + 1)}/${date.getFullYear()}`
}

function renderPeriod(period) {
  document.getElementById('start-date').innerText = `Início: ${formatDate(period.start)}`
  document.getElementById('end-date').innerText = `Término:${formatDate(period.end)}`
  document.getElementById('remaining').innerText = `${parseInt((calculateDays({
    start: new Date(),
    end: period.end
  })))} dias`
}

function handleCreateMessage() {
  hideDialogCreateMessage()
  //
  const message = document.getElementById('message-input').value
  const type = document.getElementById('type-message-input').value
  //
  const messages = getMessages()
  if(messages.length > 0) {
    if(
      new Date(messages[messages.length - 1].date).getDate() === new Date().getDate() && 
      new Date(messages[messages.length - 1].date).getMonth() === new Date().getMonth() && 
      new Date(messages[messages.length - 1].date).getFullYear() === new Date().getFullYear()
    ) {
      messages[messages.length - 1] = {
        content: message,
        type: type,
        date: new Date()
      }
    } else {
      messages.push({
        content: message,
        type: type,
        date: new Date()
      })
    }
  } else {
    messages.push({
      content: message,
      type: type,
      date: new Date()
    })
  }
  
  persistMessages(messages)
  //
  renderListMessages(document.getElementById('list-messages'), getMessages())
}

function formatNumber(number) {
  return `${number < 10 ? `0${number}` : number}`
}

function handleEditPeriod() {
  hideDialogEditPeriod()
  //
  const start = new Date(`${document.getElementById('start-date-input').value} `)
  const end = new Date(`${document.getElementById('end-date-input').value} `)

  console.log(start)
  //
  const period = getPeriod()
  period.start = start
  period.end= end
  persistPeriod(period)
  //
  renderPeriod(getPeriod())
}

document.getElementById('btn-counter-edit').addEventListener('click', () => {
  showDialogEditPeriod(document.getElementById('dialog-edit-period'))
})

document.getElementById('btn-message-create').addEventListener('click', () => {
  showDialogCreateMessage(document.getElementById('dialog-create-message'))
})

document.getElementById('btn-cancel-create-message').addEventListener('click', () => {
  hideDialogCreateMessage()
  clearFormCreateMessage()
})

document.getElementById('btn-save-create-message').addEventListener('click', () => {
  handleCreateMessage()
  clearFormCreateMessage()
})

document.getElementById('btn-cancel-edit-period').addEventListener('click', () => {
  hideDialogEditPeriod()
})

document.getElementById('btn-save-edit-period').addEventListener('click', () => {
  handleEditPeriod()
})

function hideDialogCreateMessage() {
  document.getElementById('dialog-create-message').hidden = true
}

function showDialogCreateMessage() {
  document.getElementById('dialog-create-message').hidden = false
}

function hideDialogEditPeriod() {
  document.getElementById('dialog-edit-period').hidden = true
}

function showDialogEditPeriod() {
  document.getElementById('dialog-edit-period').hidden = false
}

function clearFormCreateMessage() {
  document.getElementById('message-input').value = ''
  document.getElementById('type-message-input').value = 'good'
}

hideDialogEditPeriod()
hideDialogCreateMessage()
renderListMessages(document.getElementById('list-messages'), getMessages())
renderPeriod(getPeriod())
