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

  const fetchUserList = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getAllUsers`)
      .then(resp =>{ 
        setUserList(resp.data)
        console.log(resp)}
      )
      .catch(err => console.log(err))
  }

  const fetchCurrentUserInfo = async (currentUser) =>{
      console.log("fetchCurrentUserInfo triggered")
      axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getUser/${currentUser._id}`)
      .then(resp => {
          console.log(resp.data)
          setCurrentUser(resp.data)
      })
  }

  useEffect(()=>{
    fetchUserList()
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
      userList,
      fetchCurrentUserInfo,
      fetchUserList,
      setActiveTab,
      setCurrentEditUser,
      setCurrentLeaveSelection,
      setCurrentUser,
      setIsAdmin,
      validateEmail

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext