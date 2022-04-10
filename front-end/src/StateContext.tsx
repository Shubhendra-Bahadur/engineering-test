import React, { createContext, Dispatch, useContext } from "react"
import { SORTS, ORDERS } from "shared/interfaces/staff.interfaces"

export const StateVarContext = createContext({
  searchText: "",
  sortBy: SORTS.FIRST_NAME,
  orderBy: ORDERS.ASCENDING,
  markerStateArr: [],
  rollMarkFilter: 'all',
  setRollMarkFilter: {} as Dispatch<any>,
  setMarkerStateArr: {} as Dispatch<any>,
  setSearchText: {} as Dispatch<any>,
  setSortBy: {} as Dispatch<any>,
  setOrderBy: {} as Dispatch<any>,
})

// definign context of state variables
export const useStateContext = () => {
  const StateContext = useContext(StateVarContext)
  return StateContext
}
