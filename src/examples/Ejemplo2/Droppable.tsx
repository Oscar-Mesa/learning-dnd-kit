import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  //App va a pasar este componente para saber si tiene algo dentro
  isOccupied?: boolean;
}

export default function Droppable({ id, children, isOccupied }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style: React.CSSProperties = {
  backgroundColor: isOver
    ? 'green'                      // cuando está encima
    : isOccupied
    ? 'lightblue'                   // cuando ya se soltó dentro (true)
    : 'black',                    // fondo normal
  padding: '2rem',
  minHeight: '100px',
  border: '2px dashed #ccc',
  borderRadius: '8px',
  textAlign: 'center',
};


  return (
    <div ref={setNodeRef} style={style}>
        {/* children es el contenido que se va a mostrar dentro del droppable */}
        {/* este contenido se pasa desde App */}
      {children}
    </div>
  );
}
