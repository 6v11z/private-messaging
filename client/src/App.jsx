import { useEffect, useState } from "react"
import SelectUsername from "./components/SelectUsername"
import Chat from "./components/Chat"
import socket from "./socket"

function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false)
      }
    })

    return () => {
      socket.off("connect_error")
    }
  }, [])

  const onUsernameSelection = (username) => {
    setUsernameAlreadySelected(true)
    socket.auth = { username }
    socket.connect()
  }

  return (
    <div className="App">
      {!usernameAlreadySelected ? (
        <SelectUsername onInput={onUsernameSelection} />
      ) : (
        <Chat />
      )}
    </div>
  )
}

export default App
