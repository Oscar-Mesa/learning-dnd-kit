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
    destinationColumn = Object.keys(columns).find((col) => // .find((col) => ...) 
    // Busca en cuál de esas columnas se encuentra la tarjeta cuyo ID es over.id 
    // (la tarjeta sobre la que se soltó otra).
      columns[col as ColumnKey].some((item) => item.id === over.id) // Para cada columna, revisa si alguna 
      // de sus tareas tiene el mismo id que over.id.
    ) as ColumnKey;
  }

  if (!sourceColumn || !destinationColumn) return;

  const sourceItems = [...columns[sourceColumn]];
  const destinationItems = [...columns[destinationColumn]];

  const draggedItemIndex = sourceItems.findIndex((item) => item.id === active.id);
  const draggedItem = sourceItems[draggedItemIndex];

  if (sourceColumn === destinationColumn) {
    // reordenar dentro de la misma columna
    const overIndex = destinationItems.findIndex((item) => item.id === over.id);
    setColumns((prev) => ({
      ...prev,
      [sourceColumn]: arrayMove(sourceItems, draggedItemIndex, overIndex),
    }));
  } else {
    // mover entre columnas
    sourceItems.splice(draggedItemIndex, 1);

    const overIndex = over.id in columns
      ? 0 // si se soltó sobre una columna vacía
      : destinationItems.findIndex((item) => item.id === over.id);

    destinationItems.splice(overIndex, 0, draggedItem);

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
