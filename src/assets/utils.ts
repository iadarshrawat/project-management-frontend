export const API_BASE = "https://project-management-backend-grzu.onrender.com/api";

export const STATUS_COLUMNS = ["TO_DO", "IN_PROGRESS", "DONE"] as const;
export type Status = typeof STATUS_COLUMNS[number];

export const STATUS_LABELS: Record<Status, string> = {
  TO_DO: "To‑Do",
  IN_PROGRESS: "Doing",
  DONE: "🎉 Done",
};

export interface Task {
  _boardId(_boardId: any, local: Task): unknown;
  _id: string;
  title: string;
  description: string;
  status: Status;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
}

export interface Board { _id: string; title: string; }

/* super‑thin fetch wrappers, no headers */
export const api = {
  boards: (): Promise<Board[]> =>
    fetch(`${API_BASE}/boards`).then(r => r.json()).then(r => r.boards),

  tasks:  (bid: string): Promise<Task[]> =>
    fetch(`${API_BASE}/boards/${bid}/tasks`).then(r => r.json()).then(r => r.tasks),

  createTask : (bid: string, body: Partial<Task>): Promise<Task> =>
    fetch(`${API_BASE}/boards/${bid}/tasks`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body   : JSON.stringify(body),
    }).then(r => r.json()),

   updateTask: (boardId: string, t: Task): Promise<Task> =>
    fetch(`${API_BASE}/tasks/${boardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, _taskId: t._id }),
    }).then(r => r.json()),

  deleteTask: (taskId: string): Promise<void> =>
    fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" }).then(() => undefined),

  createBoard: (body: { title: string; type?: string }): Promise<Board> =>
    fetch(`${API_BASE}/boards`, {
      method: 'POST',
      body: JSON.stringify(
        body.type ? body : { ...body, type: 'FRONTEND' },
      ),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()),
};
