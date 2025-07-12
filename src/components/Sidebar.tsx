import React from 'react';
import { X, Folder, Plus } from 'lucide-react';
import type { Board } from '../assets/utils';
import '../App.css';


interface Props {
  boards: Board[];
  selected: Board | null;         
  onSelect(b: Board): void;        
  isOpen: boolean;
  onClose(): void;
  onNew?(): void;                 
}

const Sidebar: React.FC<Props> = ({
  boards,
  selected,
  onSelect,
  isOpen,
  onClose,
  onNew,
}) => (
  <>
    {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* header */}
      <div className="sidebar-header">
        <h2>Boards</h2>

        {/* new‑board + close buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {onNew && (
            <button
              className="sidebar-new"
              title="New board"
              onClick={onNew}
            >
              <Plus size={18} />
            </button>
          )}
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* board list */}
      <div className="sidebar-content">
        {boards.length === 0 ? (
          <div className="no-boards">No boards available</div>
        ) : (
          <div className="board-list">
            {boards.map(b => (
              <button
                key={b._id}
                className={`board-item ${
                  selected?._id === b._id ? 'active' : ''
                }`}
                onClick={() => {
                  onSelect(b);
                  onClose();             
                }}
              >
                <Folder size={18} />
                <span>{b.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);

export default Sidebar;
