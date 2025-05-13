import { useDraggable } from "@dnd-kit/core";

function Draggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style: React.CSSProperties = {
    //transform es el movimiento del elemento y translate traduce 
    //el elemento a la posición deseada
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    padding: "1rem",
    background: "brown",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100px",
    textAlign: "center",
    cursor: "grab",
  };

  return (
    //setNodeRef es una referencia al nodo que se va a arrastrar
    //listeners son los eventos que se van a escuchar (eventos del mouse)
    //attributes esto mejora la accesibilidad y permite que el componente se comporte correctamente con teclado o lectores de pantalla. 
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      Arrástrame
    </div>
  );
}

export default Draggable;
