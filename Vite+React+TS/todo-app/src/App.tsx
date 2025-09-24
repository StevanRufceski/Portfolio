import './App.css'
import { ToastContainer } from 'react-toastify';
import TodoCreate from './components/TodoCreate'
function App() {
  return (
    <main className="app">
      <ToastContainer />
      <h1>
        To-Do management app
      </h1>
      <hr />
      <TodoCreate />
    </main>
  )
}
export default App
