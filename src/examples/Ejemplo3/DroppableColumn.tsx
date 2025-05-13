import { useDroppable } from "@dnd-kit/core"; // Importa el hook que hace que un elemento pueda recibir elementos arrastrados
import DraggableItem from "./DraggableItem"; // Componente que representa cada tarea arrastrable

// Definición del tipo de props que recibe la columna
interface DroppableColumnProps {
  id: string; // ID único para identificar la columna
  title: string; // Título visible de la columna (ej. "Pendientes", "Hechas")
  items: { id: string; content: string }[]; // Lista de tareas en esta columna
}

// Componente principal
export default function DroppableColumn({ id, title, items }: DroppableColumnProps) {
  // useDroppable habilita esta columna para recibir ítems arrastrados
  const { setNodeRef, isOver } = useDroppable({ id });

  // Estilos visuales de la columna, que cambian si un ítem está encima
  const style: React.CSSProperties = {
    backgroundColor: isOver ? "green" : "black", // Fondo cambia si hay un ítem encima
    padding: "1rem",
    minWidth: "200px",
    minHeight: "300px",
    border: "2px dashed #ccc",
    borderRadius: "8px",
  };

  return (
    // El div usa ref para que DnD Kit lo identifique como zona de soltado
    <div ref={setNodeRef} style={style}>
      <h3>{title}</h3>
      
      {/* Recorre y renderiza cada ítem como un DraggableItem */}
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id} content={item.content} />
      ))}
    </div>
  );
}
