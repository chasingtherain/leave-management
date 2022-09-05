import { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Home") 
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState([])
  const [isAdmin, setIsAdmin] = useState()
  const baseBackEndUrl = `http://localhost:8008`

  const fetchUserList = async () => {
    const resp = await axios.get(`${baseBackEndUrl}/user/getAllUsers`)
    setUserList(resp.data)
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
      baseBackEndUrl,
      currentUser,
      isAdmin,
      userList,
      fetchUserList,
      setActiveTab,
      setCurrentUser,
      setIsAdmin,
      validateEmail

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext