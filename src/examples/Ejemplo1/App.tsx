import  { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';

function App() {

  //dropped es una vairable de estado que indica si el objeto fue soltado en la zona de destino
  //setDropped es la función que se utiliza para actualizar el estado de dropped
  //useState pertenece a la librería de React y se utiliza para manejar el estado en componentes funcionales
  //useState recibe un valor inicial (en este caso, false) y devuelve un array con dos elementos:
  //1. El valor actual del estado (dropped)
  //2. Una función para actualizar ese estado (setDropped)
  //En este caso, dropped se inicializa como false, lo que significa que al principio no se ha soltado nada en la zona de destino.
  const [dropped, setDropped] = useState(false);

  //handleDragEnd es una función que se ejecuta cuando se termina de arrastrar un elemento

  function handleDragEnd(event: DragEndEvent) {
    //over es el objeto que representa la zona de destino donde se soltó el elemento arrastrado
    //active es el objeto que representa el elemento arrastrado
    //DragEndEvent obtiene estos valores de Draggable y Droppable
    const { over, active } = event; // obtengo qué se soltó y dónde
    

    if (over && over.id === 'dropzone') {
      console.log(`${active.id} se soltó sobre ${over.id}`);
      setDropped(true); // Actualiza el estado para mostrar que se soltó correctamente
    } else {
      console.log(`${active.id} no se soltó en la zona correcta`);
      setDropped(false);
    }
  }

  return (
    //DndContext es el contexto de DnD Kit que envuelve los componentes que participan en la funcionalidad de arrastrar y soltar
    //onDragEnd es una propiedad que se utiliza para manejar el evento de finalización del arrastre
    //handleDragEnd es la función que se ejecuta cuando se termina de arrastrar un elemento
    //DndContext detecta automaticamente los elementos que son arrastrables y los que son zonas de destino 
    //gracias a los hooks useDraggable y useDroppable
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ padding: '2rem' }}>
        <h2>Ejemplo básico de DnD Kit</h2>
        <p>Revisar la consola para ver los eventos de arrastre</p>
  
        <Draggable />

        <Droppable id="dropzone">
          {dropped ? '¡Objeto soltado aquí!' : 'Suelta aquí'}
        </Droppable>
        
        {dropped ? <p>Es un ejemplo básico, recargar la página para volver a intentar</p> : <p>Arrastra el botón y suéltalo en la zona de destino</p>}
      </div>
    </DndContext>
  );
}

export default App;


