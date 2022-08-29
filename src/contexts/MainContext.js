import { createContext, useState } from 'react'

export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [active, setActive] = useState("Home") 
    
  return (
    <MainContext.Provider value={{
      active, 
      setActive

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext