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
import NotFoundPage from "./pages/NotFoundPage";
import SetWorkdayPage from "./pages/SetWorkdayPage";
import DashboardPage from "./pages/DashboardPage";
import TeamCalendarPage from "./pages/TeamCalendarPage";
import LoginRoute from "./components/private/LoginRoute";

function App() {
  const {authState} = useMainContext()
  
  return (
    <>
      {!authState && <SkeletonLoader/>}
      {authState && (
        <Router>
          <Navbar/>
          <Routes>
            <Route path = '/change-password' element={<ChangePasswordPage/>}/>
            <Route path = '/set-new-password/:token' element={<SetNewPasswordPage/>}/>
            <Route path = '/*' element={<NotFoundPage/>}/>

            {/* logged in routes */}
            <Route path = '/login' element={<LoginRoute/>}>
              <Route path = '/login' element={<LoginPage/>}/>
            </Route>

            <Route path = '/' element={<LoggedInRoute/>}>
              <Route path = '/' element={<Homepage/>}/>
            </Route>

            <Route path = '/apply-leave' element={<LoggedInRoute/>}>
              <Route path = '/apply-leave' element={<ApplyLeavePage/>}/>
            </Route>
            <Route path = '/profile' element={<LoggedInRoute/>}>
              <Route path = '/profile' element={<ProfilePage/>}/>
            </Route>
            <Route path = '/team' element={<LoggedInRoute/>}>
              <Route path = '/team' element={<TeamCalendarPage/>}/>
            </Route>

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
            <Route path = '/set-work-day' element={<AdminRoute/>}>
              <Route path = '/set-work-day' element={<SetWorkdayPage/>}/>
            </Route>
            <Route path = '/dashboard' element={<AdminRoute/>}>
              <Route path = '/dashboard' element={<DashboardPage/>}/>
            </Route>
          </Routes>
        </Router>
      )}
        <ToastContainer/>
    </>
  );
}

export default App;
