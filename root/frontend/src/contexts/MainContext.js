import { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Home") 
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
    
  return (
    <MainContext.Provider value={{
      activeTab, 
      baseBackEndUrl,
      isAdmin,
      userList,
      fetchUserList,
      setActiveTab,
      setIsAdmin

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext