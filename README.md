# WS JSON client

Simple WS with some helpers

## Installation

```bash
npm install ws-json-client
```

## Usage

```js
import { makeSocket, createSocketEventFactory } from "ws-json-client"

const socket = makeSocket("ws://localhost:8080")
const createSocketEvent = createSocketEventFactory(socket)

// Will trigger on data with { action: "users.received", payload: ... }
// with data.payload
const usersReceived = createSocketEvent("users.received")
usersReceived.watch(console.log)

// Will send JSON.stringify({ action: "action", payload: { foo: "bar" } })
socket.sendAction("action", { foo: "bar" })
```
