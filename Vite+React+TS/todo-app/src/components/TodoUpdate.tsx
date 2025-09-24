import { type Todo } from "../types/TodoType";
import { toast } from "react-toastify";

interface TodoUpdateProps {
  todo: Todo;
  handleTodo: (updatedTodo: Todo) => void;
}

export function TodoUpdate({ todo, handleTodo }: TodoUpdateProps) {
  const toggleDone = () => {
    const updated = { ...todo, isDone: !todo.isDone };
    handleTodo(updated); // Notify parent
    toast.success(`Todo "${updated.description}" marked as ${updated.isDone ? "Done" : "Not done"}`);
  };

  return (
    <button onClick={toggleDone}>
      {todo.isDone ? "Undo" : "Finish"}
    </button>
  );
}
