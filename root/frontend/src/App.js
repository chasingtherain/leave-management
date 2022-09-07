import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LeaveEntitlementPage from "./pages/LeaveEntitlementPage";
import Navbar from "./components/layout/Navbar";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";
import UpdateUserInfoPage from "./pages/UpdateUserInfoPage";
import CreateUserPage from "./pages/CreateUserPage";
import ChangeLogPage from "./pages/ChangeLogPage";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMainContext } from "./hooks/useMainContext";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";

function App() {
  const {currentUser} = useMainContext()
  return (
    <>
        <Router>
          <Navbar/>
          <Routes>
            <Route exact path = '/' element={<Homepage/>}/>
            <Route path = '/entitlement' element={<LeaveEntitlementPage/>}/>
            <Route path = '/apply-leave' element={<ApplyLeavePage/>}/>
            <Route path = '/login' element={<LoginPage/>}/>
            <Route path = '/profile' element={<ProfilePage/>}/>
            <Route path = '/change-password' element={<ChangePasswordPage/>}/>
            <Route path = '/set-new-password/:token' element={<SetNewPasswordPage/>}/>

            {/* private routes */}
            <Route path = '/create-user' element={<PrivateRoute/>}>
              <Route path = '/create-user' element={<CreateUserPage/>}/>
            </Route>
            <Route path = '/change-log' element={<PrivateRoute/>}>
              <Route path = '/change-log' element={<ChangeLogPage/>}/>
            </Route>
            <Route path = '/update-user' element={<PrivateRoute/>}>
              <Route path = '/update-user' element={<UpdateUserInfoPage/>}/>
            </Route>
            <Route path = '/user-management' element={<PrivateRoute/>}>
              <Route path = '/user-management' element={<UserManagementPage/>}/>
            </Route>
          </Routes>
        </Router>
        <ToastContainer/>
    </>
  );
}

export default App;
