import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Controller: React.FC = () => {
  return (
    <StyledDiv>
      <div className="wrapper">
        <div className="upper">
          <div>
            <FontAwesomeIcon size="xl" icon={faArrowUp} />
          </div>
        </div>
        <div className="lower">
          <div>
            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
          </div>
          <div>
            <FontAwesomeIcon size="xl" icon={faArrowDown} />
          </div>
          <div>
            <FontAwesomeIcon size="xl" icon={faArrowRight} />
          </div>
        </div>
      </div>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: white;
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
    & > div & > div {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;

      &:last-of-type : {
        margin-right: 0px;
      }
    }
  }
`;

export { Controller };
