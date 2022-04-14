import React, { useEffect } from "react"
import styled from "styled-components"
import { useApi } from "shared/hooks/use-api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { useStateContext } from "StateContext"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

import { RollListDateWise } from "staff-app/components/activity-page/roll-list-date-wise"

export const ActivityPage: React.FC = () => {
  const [getActivities, activityData, activityLoadState] = useApi({ url: "get-activities" })
  const { rollActivity, setRollActivity } = useStateContext()

  useEffect(() => {
    getActivities()
  }, [])

  useEffect(() => {
    if ((activityData as any)?.activity?.length) {
      setRollActivity((activityData as any)?.activity)
    }
  }, [activityData])

  return (
    <S.Container>
      <S.ToolbarContainer>Activity Page</S.ToolbarContainer>
      {activityLoadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {activityLoadState === "loaded" && (
        <>
          {rollActivity?.length ? (
            <>
              <S.PageTitleContainer>
                <span>Roll Summary</span>
              </S.PageTitleContainer>
              {rollActivity?.map((activity, index) => {
                return (
                  <S.RollDataContainer key={index}>
                    <RollListDateWise activity={activity} key={index} />
                  </S.RollDataContainer>
                )
              })}
            </>
          ) : (
            <div style={{ margin: "30px auto", fontWeight: "bold", fontSize: "16px" }}>No Activity found</div>
          )}
        </>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,

  ToolbarContainer: styled.div`
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 18px 14px;
    font-weight: ${FontWeight.strong};
    font-size: 20px;
    border-radius: ${BorderRadius.default};
  `,

  PageTitleContainer: styled.div`
    display: flex;
    width: 100%;
    justify-content: start;
    font-weight: 600;
    font-size: 18px;
    margin-top: 2px;
    padding: 6px 11px;

    .back-div {
      cursor: pointer;
    }
  `,

  RollDataContainer: styled.div`
    margin-top: ${Spacing.u3};
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: fit-content;
    visibility: hidden;
    cursor: pointer;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }

    // > div {
    //   display: flex;
    //   margin-left: 10px;
    //   justify-content: center;
    //   gap: 13px;
    //   align-items: center;
    //   font-size: 16px;
    //   font-weight: 400;
    // }
  `,
}
