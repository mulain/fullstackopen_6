import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import axios from 'axios'

// local
import { NotificationContext } from '../App'

const AnecdoteForm = () => {
  const { notification, notificationDispatch } = useContext(NotificationContext)
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
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote created: '${data.content}'`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
    onError: (error) => {
      console.error('Error creating anecdote:', error)
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Error creating anecdote: '${error.message}'`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
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
