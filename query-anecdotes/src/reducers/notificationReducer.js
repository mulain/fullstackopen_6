const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const setNotification = (message) => ({
  type: 'SET_NOTIFICATION',
  payload: message,
})

export const clearNotification = () => ({
  type: 'CLEAR_NOTIFICATION',
})

export const setNotificationWithTimeout = (message, timeout = 5000) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout)
  }
}

export default notificationReducer
