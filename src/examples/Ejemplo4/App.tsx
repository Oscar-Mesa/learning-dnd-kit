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
  if (!over || active.id === over.id) return;

  const sourceColumn = Object.keys(columns).find((col) =>
    columns[col as ColumnKey].some((item) => item.id === active.id)
  ) as ColumnKey;

  // Determinar si soltaste sobre una columna o sobre una tarjeta
  let destinationColumn: ColumnKey | null = null;

  if (columns[over.id as ColumnKey]) {
    // es una columna vacía (id es 'hechas' o 'pendientes')
    destinationColumn = over.id as ColumnKey;
  } else {
    // es una tarjeta
    destinationColumn = Object.keys(columns).find((col) =>
      columns[col as ColumnKey].some((item) => item.id === over.id)
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
