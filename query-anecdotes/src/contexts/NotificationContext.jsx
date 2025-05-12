import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

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

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
