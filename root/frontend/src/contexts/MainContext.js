import { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Home") 
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState([])
  const [isAdmin, setIsAdmin] = useState()

  const [currentLeaveSelection, setCurrentLeaveSelection] = useState("Annual Leave 年假")
  console.log("process.env: ", process.env)
  console.log(process.env.FRONTENDURL)
  const fetchUserList = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getAllUsers`)
      .then(resp =>{ 
        setUserList(resp.data)
        console.log(resp)}
      )
      .catch(err => console.log(err))
  }

  useEffect(()=>{
    fetchUserList()
  }, [])

  const validateEmail = (email) => {
    let regex = /\S+@\S+\.\S+/;
    return regex.test(email); // returns true if email is valid
  }

  return (
    <MainContext.Provider value={{
      activeTab, 
      currentLeaveSelection,
      currentUser,
      isAdmin,
      userList,
      fetchUserList,
      setActiveTab,
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