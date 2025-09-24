import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { type Todo } from "../types/TodoType";
import { TodoUpdate } from "./TodoUpdate";

interface TodoListProps {
  newTodo: Todo | null;
}

const todosResponse = [
  { id: 1, description: "Learn React", isDone: false },
  { id: 2, description: "Walk the dog", isDone: false },
];

function TodoList({ newTodo }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(todosResponse);
  }, []);

  useEffect(() => {
    if (newTodo) {
      setTodos((todos) => [...todos, newTodo]);
      toast.success("Results are updated");
    }
  }, [newTodo]);

  const handleTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr
              key={todo.id}
              style={{ color: todo.isDone ? "green" : "black" }}
            >
              <td>{todo.id}</td>
              <td>{todo.description}</td>
              <td>{todo.isDone ? "Done" : "Not done"}</td>
              <td>
                <TodoUpdate todo={todo} handleTodo={handleTodo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
