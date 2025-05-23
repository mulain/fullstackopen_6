import { useDispatch, useSelector } from 'react-redux'

// local
import { voteAnecdote } from '../reducers/anecdoteReducer'
import Filter from './Filter'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)

  const vote = (id) => {
    const notificationText = `you voted for '${
      anecdotes.find((a) => a.id === id).content
    }'`

    dispatch(voteAnecdote(id))
    dispatch(setNotificationWithTimeout(notificationText, 2))
  }

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
  //
  // Not necessary to spread the array,
  // because filter returns a new array.
  // Kept it as a reminder that sort mutates the array.
  const sortedFilteredAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes
  )

  return (
    <div>
      <h2>Anecdotes</h2>

      <Filter />

      {sortedFilteredAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
