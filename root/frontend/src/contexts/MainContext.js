import { createContext, useState } from 'react'

export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [active, setActive] = useState("Home") 
  const [isAdmin, setIsAdmin] = useState(null)
  const baseBackEndUrl = `http://localhost:8008`
    
  return (
    <MainContext.Provider value={{
      active, 
      isAdmin,
      baseBackEndUrl,
      setActive,
      setIsAdmin

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext