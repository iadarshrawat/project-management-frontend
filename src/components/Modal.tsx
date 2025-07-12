import React from "react";
import { X } from "lucide-react";

import '../App.css'

export const Modal: React.FC<{ title:string; onClose:()=>void; children:React.ReactNode }> = ({title,onClose,children}) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close" onClick={onClose}><X size={18}/></button>
      </div>
      {children}
    </div>
  </div>
);
export default Modal;