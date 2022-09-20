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
import AdminRoute from "./components/private/AdminRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMainContext } from "./hooks/useMainContext";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import CreateNewLeave from "./pages/CreateNewLeave";
import ApproveLeavePage from "./pages/ApproveLeavePage";
import SkeletonLoader from "./components/layout/SkeletonLoader";
import LoggedInRoute from "./components/private/LoggedInRoute";

function App() {
  const {authState, currentUser} = useMainContext()
  
  return (
    <>
      {!authState && <SkeletonLoader/>}
      {authState && (
        <Router>
          <Navbar/>
          <Routes>
            <Route path = '/apply-leave' element={<ApplyLeavePage/>}/>
            {!currentUser && <Route path = '/login' element={<LoginPage/>}/>}
            <Route path = '/change-password' element={<ChangePasswordPage/>}/>
            <Route path = '/set-new-password/:token' element={<SetNewPasswordPage/>}/>
            {/* <Route path = '/*' element={<PageNotFound/>}/> */}
            {currentUser && <Route path = '/' element={<Homepage/>}/>}
            {currentUser && <Route path = '/profile' element={<ProfilePage/>}/>}

            {/* admin routes */}
            <Route path = '/create-user' element={<AdminRoute/>}>
              <Route path = '/create-user' element={<CreateUserPage/>}/>
            </Route>
            <Route path = '/change-log' element={<AdminRoute/>}>
              <Route path = '/change-log' element={<ChangeLogPage/>}/>
            </Route>
            <Route path = '/update-user' element={<AdminRoute/>}>
              <Route path = '/update-user' element={<UpdateUserInfoPage/>}/>
            </Route>
            <Route path = '/user-management' element={<AdminRoute/>}>
              <Route path = '/user-management' element={<UserManagementPage/>}/>
            </Route>
            <Route path = '/create-new-leave' element={<AdminRoute/>}>
              <Route path = '/create-new-leave' element={<CreateNewLeave/>}/>
            </Route>
            <Route path = '/approve-leave' element={<AdminRoute/>}>
              <Route path = '/approve-leave' element={<ApproveLeavePage/>}/>
            </Route>
          </Routes>
        </Router>
      )}
        <ToastContainer/>
    </>
  );
}

export default App;
