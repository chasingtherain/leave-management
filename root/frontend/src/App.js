import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
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
import CreateNewLeave from "./pages/CreateNewLeave";
import ApproveLeavePage from "./pages/ApproveLeavePage";

function App() {
  const {currentUser} = useMainContext()
  return (
    <>
        <Router>
          <Navbar/>
          <Routes>
            {currentUser && <Route exact path = '/' element={<Homepage/>}/>}
            {<Route exact path = '/' element={<LoginPage/>}/>} {/* if user is not logged in, '/' will display login page */}
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
            <Route path = '/create-new-leave' element={<PrivateRoute/>}>
              <Route path = '/create-new-leave' element={<CreateNewLeave/>}/>
            </Route>
            <Route path = '/approve-leave' element={<PrivateRoute/>}>
              <Route path = '/approve-leave' element={<ApproveLeavePage/>}/>
            </Route>

          </Routes>
        </Router>
        <ToastContainer/>
    </>
  );
}

export default App;
