import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  content: string;
}

export default function DraggableItem({ id, content }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform), // posición visual
    transition, // suaviza ese movimiento automáticamente
    padding: "1rem",
    background: "brown",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "0.5rem",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}
