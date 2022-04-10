import React, { createContext, useState, useContext } from "react"
import { SORTS, ORDERS } from "shared/interfaces/staff.interfaces"
import { StateVarContext } from "StateContext"

// states going to be used up in application
export const AppState = () => {
  const [searchText, setSearchText] = useState<any>("")
  const [sortBy, setSortBy] = useState<SORTS>(SORTS.FIRST_NAME)
  const [orderBy, setOrderBy] = useState<ORDERS>(ORDERS.ASCENDING)
  const [markerStateArr, setMarkerStateArr] = useState([])
  const [rollMarkFilter, setRollMarkFilter] = useState<any>('all')

  return { searchText, setSearchText, sortBy, setSortBy, orderBy, setOrderBy, markerStateArr, setMarkerStateArr, rollMarkFilter, setRollMarkFilter }
}

// provideing state context to whole application
export const StateProvider: React.FC = ({ children }) => {
  const states = AppState()
  return <StateVarContext.Provider value={{ ...states }}>{children}</StateVarContext.Provider>
}
