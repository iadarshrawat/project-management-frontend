import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { type Task, type Status, STATUS_LABELS } from "../assets/utils";
import TaskCard from "./TaskCard";

import '../App.css'

interface Props{
  status: Status;
  tasks: Task[];
  onAdd(): void;
  onEdit(t:Task): void;
  onDelete(id:string): void;
}

const Column: React.FC<Props> = ({ status, tasks, onAdd, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="board-column">
      <h2 className="column-title">
        <span>{STATUS_LABELS[status]}</span>
      </h2>
      <button className="add-task-button" onClick={onAdd} aria-label="Add task">
        <Plus size={16} />
      </button>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        {tasks.length ? (
          tasks.map(t => <TaskCard key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} />)
        ) : (
          <div className="empty-column">No tasks</div>
        )}
      </SortableContext>
    </div>
  );
};

export default Column;
