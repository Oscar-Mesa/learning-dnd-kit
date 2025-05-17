import { useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import DroppableColumn from "./DroppableColumn";
import type { Task, Columns, ColumnKey } from "./types"; 

const initialTasks: Task[] = [
  { id: "1", content: "Tarea 1" },
  { id: "2", content: "Tarea 2" },
  { id: "3", content: "Tarea 3" },
];

export default function App() {
  const [columns, setColumns] = useState<Columns>({
    pendientes: initialTasks,
    hechas: [],
  });
  // Esta función es el manejador del evento onDragEnd de dnd-kit, 
  // y se ejecuta cuando el usuario suelta un ítem después de arrastrarlo.
  function handleDragEnd(event: DragEndEvent) { // DragEndEvent es el tipo del evento que dnd-kit proporciona cuando termina el arrastre.
  //Contiene información clave como: 
  // active: el ítem que estaba siendo arrastrado.
  // over: el ítem (o área) sobre el que se soltó el elemento.
  const { active, over } = event;

  // !over Si no hay nada debajo cuando se suelta 
  // (por ejemplo, si el ítem se soltó fuera de cualquier zona droppable),
  // Entonces no se debe hacer nada.
  if (!over || active.id === over.id) return; // active.id === over.id
  // Esto significa que soltaste el ítem sobre sí mismo 
  // (por ejemplo, no cambiaste de lugar realmente). Tampoco hace falta mover nada.

  //Object.keys(columns) Esto devuelve un arreglo con las claves del objeto columns ["pendientes", "hechas"]
  const sourceColumn = Object.keys(columns).find((col) => // .find((col) => ...) Esta función va a recorrer cada columna, 
  // y va a devolver la primera que cumpla la condición dentro del =>.
    columns[col as ColumnKey].some((item) => item.id === active.id)
  ) as ColumnKey; // Aquí estás revisando si dentro de esa columna, existe una tarea que 
  // tenga el id del ítem que fue arrastrado (active.id).



  // Determinar si soltaste sobre una columna o sobre una tarjeta
  //Declara una variable para guardar el nombre de la columna destino.
  let destinationColumn: ColumnKey | null = null; //Se inicializa como null.

  // ¿over.id coincide con alguna columna?
  if (columns[over.id as ColumnKey]) {
    // es una columna vacía (over.id es 'hechas' o 'pendientes')
    destinationColumn = over.id as ColumnKey; // Se asigna el ID directamente como columna destino.
  } else {
    // se soltó sobre una tarjeta
    destinationColumn = Object.keys(columns).
    find((col) => // .find((col) => ...) // Busca en cuál de esas columnas se encuentra 
    // la tarjeta cuyo ID es over.id (la tarjeta sobre la que se soltó otra).
      columns[col as ColumnKey].some((item) => item.id === over.id) // Para cada columna, revisa si alguna 
      // de sus tareas tiene el mismo id que over.id.
    ) as ColumnKey;
  }

  // Si alguno de los dos es null o undefined, no se hace nada.
  if (!sourceColumn || !destinationColumn) return;

  // Dame la lista de tareas en la columna 'X',
  // pero hazme una copia independiente para que pueda modificarla sin afectar directamente el tablero original
  const sourceItems = [...columns[sourceColumn]]; // columns[sourceColumn]	Accede a las tareas de la columna origen
  // [...columns[sourceColumn]]	Hace una copia de esas tareas, sourceItems	Es esa copia de la columna origen
  const destinationItems = [...columns[destinationColumn]]; // Los ... copian todos los elementos de un arreglo dentro de otro. 

  // Busca en el array sourceItems la posición (índice) del ítem cuyo id coincide 
  // con el id del ítem que fue arrastrado (active.id).
  const draggedItemIndex = sourceItems.findIndex((item) => item.id === active.id);
  // guardamos el objeto en draggedItem
  const draggedItem = sourceItems[draggedItemIndex];

  if (sourceColumn === destinationColumn) { // Si la columna de origen y la de destino son las mismas
    // reordenar dentro de la misma columna
    // destinationItems es la lista de tareas de la columna donde estás soltando la tarjeta.
    const overIndex = destinationItems.findIndex((item) => item.id === over.id); //over.id es el id de la tarjeta sobre 
    // la que soltaste la tarjeta arrastrada. findIndex(...) busca en destinationItems la posición donde el id 
    // coincide con over.id.
    setColumns((prev) => ({ // prev es el estado anterior de las columnas
      ...prev, // Esto copia todas las columnas anteriores (para no perder ninguna).  
      [sourceColumn]: arrayMove(sourceItems, draggedItemIndex, overIndex),
    })); // sourceItems El arreglo que quieres modificar (una copia), draggedItemIndex 	La posición original 
    // del ítem que estás moviendo, overIndex La posición nueva a la que lo quieres mover
  } else {
    // mover entre columnas
    // sourceItems es una copia de la columna de donde salió la tarjeta.
    sourceItems.splice(draggedItemIndex, 1); // .splice(índice, 1) elimina 1 elemento en esa posición.


    // Si `over.id` es una columna (como "pendientes" o "hechas"), quiere decir que se soltó en una columna vacía.
    // Entonces la tarea se inserta al inicio (posición 0)

    // Si `over.id` es una tarjeta (como "2", "3", etc.), encontramos su índice en el arreglo destino,
    // para insertar la nueva justo antes de esa.
    const overIndex = over.id in columns
      ? 0 // si se soltó sobre una columna vacía
      : destinationItems.findIndex((item) => item.id === over.id);


    // Usamos `.splice(pos, 0, elemento)` para insertar SIN eliminar nada.
    // Esto mete la tarjeta (`draggedItem`) en la posición `overIndex` dentro de la nueva columna.
    destinationItems.splice(overIndex, 0, draggedItem);


    // Esta es la parte de React donde le decimos: "Hey, redibuja las listas con estos nuevos valores".
    // - `...prev` copia todas las columnas anteriores (para no perder otras columnas).
    // - `[sourceColumn]`: reemplaza la columna origen con el arreglo `sourceItems` (ya sin la tarjeta).
    // - `[destinationColumn]`: reemplaza la columna destino con el arreglo `destinationItems` (ya con la tarjeta añadida).
    setColumns((prev) => ({
      ...prev,
      [sourceColumn]: sourceItems,
      [destinationColumn]: destinationItems,
    }));
  }
}


  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <h2 style={{ textAlign: "center" }}>Kanban con reordenamiento</h2>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        {Object.entries(columns).map(([columnId, items]) => (
          <SortableContext
            key={columnId}
            items={items.map((task) => task.id)} // Necesita los ids
            strategy={verticalListSortingStrategy}
          >
            <DroppableColumn
              id={columnId as ColumnKey}
              title={columnId}
              items={items}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
