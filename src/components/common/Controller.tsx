import React, { useContext } from "react";
import styled from "styled-components";
import useController from "@/hooks/useController";
import { ThreeJsCtx } from "@/contexts/ThreeJsCtx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Controller: React.FC = () => {
  const { ctx } = useContext(ThreeJsCtx);
  const { activeBtn } = useController();
  return (
    <StyledDiv>
      <div>
        <div>Buttons</div>
        <div>Create Obj</div>
      </div>
      <div className="wrapper">
        <div className="upper">
          <div className={activeBtn === "ArrowUp" ? "active" : ""}>
            <FontAwesomeIcon size="xl" icon={faArrowUp} />
          </div>
        </div>
        <div className="lower">
          <div className={activeBtn === "ArrowLeft" ? "active" : ""}>
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
          </div>
          <div className={activeBtn === "ArrowDown" ? "active" : ""}>
            <FontAwesomeIcon size="xl" icon={faArrowDown} />
          </div>
          <div className={activeBtn === "ArrowRight" ? "active" : ""}>
            <FontAwesomeIcon size="xl" icon={faArrowRight} />
          </div>
        </div>
      </div>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  position: fixed;
  width: 100vw;
  height: auto;
  bottom: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-between;
  & > div.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > div.upper {
      margin-bottom: 5px;
      & > div {
        width: 30px;
      }
    }
    & > div.lower {
      display: flex;
    }
    & > div > div {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;

      &:last-of-type : {
        margin-right: 0px;
      }
      &.active {
        background-color: #666;
      }
    }
  }
`;

export { Controller };
