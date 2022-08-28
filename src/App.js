import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path = '/' element={<Homepage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
