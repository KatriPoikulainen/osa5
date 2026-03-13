const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  const style = {
    padding: 10,
    border: `2px solid ${notification.type === 'error' ? 'red' : 'green'}`,
    marginBottom: 10,
    color: notification.type === 'error' ? 'red' : 'green'
  }
  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}
export default Notification