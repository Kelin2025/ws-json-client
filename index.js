import { createEvent, createStore, sample } from "effector"

export const createSocketEventFactory = socket => evt => {
  const cb = createEvent(evt)

  socket.onEvent(evt, cb)

  return cb
}

export const makeSocket = path => {
  const socket = new WebSocket(path)
  const $isOpened = createStore(false)
  const $queue = createStore([])
  const socketOpened = createEvent("socketOpened")
  const emit = createEvent("emit")

  $isOpened.on(socketOpened, () => true)

  $queue.on(
    sample($isOpened, emit, (isOpened, payload) => [isOpened, payload])
      .filter({ fn: ([isOpened]) => !isOpened })
      .map(([_, payload]) => payload),
    (state, payload) => [...state, payload]
  )

  sample($queue, socketOpened).watch(queue => {
    queue.forEach(emit)
  })

  sample($isOpened, emit, (isOpened, payload) => [isOpened, payload])
    .filter({ fn: ([isOpened]) => isOpened })
    .map(([_, payload]) => payload)
    .watch(payload => {
      socket.send(payload)
    })

  socket.addEventListener("open", socketOpened)

  socket.onEvent = (action, cb) => {
    socket.addEventListener("message", evt => {
      const json = JSON.parse(evt.data)
      if (json.action === action) {
        cb(json.payload)
      }
    })
  }

  socket.sendAction = (action, payload) => {
    emit(JSON.stringify({ action, payload }))
  }

  return socket
}
