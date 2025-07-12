import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash2 } from "lucide-react";
import type { Task } from "../assets/utils";
import { format } from "date-fns";
import '../App.css';

export const TaskCard: React.FC<{
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, onEdit, onDelete }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'manipulation', 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <div className="task-actions">
        <button className="task-action-btn edit-btn" onClick={() => onEdit(task)} title="Edit">
          <Edit size={16} />
        </button>
        <button
          className="task-action-btn delete-btn"
          onClick={() => onDelete(task._id)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="task-title">{task.title}</p>
      <p className="task-desc">{task.description}</p>
      <div className="task-footer">
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
        <span className="task-date">{format(new Date(task.dueDate), 'dd MMM yyyy')}</span>
      </div>
    </div>
  );
};

export default TaskCard;
