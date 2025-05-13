import { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import DroppableColumn from "./DroppableColumn";

// Tipos personalizados
// ColumnKey restringe las columnas a sólo 'pendientes' y 'hechas'
type ColumnKey = 'pendientes' | 'hechas';

// Interfaz para las tareas individuales
interface Task {
  id: string;
  content: string;
}

// Tipo para el estado de las columnas
// Define que cada clave (pendientes o hechas) contiene un array de tareas
type Columns = {
  [key in ColumnKey]: Task[];
};

const initialTasks: Task[] = [
  { id: "1", content: "Tarea 1" },
  { id: "2", content: "Tarea 2" },
];

export default function App() {
  const [columns, setColumns] = useState<Columns>({
    pendientes: initialTasks,
    hechas: [],
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Si no hay un elemento activo o no hay un destino, no hacemos nada    
    if (!over) return;

    // Object.keys(columns) Obtiene un array con los nombres de las columnas. [pendientes, hechas]
    const sourceColumn = (Object.keys(columns) as ColumnKey[]).find((col) => // .find((col) =>  Busca la primera columna donde se encuentre el ítem 
    // que estamos arrastrando. O sea, va a devolver "pendientes" o "hechas".
      columns[col].some((item) => item.id === active.id) //Verifica si dentro de la columna actual hay algún ítem 
      // cuyo id coincida con el id del ítem que se está arrastrando (active.id).
    );

    // over.id es el id de la columna donde se está soltando el ítem.
    const destinationColumn = over.id as ColumnKey;

    if (
      sourceColumn &&
      destinationColumn && // Verifica que sourceColumn y destinationColumn no sean undefined.
      sourceColumn !== destinationColumn // Que no estés soltando la tarea en la misma columna 
      // (no tiene sentido mover dentro de la misma en este ejemplo)
    ) {
      // columns[sourceColumn] Obtiene el array de tareas de esa columna. 
      // Ejemplo: columns["pendientes"] → [ { id: '1', content: 'Tarea 1' }, { id: '2', content: 'Tarea 2' } ]
      const movedItem = columns[sourceColumn].find(
        (item) => item.id === active.id // .find((item) => item.id === active.id)
        // Busca el primer ítem de la columna cuyo id coincida con el del ítem que se está arrastrando (active.id).
      )!;

      setColumns((prev) => ({ // prev es el estado anterior de las columnas
        ...prev, // Copia todas las columnas existentes sin modificarlas.
        [sourceColumn]: prev[sourceColumn].filter(  // Elimina el ítem arrastrado de su columna original.
          (item) => item.id !== active.id // Usa .filter() para conservar todos los ítems excepto 
          // el que tiene el mismo id que active.id.
        ),
        // Añade el ítem movido (movedItem) al final del array de tareas en la columna destino.
        [destinationColumn]: [...prev[destinationColumn], movedItem],
      }));
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* DndContext es el proveedor de contexto que habilita la funcionalidad de drag and drop */}
      <h2 style={{ textAlign: "center" }}>Kanban básico</h2>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <DroppableColumn // DroppableColumn es tu componente personalizado de columna que acepta elementos soltados.
          id="pendientes"  // id="pendientes" es el id de la columna donde se van a soltar los ítems.
          title="Pendientes" // title="Pendientes" es el título de la columna.
          items={columns.pendientes} // items={columns.pendientes}: Las tareas que tiene esa columna.
        />
        <DroppableColumn 
        id="hechas" 
        title="Hechas" 
        items={columns.hechas} />
      </div>
    </DndContext>
  );
}
