import { useDraggable } from "@dnd-kit/core"; // Hook que convierte un elemento en arrastrable

// Props que recibe cada ítem arrastrable
interface DraggableItemProps {
  id: string;           // ID único del ítem, usado por DnD Kit para identificarlo
  content: string;      // Texto o contenido que se mostrará dentro del ítem
}

// Componente funcional
export default function DraggableItem({ id, content }: DraggableItemProps) {
  // useDraggable devuelve varias propiedades necesarias para hacer un ítem arrastrable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // transform contiene las coordenadas de movimiento (x, y)
  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)` // Si se está arrastrando, se mueve visualmente
      : undefined,
    padding: "1rem",
    marginBottom: "1rem",
    background: "brown",
    border: "1px solid #aaa",
    borderRadius: "6px",
    cursor: "grab",
    textAlign: "center",
  };

  return (
    // setNodeRef marca este div como el nodo que se puede arrastrar
    // listeners conecta los eventos de mouse/touch al sistema de drag
    // attributes mejora la accesibilidad
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {content}
    </div>
  );
}
