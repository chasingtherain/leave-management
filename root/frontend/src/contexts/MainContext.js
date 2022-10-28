import { createContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import openSocket from 'socket.io-client'

export const MainContext = createContext()

export const MainContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Home 主页") 
  const [currentUser, setCurrentUser] = useState()
  const [userList, setUserList] = useState([])
  const [teamCalendar, setTeamCalendar] = useState([])
  const [isAdmin, setIsAdmin] = useState()

  const [currentLeaveSelection, setCurrentLeaveSelection] = useState("Annual Leave 年假")
  const [currentEditUser, setCurrentEditUser] = useState()
  const [sessionToken, setSessionToken] = useState(() => {
    let token =  sessionStorage.getItem('leaveMgtToken')
    if(token) return token
    else return ""
  })

  const [authState, setAuthState] = useState(false)

  const [currentWorkdaySelection, setCurrentWorkdaySelection] = useState([])
  const [currentHolidaySelection, setCurrentHolidaySelection] = useState([])

  const isFirstRender = useRef(true)

  const fetchUserList = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getAllUsers`)
      .then(resp =>{ 
        setUserList(resp.data)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve all users info")
      })
  }

  const fetchTeamCalendar = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getTeamCalendar`)
      .then(resp =>{ 
        console.log("fetchTeamCalendar: ", resp.data)
        setTeamCalendar(resp.data)
        // console.log(resp)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve team calendar")
      })
  }

  const fetchWorkDay = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/admin/get-work-day`)
      .then(resp =>{ 
        // console.log("fetchWorkDay: ", resp.data)
        setCurrentWorkdaySelection(resp.data.workday)
        setCurrentHolidaySelection(resp.data.holiday)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve work day data")
      })
  }

  const fetchCurrentUserInfo = async (currentUser) =>{
      console.log("fetchCurrentUserInfo triggered")
      axios
      .get(`${process.env.REACT_APP_BACKENDURL}/user/getUser/${currentUser._id}`)
      .then(resp =>{
        console.log(resp)
        setCurrentUser(resp.data)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("Failed to fetch current user info")
      })
  }

  const validateSession = () => {
    if(sessionToken){
      const url = `${process.env.REACT_APP_BACKENDURL}/validate-session`
      axios
      .post(url, {sessionId: sessionToken})
      .then((user) => {
          // set user as current user
          setCurrentUser(user.data)
        })
        .catch(err => console.log(err))
      }
      setTimeout( () => setAuthState(true), 1000)
      // setAuthState(true)
  }

  const openSocketConnection = (teamCalendar) => {
      console.log("open socket fx executed!")
      const socket = openSocket(process.env.REACT_APP_BACKENDURL)
      socket.on('calendar', data => {
        if(data.action === 'create'){
          console.log("socket data", data)
          console.log("team calendar (before addition): ", teamCalendar)
          setTeamCalendar((teamCalendar) => [...teamCalendar, data.calendarRecord])
          console.log("team calendar (after): ", teamCalendar)
        }

        if(data.action === 'delete'){
          console.log("deleted data", data)
          const deletedRecord = data.calendarRecord
          const updatedCalendarRecord = teamCalendar.filter(record => 
                                                              record.startDateUnix !== deletedRecord.startDateUnix &&
                                                              record.endDateUnix !== deletedRecord.endDateUnix &&
                                                              record.staffName !== deletedRecord.staffName
                                                            )
          console.log("team calendar (before addition): ", teamCalendar)
          setTeamCalendar((updatedCalendarRecord) => [...updatedCalendarRecord])
          console.log("team calendar (after): ", updatedCalendarRecord)
        }
      })
    }

  const validateEmail = (email) => {
    let regex = /\S+@\S+\.\S+/;
    return regex.test(email); // returns true if email is valid
  }

  useEffect(()=>{
    fetchUserList()
    fetchTeamCalendar()
    fetchWorkDay()
    validateSession()

    isFirstRender.current && openSocketConnection()
    isFirstRender.current = false // prevent opening socket twice

    console.log("use effect triggered")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainContext.Provider value={{
      activeTab, 
      authState,
      currentEditUser,
      currentLeaveSelection,
      currentUser,
      currentHolidaySelection,
      isAdmin,
      sessionToken,
      teamCalendar,
      userList,
      currentWorkdaySelection,
      fetchCurrentUserInfo,
      fetchUserList,
      openSocketConnection,
      setActiveTab,
      setCurrentEditUser,
      setCurrentLeaveSelection,
      setCurrentUser,
      setCurrentHolidaySelection,
      setIsAdmin,
      setSessionToken,
      setCurrentWorkdaySelection,
      validateEmail

     }}>
      { children }
    </MainContext.Provider>
  )

}
export default MainContext