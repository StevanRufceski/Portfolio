import { useState } from "react";
import  TodoList from "./TodoList";
import { toast } from 'react-toastify';
import { type Todo } from "../types/TodoType";

function TodoCreate() {
    const [description, setDescription] = useState("");
    const [latestTodo, setLatestTodo] = useState<Todo | null>(null);
    const handleCreateTodo = (newTodoDescription: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            description: newTodoDescription,
            isDone: false,
        };
        setDescription(""); // ← Resetiranje input
        setLatestTodo(newTodo)
        toast.success("New todo is created"); 
    };

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent page reload
                    handleCreateTodo(description);
                }}
            >
                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    minLength={3}
                />
                <button type="submit">Create Todo</button>
            </form>
            <TodoList newTodo={latestTodo} />
        </div>
    )
}
export default TodoCreate
