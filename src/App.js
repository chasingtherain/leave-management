import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LeaveEntitlementPage from "./pages/LeaveEntitlementPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path = '/' element={<Homepage/>}/>
          <Route exact path = '/entitlement' element={<LeaveEntitlementPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
