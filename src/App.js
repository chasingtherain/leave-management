import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LeaveEntitlementPage from "./pages/LeaveEntitlementPage";
import Navbar from "./components/layout/Navbar";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";
import UpdateUserInfoPage from "./pages/UpdateUserInfoPage";
import CreateUserPage from "./pages/CreateUserPage";
import ChangeLogPage from "./pages/ChangeLogPage";
import PrivateRoute from "./components/PrivateRoute";

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
            <Route path = '/profile' element={<ProfilePage/>}/>

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
    </>
  );
}

export default App;
