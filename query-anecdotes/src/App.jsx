import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import axios from 'axios'

// local
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationContext } from './contexts/NotificationContext'

const App = () => {
  const { notifyWithTimeout } = useContext(NotificationContext)
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

      notifyWithTimeout(`You voted for '${data.content}'`, 3000)
    },
    onError: (error) => {
      console.error('Error voting anecdote:', error)
      notifyWithTimeout('Error voting for anecdote', 3000)
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
    <div>
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
    </div>
  )
}

export default App
