import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { format } from "date-fns";
import { ChevronDown, Plus } from "lucide-react";

import {
  api,
  STATUS_COLUMNS,
  STATUS_LABELS,
  type Task,
  type Status,
  type Board,
} from "../assets/utils";

import Sidebar from "./Sidebar";
import Column from "./Column";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import Modal from "./Modal";

import "../App.css";

/* ---------------------- Board types for dropdown --------------- */
const BOARD_TYPES = ["FRONTEND", "MARKETING"] as const;
type BoardType = (typeof BOARD_TYPES)[number];

/* ---------------------- Create‑Board Modal --------------------- */
const CreateBoardModal: React.FC<{
  onAdd: (b: Board) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [form, setForm] = useState<{
    title: string;
    type: BoardType;
  }>({
    title: "",
    type: "FRONTEND",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value as any }));

  const [saving, setSaving] = useState(false);

  return (
    <Modal title="New board" onClose={onClose}>
      <form
        className="modal-body"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const board = await api.createBoard({
              title: form.title,
              type: form.type,
            });
            onAdd(board);
            onClose();
          } finally {
            setSaving(false);
          }
        }}
      >
        <label>Title *</label>
        <input value={form.title} onChange={set("title")} required />

        <label>Type</label>
        <select value={form.type} onChange={set("type")}>
          {BOARD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="modal-footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ---------------------- BoardPage Component -------------------- */
export function BoardPage() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const [boards, setBoards] = useState<Board[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingTaskStatus, setCreatingTaskStatus] = useState<Status | null>(
    null
  );
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const fetchedBoards = await api.boards();
      setBoards(fetchedBoards);
      if (fetchedBoards.length) {
        const first = fetchedBoards[0];
        setBoard(first);
        setTasks(await api.tasks(first._id));
      }
    })();
  }, []);

  useEffect(() => {
    if (board) api.tasks(board._id).then(setTasks);
  }, [board]);

  const buckets = useMemo(
    () =>
      STATUS_COLUMNS.reduce<Record<Status, Task[]>>(
        (acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s) }),
        { TO_DO: [], IN_PROGRESS: [], DONE: [] }
      ),
    [tasks]
  );

 const onDragEnd = async ({ active, over }: DragEndEvent) => {
  if (!over || !board) return;

  const dragged = tasks.find(t => t._id === active.id);
  if (!dragged) return;

  let newStatus: Status = dragged.status;
  if (STATUS_COLUMNS.includes(over.id as Status)) {
    newStatus = over.id as Status;           // dropped on empty column
  } else {
    const overTask = tasks.find(t => t._id === over.id);
    if (overTask) newStatus = overTask.status;
  }
  if (newStatus === dragged.status) return;

  const updated = { ...dragged, status: newStatus };
  setTasks(prev => prev.map(t => (t._id === updated._id ? updated : t))); // optimistic

  try {
    await api.updateTask(board._id, updated);               // ✅ boardId in path
  } catch (err) {
    console.error('Failed to update', err);
    setTasks(prev => prev.map(t => (t._id === dragged._id ? dragged : t))); // rollback
  }
};


  const handleDeleteTask = async (id: string) => {
    const toRestore = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      console.error("Delete failed", err);
      if (toRestore) setTasks((prev) => [...prev, toRestore]);
    }
  };

  return (
    <>
      <div className="app">
        <Sidebar
          boards={boards}
          selected={board}
          onSelect={(b) => {
            setBoard(b);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNew={() => {
            setSidebarOpen(false);
            setCreatingBoard(true);
          }}
        />

        <header className="top-bar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span style={{ marginLeft: 8 }}>{board?.title || "Boards"}</span>
          <button
            className="add-board-btn"
            style={{ marginLeft: "auto" }}
            onClick={() => setCreatingBoard(true)}
            aria-label="Add board"
          >
            ＋
          </button>
        </header>

        <main className="main-board">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <div className="board-columns">
              {STATUS_COLUMNS.map((s) => (
                <Column
                  key={s}
                  status={s}
                  tasks={buckets[s]}
                  onAdd={() => setCreatingTaskStatus(s)}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </DndContext>
        </main>
      </div>

      {creatingTaskStatus && board && (
        <CreateTaskModal
          boardId={board._id}
          status={creatingTaskStatus}
          onAdd={(t) => setTasks((prev) => [...prev, t])}
          onClose={() => setCreatingTaskStatus(null)}
        />
      )}

      {editingTask && board && (
        <EditTaskModal
          boardId={board._id}
          task={editingTask}
          onSave={(t) => setTasks((prev) => prev.map((x) => (x._id === t._id ? t : x)))}
          onClose={() => setEditingTask(null)}  
          />
      )}

      {creatingBoard && (
        <CreateBoardModal
          onAdd={(b) => {
            setBoards((prev) => [...prev, b]);
            setBoard(b);
          }}
          onClose={() => setCreatingBoard(false)}
        />
      )}
    </>
  );
}
