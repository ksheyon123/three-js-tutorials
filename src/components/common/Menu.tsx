import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  close: Function;
}

const Menu: React.FC<IProps> = ({ close }) => {
  return (
    <StyledView>
      <div className="close-btn">
        <FontAwesomeIcon
          style={{ width: "100%", height: "100%" }}
          icon={faClose}
        />
      </div>
      <div className="wrapper">
        <ul>
          <li>Home</li>
        </ul>
      </div>
    </StyledView>
  );
};

const StyledView = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  margin: auto 0px;
  & > div.close-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
  }
  & > div.wrapper {
    width: 100%;
    height: auto;
    & > ul {
      list-style: none;
      padding: 0px;
      margin: 0px;
    }
  }
`;

export { Menu };
