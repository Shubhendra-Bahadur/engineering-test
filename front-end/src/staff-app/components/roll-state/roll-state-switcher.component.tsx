import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { useStateContext } from "StateContext"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  studentId: any
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, studentId }) => {
  const [rollState, setRollState] = useState(initialState)
  const { markerStateArr, setMarkerStateArr } = useStateContext()

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = (studentId: any) => {
    const next = nextState()
    setMarkStatusToStudent(next)
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  const setMarkStatusToStudent = (next: any) => {
    let tempStateArr = [...(markerStateArr as any).filter((student: any) => student.id !== studentId), { id: studentId, roll_state: next }]
    setMarkerStateArr(tempStateArr)
  }

  return <RollStateIcon type={rollState} size={size} onClick={() => onClick(studentId)} />
}
