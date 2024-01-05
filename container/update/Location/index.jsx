import { Column, RippleButton, Row } from "pkg-components"
import { useEffect, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import { Location as LocationAll } from "../Location/All/container"
import { Departments } from "../Location/Departments"
import { Municipalities } from "../Location/Municipalities"
import { Countries } from "./Countries"
import { TypeRoad } from "./Road"

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
    { id: 5, label: "Todo" },
  ];
  const [backgroundPosition, setBackgroundPosition] = useState(0);

  useEffect(() => {
    const contentButton = document.querySelector('.content-button');

    const handleMouseMove = (e) => {
      const buttons = contentButton.children;
      const buttonWidth = buttons[0].offsetWidth;
      const mouseX = e.clientX - contentButton.getBoundingClientRect().left;
      const newIndex = Math.floor(mouseX / buttonWidth) + 1;

      if (newIndex !== active) {
        setActive(newIndex);
      }

      const newPosition = (newIndex - 1) * buttonWidth;
      setBackgroundPosition(newPosition + 'px');
    };

    contentButton.addEventListener('mousemove', handleMouseMove);

    return () => {
      contentButton.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);
  
  return (
    <Column style={{ with: "80%" }}>
      <Row
        width="100%"
        style={{
          flexWrap: "wrap",
          width: "90%",
          margin: "20px auto",
          justifyContent: "center",
        }}
      >
        <ContentButton className="content-button" style={{ backgroundPosition }}>
        {buttonProps.map(({ id, label }) => (
          <RippleButton
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
          ></RippleButton>
        ))}
        </ContentButton>
      </Row>
      <div style={{ margin: "0 auto", width: "90%" }}>
        {componentsMap[active] || componentsMap[5]}
      </div>
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

const ContentButton = styled.div`
  display: flex;
  gap: 5px;
  overflow: hidden;
  background: linear-gradient(to right, red, red) no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s;
  padding: 10px; /* Agrega margen interno para separar los botones */
`;