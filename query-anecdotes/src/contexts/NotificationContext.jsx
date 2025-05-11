import { createContext, useReducer } from 'react'

// local
import notificationReducer, {
  setNotificationWithTimeout,
} from '../reducers/notificationReducer'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )
  const notifyWithTimeout = (message, timeout) => {
    setNotificationWithTimeout(message, timeout)(notificationDispatch)
  }

  return (
    <NotificationContext.Provider
      value={{
        notification,
        notificationDispatch,
        notifyWithTimeout,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
