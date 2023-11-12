import { Button, Column, Row } from "pkg-components";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Location as LocationAll } from "../Location/All/container";
import { Departments } from "../Location/Departments";
import { Municipalities } from "../Location/Municipalities";
import { Countries } from "./Countries";
import { TypeRoad } from "./Road";

export const Location = () => {
  const [active, setActive] = useState(1);
  const handleClick = (index) => {
    setActive(index === active ? true : index);
  };
  const componentsMap = {
    1: (
      <ContainerAnimation>
        <Countries />
      </ContainerAnimation>
    ),
    2: (
      <ContainerAnimationTow>
        <Departments />
      </ContainerAnimationTow>
    ),
    3: (
      <ContainerAnimationThree>
        <Municipalities />
      </ContainerAnimationThree>
    ),
    4: (
      <ContainerAnimationFour>
        <TypeRoad />
      </ContainerAnimationFour>
    ),
    5: (
      <ContainerAnimationFive>
        <LocationAll />
      </ContainerAnimationFive>
    ),
  };

  const buttonProps = [
    { id: 1, label: "País" },
    { id: 2, label: "Departamentos" },
    { id: 3, label: "Ciudades" },
    { id: 4, label: "tipo de via" },
    { id: 5, label: "Todo" }
  ];

  return (
    <Column>
      <Row margin="auto" width="50%">
        {buttonProps.map(({ id, label }) => (
          <Button
            key={id}
            active={active === id}
            bgColor="#9797971a"
            color="red"
            label={label}
            margin="0px 5px"
            onClick={() => {
              return active !== id && handleClick(id);
            }}
            padding="10px"
            style={{ borderRadius: "0px" }}
            widthButton="200px"
          ></Button>
        ))}
      </Row>

      {componentsMap[active] || <h1>Donde te sentaste amigo???</h1>}
    </Column>
  );
};
export const AnimationRight = keyframes`
0% {
    transform: translateX(50vw);
    opacity: 0;
}
100% {
    transform: translateY(0);
    opacity: 1;
}
`;
export const AnimationLeft = keyframes`
0% {
    transform: translateX(-50vw);
    opacity: 0;
}

100% {
    transform: translateY(0);
    opacity: 1;
}
`;
const ContainerAnimation = styled.div`
  ${(props) => {
    return (
      props.active === 1 &&
      css`
        animation: ${AnimationRight} 200ms;
      `
    );
  }}
`;
const ContainerAnimationTow = styled.div`
  ${(props) => {
    return (
      props.active === 2 &&
      css`
        animation: ${AnimationLeft} 200ms;
      `
    );
  }}
`;
const ContainerAnimationThree = styled.div`
  ${(props) => {
    return (
      props.active === 2 &&
      css`
        animation: ${AnimationLeft} 200ms;
      `
    );
  }}
`;
const ContainerAnimationFour = styled.div`
  ${(props) => {
    return (
      props.active === 4 &&
      css`
        animation: ${AnimationLeft} 200ms;
      `
    );
  }}
`;
const ContainerAnimationFive = styled.div`
  ${(props) => {
    return (
      props.active === 5 &&
      css`
        animation: ${AnimationLeft} 200ms;
      `
    );
  }}
`;
