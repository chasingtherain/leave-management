import { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [active, setActive] = useState("Home") 
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
      active, 
      baseBackEndUrl,
      isAdmin,
      userList,
      fetchUserList,
      setActive,
      setIsAdmin

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext