import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core"
import { Activity } from "shared/models/activity"
import { faCaretDown, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { RolllStateType } from "shared/models/roll"

interface Props {
  activity: Activity
}

export const RollListDateWise: React.FC<Props> = ({ activity }) => {
  const [rollStatusCount, setRollStatusCount] = useState<any>({
    unmark: 0,
    present: 0,
    late: 0,
    absent: 0,
  })
  useEffect(() => {
    if (activity) {
      let tempRollStatus: any = {}
      activity?.entity?.student_roll_states?.map(({ roll_state }) => {
        tempRollStatus[roll_state] = tempRollStatus[roll_state] ? tempRollStatus[roll_state] + 1 : 1
      })
      setRollStatusCount({ ...rollStatusCount, ...tempRollStatus })
    }
  }, [])

  const getDateAndTime = (date: string) => {
    let newDate = new Date(date)
    return (
      newDate.getDay() +
      " " +
      newDate.toLocaleString("default", { month: "long" }) +
      " " +
      newDate.getFullYear() +
      ", " +
      newDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
    )
  }

  return (
    <S.RollActivityContainer>
      <S.Accordion>
        <S.AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} size="lg" />}>
          <div className="content-summary">
            <div className="roll-name-container">
              <FontAwesomeIcon icon={faAngleRight} size="lg" />
              <span>{(activity as any)?.entity?.name}</span>
            </div>
            <span className="date-string">{getDateAndTime((activity as any).date)}</span>
          </div>
        </S.AccordionSummary>
        <S.AccordionDetails>
          {Object.keys(rollStatusCount).map((status, index) => (
            <div key={index}>
              <RollStateIcon type={status as RolllStateType} size={40} />
              <div>{rollStatusCount?.[status] || 0}</div>
            </div>
          ))}
        </S.AccordionDetails>
      </S.Accordion>
    </S.RollActivityContainer>
  )
}

const S = {
  RollActivityContainer: styled.div`
    visibility: visible;
    width: 100%;
    height: 100%;
    margin: 0px;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,

  Accordion: styled(Accordion)`
    && {
      width: 100%;
      height: 100%;
      margin: 0px;
    }
  `,

  AccordionSummary: styled(AccordionSummary)`
    && {
      padding: 0px 16px 0px 10px;
      font-size: 16px;
      font-weight: 400;
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }

    .content-summary {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 18px;

      .roll-name-container {
        display: flex;
        gap: 11px;
        align-items: center;
      }
    }
  `,

  AccordionDetails: styled(AccordionDetails)`
    && {
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 23px 16px 23px;
      font-weight: 400;
      font-size: 15px;
    }

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 13px;
    }
  `,
}
