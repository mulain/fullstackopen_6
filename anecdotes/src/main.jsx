import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

// local
import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
