
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import './App.css'
import {BoardPage} from './components/BoardPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/board" element={<BoardPage/>} />
      </Routes>
    </Router>
  );
} 

export default App
