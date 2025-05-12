import { useDraggable } from '@dnd-kit/core';

function Draggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    padding: "10px",
    backgroundColor: "brown",
    cursor: "grab",
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      Arrástrame
    </button>
  );
}
export default Draggable;