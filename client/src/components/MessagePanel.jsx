import { useState } from "react"
import StatusIcon from "./StatusIcon"

const MessagePanel = ({ user, onInput }) => {
  const [input, setInput] = useState("")
  const isValid = input.length > 0
  console.log(user.messages)

  const onSubmit = (event) => {
    event.preventDefault()
    onInput(input)
    setInput("")
  }

  const displaySender = (index) => {
    return (
      index === 0 ||
      user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
    )
  }

  return (
    <div className="right-panel">
      <div className="header">
        <StatusIcon connected={user.connected} />
        {user.username}
      </div>

      <ul className="messages">
        {user.messages.map((message, index) => (
          <li key={index} className="message">
            {displaySender(index) ? (
              <div className="sender">
                {message.fromSelf ? "(yourself)" : user.username}
              </div>
            ) : null}
            {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="form">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Your message..."
          className="input"
        />
        <button disabled={!isValid} className="send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default MessagePanel
