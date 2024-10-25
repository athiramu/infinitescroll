import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InfiniteData from './components/InfiniteData';


function App() {
  return (
<>
<BrowserRouter>
      <Routes>
        <Route path="/" element={<InfiniteData />}>
         
        </Route>
      </Routes>
    </BrowserRouter>
</>
  );
}

export default App;
