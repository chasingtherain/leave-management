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

  const [currentLeaveEntitlement, setCurrentLeaveEntitlement] = useState()

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
        
        // opening connection here because socket function requires team calendar to work 
        isFirstRender.current && openSocketConnection(resp.data)
        isFirstRender.current = false // prevent opening socket twice
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

  const fetchLeaveEntitlement = () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/admin/get-leave-entitlement`)
      .then(resp =>{ 
        console.log("resp from fetching leave entitlement: ", resp)
        setCurrentLeaveEntitlement(resp.data.leaveEntitlement)
      })
      .catch(err => {
        console.log("err: ", err)
        toast.warning("failed to retrieve leave entitlement data")
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
      console.log("teamcalendar", teamCalendar)
      const socket = openSocket(process.env.REACT_APP_BACKENDURL)

      socket.on('calendar', data => {
        if(data.action === 'create'){
          // console.log("socket data", data)
          // console.log("team calendar (before addition): ", teamCalendar)
          setTeamCalendar((teamCalendar) => [...teamCalendar, data.calendarRecord])
          // console.log("team calendar (after): ", teamCalendar)
        }

        if(data.action === 'delete'){
          // console.log("deleted data", data)
          const deletedRecord = data.calendarRecord
          console.log("deletedRecord: ", deletedRecord)
          console.log("teamCalendar: ", teamCalendar)

          const deletedCalendarRecord = teamCalendar.filter(record => 
                                                              (record.startDateUnix === deletedRecord.startDateUnix &&
                                                              record.endDateUnix === deletedRecord.endDateUnix &&
                                                              record.staffName === deletedRecord.staffName)
                                                            )
          console.log("deletedCalendarRecord: ", deletedCalendarRecord)                                                      
          // console.log("updatedCalendarRecord: ", teamCalendar.filter(record => record.id !== deletedCalendarRecord[0].id))
          // console.log("team calendar (before deleting): ", teamCalendar)

          if (deletedCalendarRecord.length){
            setTeamCalendar((teamCalendar) => teamCalendar.filter(record => record.id !== deletedCalendarRecord[0].id))                                     
          }
          else{
            window.location.reload();
          }
          // console.log("team calendar (after): ", teamCalendar)
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
    fetchLeaveEntitlement()
    validateSession()

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
      currentLeaveEntitlement,
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