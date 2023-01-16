import { useState } from "react"

const SelectUsername = ({ onInput }) => {
  const [username, setUsername] = useState("")
  const isValid = username.length > 2

  const onSubmit = (event) => {
    event.preventDefault()
    onInput(username)
  }

  return (
    <div className="select-username">
      <form onSubmit={onSubmit}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Your username..."
        />
        <button disabled={!isValid}>Send</button>
      </form>
    </div>
  )
}

export default SelectUsername
