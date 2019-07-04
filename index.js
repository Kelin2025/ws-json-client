import { createEvent } from "effector"

export const createSocketEventFactory = socket => evt => {
  const cb = createEvent(evt)

  socket.onEvent(evt, cb)

  return cb
}

export const makeSocket = path => {
  const socket = new WebSocket(path)

  socket.onEvent = (action, cb) => {
    socket.addEventListener("message", evt => {
      const json = JSON.parse(evt.data)
      if (json.action === action) {
        cb(json.payload)
      }
    })
  }

  socket.sendAction = (action, payload) => {
    socket.send(JSON.stringify({ action, payload }))
  }

  return socket
}
