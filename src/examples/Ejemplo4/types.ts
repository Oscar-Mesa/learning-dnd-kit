// los elementos disponibles de ColumnKey son para las columnas
// "pendientes" y "hechas", que son las que se usan en el componente DroppableColumn
export type ColumnKey = 'pendientes' | 'hechas';

// Task es la estructura de una tarea
export interface Task {
  id: string;
  content: string;
}

// Cada clave (key) es uno de los valores del tipo ColumnKey ("pendientes" o "hechas")
export type Columns = {
  [key in ColumnKey]: Task[]; // Y su valor es un arreglo de Task
};
