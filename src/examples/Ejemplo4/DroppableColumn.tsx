import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import type { Task, ColumnKey } from "./types";

interface Props {
  id: ColumnKey;
  title: string;
  items: Task[];
}

export default function DroppableColumn({ id, title, items }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "green" : "black",
        padding: "1rem",
        minWidth: "200px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
      }}
    >
      <h4>{title}</h4>
       {/* recorrer el array de tareas y renderizar cada una
       con el componente DraggableItem
       y pasarle las props id y content */}
      {items.map((task) => (
        <DraggableItem key={task.id} id={task.id} content={task.content} />
      ))}
    </div>
  );
}
