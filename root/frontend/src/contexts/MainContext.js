import { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Home") 
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState([])
  const [isAdmin, setIsAdmin] = useState()

  const [currentLeaveSelection, setCurrentLeaveSelection] = useState("Annual Leave 年假")
  const [currentEditUser, setCurrentEditUser] = useState()

  const [sessionToken, setSessionToken] = useState(() => {
    let token =  sessionStorage.getItem('leaveMgtToken')
    if(token) return token
    else return ""
  })

  const fetchUserList = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getAllUsers`)
      .then(resp =>{ 
        setUserList(resp.data)
        // console.log(resp)
      })
      .catch(err => console.log(err))
  }

  const fetchCurrentUserInfo = async (currentUser) =>{
      console.log("fetchCurrentUserInfo triggered")
      axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getUser/${currentUser._id}`)
      .then(resp => {
          // console.log(resp.data)
          setCurrentUser(resp.data)
      })
  }

  const validateSession = () => {
    const url = `${process.env.REACT_APP_BACKENDURL}/validate-session`
    axios
    .post(url, {sessionId: sessionToken})
    .then((user) => {
        // set user as current user
        setCurrentUser(user.data)
    })
    .catch(err => console.log(err))
}

  useEffect(()=>{
    fetchUserList()
    validateSession()
    console.log("use effect triggered")
  }, [])

  const validateEmail = (email) => {
    let regex = /\S+@\S+\.\S+/;
    return regex.test(email); // returns true if email is valid
  }

  return (
    <MainContext.Provider value={{
      activeTab, 
      currentEditUser,
      currentLeaveSelection,
      currentUser,
      isAdmin,
      sessionToken,
      userList,
      fetchCurrentUserInfo,
      fetchUserList,
      setActiveTab,
      setCurrentEditUser,
      setCurrentLeaveSelection,
      setCurrentUser,
      setIsAdmin,
      setSessionToken,
      validateEmail

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext