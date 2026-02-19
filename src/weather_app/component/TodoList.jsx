import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, removeTodo, toggleTodo, setTodoFilter, setTodoInput } from '../redux/slice'
import '../css/todolist.css'

const TodoList = () => {
  const dispatch = useDispatch()
  const { todos, todoFilter, todoInput } = useSelector(state => state.weather)

  const handleAdd = (e) => {
    e.preventDefault()
    if (todoInput.trim() === '') return
    dispatch(addTodo(todoInput.trim()))
    dispatch(setTodoInput(''))
  }

  const filteredTodos = todos.filter(todo => {
    if (todoFilter === 'ACTIVE') return !todo.done
    if (todoFilter === 'DONE') return todo.done
    return true
  })

  return (
    <div className='todolist'>
      <h2 className='todo-title'>TODO LIST</h2>

      <form className='todo-form' onSubmit={handleAdd}>
        <input
          type='text'
          value={todoInput}
          onChange={(e) => dispatch(setTodoInput(e.target.value))}
          placeholder='할 일 입력...'
        />
        <button type='submit'>ADD</button>
      </form>

      <div className='todo-filters'>
        {['ALL', 'ACTIVE', 'DONE'].map(filter => (
          <button
            key={filter}
            className={todoFilter === filter ? 'active' : ''}
            onClick={() => dispatch(setTodoFilter(filter))}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className='todo-items'>
        {filteredTodos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <div
              className='todo-check'
              onClick={() => dispatch(toggleTodo(todo.id))}
            >
              {todo.done ? '✅' : '⬜'}
            </div>
            <span className='todo-text'>{todo.text}</span>
            <button
              className='todo-delete'
              onClick={() => dispatch(removeTodo(todo.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodoList