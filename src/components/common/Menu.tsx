import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
const Menu: React.FC = () => {
  return (
    <StyledView>
      <div>
        <FontAwesomeIcon icon={faHamburger} />
      </div>
      <ul>
        <Link to={"/"}>Home</Link>
      </ul>
    </StyledView>
  );
};

const StyledView = styled.div``;

export { Menu };
