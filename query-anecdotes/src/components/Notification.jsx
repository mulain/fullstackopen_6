import { useContext } from 'react'

// local
import { NotificationContext } from '../App'

const Notification = () => {
  const { notification } = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!notification || notification === '') return null

  return <div style={style}>{notification}</div>
}

export default Notification
