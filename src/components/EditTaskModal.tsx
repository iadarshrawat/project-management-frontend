import React, { useState } from "react";
import Modal from "./Modal";
import {
  STATUS_COLUMNS,
  STATUS_LABELS,
  type Task,
  api,
} from "../assets/utils";

import "../App.css";

interface Props {
  boardId: string;
  task: Task;
  onSave(t: Task): void;
  onClose(): void;
}

const EditTaskModal: React.FC<Props> = ({ boardId, task, onSave, onClose }) => {
  /* make a local, editable copy of the task */
  const [local, setLocal] = useState<Task>(task);
  const set =
    (k: keyof Task) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setLocal({ ...local, [k]: e.target.value as any });

  const [saving, setSaving] = useState(false);

  return (
    <Modal title="Edit task" onClose={onClose}>
      <form
        className="modal-body"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const updated = await api.updateTask(boardId, local);
            onSave(updated);
            onClose();
          } finally {
            setSaving(false);
          }
        }}
      >
        {/* --- fields --- */}
        <label>Title *</label>
        <input value={local.title} onChange={set("title")} required />

        <label>Description</label>
        <textarea value={local.description} onChange={set("description")} />

        <label>Status</label>
        <select
          value={local.status}
          onChange={set("status")}
        >
          {STATUS_COLUMNS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <label>Priority</label>
        <select value={local.priority} onChange={set("priority")}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <label>Due date</label>
        <input
          type="date"
          value={local.dueDate.slice(0, 10)}
          onChange={set("dueDate")}
        />

        {/* --- actions --- */}
        <div className="modal-footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Updating…" : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
