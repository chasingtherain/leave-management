import MainContext from "../contexts/MainContext"
import { useContext } from "react"

export const useMainContext = () => {
  const context = useContext(MainContext)

  if(!context) {
    throw Error('useMainContext must be used inside MainContextProvider')
  }

  return context
}