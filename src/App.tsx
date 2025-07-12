
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {BoardPage} from './components/BoardPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardPage/>} />
      </Routes>
    </Router>
  );
} 

export default App
