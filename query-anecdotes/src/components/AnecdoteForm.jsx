import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import axios from 'axios'

// local
import { NotificationContext } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  // clunky form
  const { notification, notificationDispatch } = useContext(NotificationContext)

  // thunk form
  const { notifyWithTimeout } = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const createAnecdoteMutation = useMutation({
    mutationFn: async (newAnecdote) => {
      const response = await axios.post(
        'http://localhost:3001/anecdotes',
        newAnecdote
      )
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      // clunky form
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote created: '${data.content}'`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 2000)
    },
    onError: (error) => {
      console.error('Error creating anecdote:', error)
      // thunk form
      // induce this by sending string with len < 5
      notifyWithTimeout('Error creating anecdote', 500)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    createAnecdoteMutation.mutate({
      content,
      votes: 0,
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
