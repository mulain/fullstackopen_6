import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createContext, useReducer } from 'react'
import axios from 'axios'

// local
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

export const NotificationContext = createContext()

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

const App = () => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  const queryClient = useQueryClient()

  const voteAnecdoteMutation = useMutation({
    mutationFn: async (anecdote) => {
      const response = await axios.patch(
        `http://localhost:3001/anecdotes/${anecdote.id}`,
        { votes: anecdote.votes + 1 }
      )
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `You voted for '${data.content}'`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
    onError: (error) => {
      console.error('Error voting anecdote:', error)
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'Error voting for anecdote',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/anecdotes')
      return response.data
    },
  })

  const { data: anecdotes, isLoading, isError } = result

  if (isLoading) {
    return <div>loading data...</div>
  }
  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
  }

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {(anecdotes || []).map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  )
}

export default App
