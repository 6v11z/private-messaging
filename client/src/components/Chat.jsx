import { useEffect, useState } from "react"
import User from "./User"
import MessagePanel from "./MessagePanel"
import socket from "../socket"

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    socket.on("connect", () => {
      setUsers((current) => {
        const currentUsers = current.map((user) => {
          if (user.self) {
            return { ...user, connected: true }
          }
          return user
        })
        return currentUsers
      })
    })

    socket.on("disconnect", () => {
      setUsers((current) => {
        const currentUsers = current.map((user) => {
          if (user.self) {
            return { ...user, connected: false }
          }
          return user
        })
        return currentUsers
      })
    })

    const initReactiveProperties = (user) => {
      user.connected = true
      user.messages = []
      user.hasNewMessages = false
    }

    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id
        initReactiveProperties(user)
      })
      // put the current user first, and sort by username
      const sortedUsers = users.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })

      setUsers(sortedUsers)
    })

    socket.on("user connected", (user) => {
      initReactiveProperties(user)
      setUsers((current) => [...current, user])
    })

    socket.on("user disconnected", (id) => {
      setUsers((current) => {
        const currentUsers = current.map((user) => {
          if (user.userID === id) {
            return { ...user, connected: false }
          }
          return user
        })
        return currentUsers
      })
    })

    socket.on("private message", ({ content, from }) => {
      setUsers((current) => {
        const currentUsers = current.map((user) => {
          if (user.userID === from) {
            user.messages.push({
              content,
              fromSelf: false,
            })
            return {
              ...user,
              hasNewMessages: user !== selectedUser ? true : false,
              messages: user.messages,
            }
          }
          return user
        })
        return currentUsers
      })
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("users")
      socket.off("user connected")
      socket.off("user disconnected")
      socket.off("private message")
    }
  }, [])

  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      })
      setSelectedUser((current) => {
        selectedUser.messages.push({
          content,
          fromSelf: true,
        })
        return {
          ...current,
          messages: selectedUser.messages,
        }
      })
    }
  }

  const onSelectUser = (user) => {
    setSelectedUser(user)
    user.hasNewMessages = false
  }

  return (
    <div>
      <div className="left-panel">
        {users.map((user) => (
          <User
            key={user.userID}
            user={user}
            selected={selectedUser === user}
            onSelect={() => onSelectUser(user)}
          />
        ))}
      </div>
      {selectedUser ? (
        <MessagePanel user={selectedUser} onInput={onMessage} />
      ) : null}
    </div>
  )
}

export default Chat
