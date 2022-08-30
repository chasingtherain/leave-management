import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LeaveEntitlementPage from "./pages/LeaveEntitlementPage";
import Navbar from "./components/layout/Navbar";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";
import UpdateUserInfoPage from "./pages/UpdateUserInfoPage";
import AddUserPage from "./pages/AddUserPage";

function App() {
  return (
    <>
        <Router>
          <Navbar/>
          <Routes>
            <Route exact path = '/' element={<Homepage/>}/>
            <Route path = '/entitlement' element={<LeaveEntitlementPage/>}/>
            <Route path = '/apply-leave' element={<ApplyLeavePage/>}/>
            <Route path = '/sign-in' element={<SigninPage/>}/>
            {/* private routes */}

            <Route path = '/profile' element={<ProfilePage/>}/>
            <Route path = '/update-user' element={<UpdateUserInfoPage/>}/>
            <Route path = '/add-user' element={<AddUserPage/>}/>
            <Route path = '/user-management' element={<UserManagementPage/>}/>
          </Routes>
        </Router>
    </>
  );
}

export default App;
