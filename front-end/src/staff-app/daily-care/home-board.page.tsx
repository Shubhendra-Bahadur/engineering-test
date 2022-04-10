import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Select, MenuItem, RadioGroup, Radio, FormControlLabel } from "@material-ui/core"
import { sortByOption, orderByOption } from "staff-app/contants"
import { useStateContext } from "StateContext"
import { SORTS, ORDERS } from "shared/interfaces/staff.interfaces"

export const HomeBoardPage: React.FC = () => {
  const { searchText, sortBy, orderBy, markerStateArr, setMarkerStateArr, rollMarkFilter } = useStateContext()
  const [isRollMode, setIsRollMode] = useState(false)
  const [rollMarkerCount, setRollMarkerCount] = useState({ all: 0, present: 0, late: 0, absent: 0 })

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    const initArray: any = []
    if (isRollMode) {
      data?.students && data?.students.map((student) => initArray.push({ id: student.id, roll_state: "unmark" }))
      setMarkerStateArr(initArray)
    } else {
      setMarkerStateArr(initArray)
    }
  }, [isRollMode])

  useEffect(() => {
    let initMarkerCalc: any = { all: markerStateArr.length }
    let state
    markerStateArr?.map((student: any) => {
      state = student.roll_state
      if (student.roll_state !== "unmark") {
        initMarkerCalc[state] = initMarkerCalc[state] ? initMarkerCalc[state] + 1 : 1
      }
    })
    setRollMarkerCount(initMarkerCalc)
  }, [markerStateArr])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const nameComparator = (a: any, b: any) => {
    if (orderBy === ORDERS.ASCENDING && (sortBy === SORTS.FIRST_NAME || sortBy === SORTS.LAST_NAME)) {
      return a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1
    }
    return (sortBy === SORTS.FIRST_NAME || sortBy === SORTS.LAST_NAME) && a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? 1 : -1
  }

  const filterName = (name: any) => {
    return (name?.[SORTS.FIRST_NAME] + name?.[SORTS.LAST_NAME]).toLowerCase().includes(searchText.toLowerCase()) ? true : false
  }

  const filterRoll = (student: any) => {
    let markStateArrIndex = markerStateArr.findIndex((state: any) => state.id === student.id)
    if (isRollMode) {
      if ((markerStateArr as any)[markStateArrIndex]?.roll_state === rollMarkFilter) return true
      else if (rollMarkFilter === "all") return true
      else return false
    } else {
      return true
    }
  }

  const findRollState = (s: any) => {
    return (markerStateArr as any).find((student: any) => student.id === s.id)?.roll_state
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {data.students
              .sort((a, b) => nameComparator(a, b))
              .filter((name) => filterName(name))
              .filter((student) => filterRoll(student))
              .map((s) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} initMark={findRollState(s)} />
              ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} rollMarkerCount={rollMarkerCount} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { searchText, setSearchText, sortBy, setSortBy, orderBy, setOrderBy } = useStateContext()
  const { onItemClick } = props
  return (
    <S.ToolbarContainer>
      <S.SortToolBarContainer>
        <div>
          <p>Sort by:</p>
          <S.Select
            value={sortBy}
            label="Sort by"
            onChange={(event) => {
              setSortBy(event.target.value)
            }}
          >
            {sortByOption.map((option, index) => (
              <MenuItem value={option.value} key={index}>
                {option.text}
              </MenuItem>
            ))}
          </S.Select>
        </div>
        <div>
          <p className="order-label-text" id="order-controlled-radio-buttons-group">
            Order by:
          </p>
          <RadioGroup
            aria-labelledby="order-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value)
            }}
          >
            {orderByOption.map((order, index) => (
              <FormControlLabel className="button-height" value={order.value} control={<Radio />} label={order.text} key={index} />
            ))}
          </RadioGroup>
        </div>
      </S.SortToolBarContainer>
      <input placeholder="Search name here..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};

    input {
      width: 30%;
      height: 30px;
      padding: 5px;
      border-radius: 2px;
      outline: none;
      border: none;
    }
  `,
  SortToolBarContainer: styled.div`
    display: flex;
    gap: 12px;
    align-items: start;
    flex-wrap: wrap;
    > div {
      display: flex;
      gap: 5px;
      align-items: start;
      flex-direction: column;
      flex-wrap: wrap;

      > p {
        margin: 0px;
      }

      .order-label-text {
        color: ${Colors.neutral.lighter};
      }

      .button-height {
        height: 30px;
      }
    }
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Select: styled(Select)`
    && {
      width: fit-content;
      padding-left: 3px;
      height: 30px;
      background-color: ${Colors.neutral.lighter};
    }
  `,
}
