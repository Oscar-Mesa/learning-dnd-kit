import { useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';

export default function App() {
  const [droppedInside, setDroppedInside] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    // el elemento se soltó sobre "dropzone"
    if (event.over?.id === 'dropzone') {
      // se establece el estado de droppedInside en true
      setDroppedInside(true);
    } else {
      setDroppedInside(false);
    }
  }

  return (
    // DndContext es el contexto de arrastre y soltado identifica el arrastable y la zona de destino
    // el evento onDragEnd se activa cuando se suelta el elemento arrastrado
    // el evento onDragEnd recibe un objeto con la información del arrastre
    // el objeto tiene una propiedad "over" que contiene información sobre la zona de destino
    <DndContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: 'center' }}>Mover Draggable entre zonas</h2>
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
        <div>
          <h4>Zona inicial</h4>
          {/* solo muestra el Draggable si no se ha soltado en la zona de destino (droppedInside = false) */}
          {!droppedInside && <Draggable />}
        </div>
      {/*se envia un booleado que indica si hay un objeto en la zona */}
      {/* la lógica de si es true o false se maneja en el Droppable */}
        <Droppable id="dropzone" isOccupied={droppedInside}>
          <h4>Zona de destino</h4>
          {/* si se ha soltado en la zona de destino (droppedInside = true) */}
          {/* se muestra el Draggable dentro de la zona de destino */}
          {/* si no se ha soltado en la zona de destino, se muestra el texto "Suelta aquí" */}
          {droppedInside ? <Draggable /> : 'Suelta aquí'}
        </Droppable>
      </div>
    </DndContext>
  );
}
