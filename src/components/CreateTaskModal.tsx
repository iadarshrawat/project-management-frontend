import React, { useState } from "react";
import Modal from "./Modal";
import { STATUS_COLUMNS, STATUS_LABELS, type Status, type Task, api } from "../assets/utils";

import '../App.css'

const CreateTaskModal:React.FC<{ boardId:string; status:Status; onAdd(t:Task):void; onClose():void; }>=({boardId,status,onAdd,onClose})=>{
  const [form,setForm] = useState({ title:"",description:"",status,priority:"MEDIUM" as const,dueDate:new Date().toISOString().slice(0,10) });
  const set=(k:keyof typeof form)=>(e:any)=>setForm({...form,[k]:e.target.value});
  const [saving,setSaving]=useState(false);
  return (
    <Modal title="New task" onClose={onClose}>
      <form className="modal-body" onSubmit={async e=>{e.preventDefault();setSaving(true);try{onAdd(await api.createTask(boardId,form));onClose();}finally{setSaving(false);}}}>
        <label>Title *</label><input value={form.title} onChange={set("title")} required/>
        <label>Description</label><textarea value={form.description} onChange={set("description")}/>
        <label>Status</label><select value={form.status} onChange={set("status")}>{STATUS_COLUMNS.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select>
        <label>Priority</label><select value={form.priority} onChange={set("priority")}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select>
        <label>Due date</label><input type="date" value={form.dueDate} onChange={set("dueDate")}/>
        <div className="modal-footer"><button type="button" onClick={onClose}>Cancel</button><button type="submit" disabled={saving||!form.title}>{saving?"Saving…":"Add"}</button></div>
      </form>
    </Modal>
  );
};
export default CreateTaskModal;
