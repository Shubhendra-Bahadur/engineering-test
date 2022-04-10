import { SORTS, ORDERS } from "shared/interfaces/sort.interfaces"

const sortByOption = [
  {
    text: "First Name",
    value: SORTS.FIRST_NAME,
  },
  {
    text: "Last Name",
    value: SORTS.LAST_NAME,
  },
]

const orderByOption = [
  {
    text: "ASC",
    value: ORDERS.ASCENDING,
  },
  {
    text: "DSC",
    value: ORDERS.DESCENDING,
  },
]

export { sortByOption, orderByOption }
