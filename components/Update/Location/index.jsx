import { Location as LocationAll } from '../Location/All/container'
import { Departments } from '../Location/Departments'
import { Municipalities } from '../Location/Municipalities'
import { Countries } from './Countries'
import { Container } from './styled'

import { useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { RippleButton } from 'pkg-components'
import { TypeRoad } from './Road'

export const Location = () => {
  const [active, setActive] = useState(1)
  const handleClick = index => {
    setActive(index === active ? true : index)
  }
  const tabWidth = 100 / 5 // Cambia 5 al número total de botones

  return (
    <Container>
      <ContentButton>
        <RippleButton
          active={active === 1}
          bgColor='#9797971a'
          color='red'
          label='País'
          margin='0px 5px'
          onClick={() => { return active !== 1 && handleClick(1) }}
          padding='10px'
          style={{ borderRadius: '0px' }}
        />
        <RippleButton
          active={active === 2}
          bgColor='#9797971a'
          color='red'
          label='Departamentos'
          margin='0px 5px'
          onClick={() => { return active !== 2 && handleClick(2) }}
          padding='10px'
          style={{ borderRadius: '0px' }}
        />
        <RippleButton
          active={active === 3}
          bgColor='#9797971a'
          color='red'
          label='Ciudades'
          margin='0px 5px'
          onClick={() => { return active !== 3 && handleClick(3) }}
          padding='10px'
          style={{ borderRadius: '0px' }}
        />
        <RippleButton
          active={active === 4}
          bgColor='#9797971a'
          color='red'
          label='tipo de via'
          margin='0px 5px'
          onClick={() => { return active !== 4 && handleClick(4) }}
          padding='10px'
          style={{ borderRadius: '0px' }}
        />
        <RippleButton
          active={active === 5 }
          bgColor='#9797971a'
          color='red'
          label='Todo'
          margin='0px 5px'
          onClick={() => { return active !== 5 && handleClick(5) }}
          padding='10px'
          style={{ borderRadius: '0px' }}
        />
      </ContentButton>
      <span
        style={{
          left: `${active * tabWidth}%`,
          width: `${tabWidth}%`
        }}
      />
      {
        active === 1
          ? <ContainerAnimation><Countries /></ContainerAnimation>
          : active === 2 ? <ContainerAnimationTow><Departments /></ContainerAnimationTow> : active === 3 ? <ContainerAnimationThree><Municipalities /></ContainerAnimationThree> : active === 4 ? <ContainerAnimationFour><TypeRoad /></ContainerAnimationFour> : active === 5 ? <ContainerAnimationFive><LocationAll /></ContainerAnimationFive> : <h1>Donde te sentaste amigo???</h1>
      }
    </Container>
  )
}
export const AnimationRight = keyframes`
0% {
    transform: translateX(50vw);
    opacity: 0;
}
100% {
    transform: translateY(0);
    opacity: 1;
}
`
export const AnimationLeft = keyframes`
0% {
    transform: translateX(-50vw);
    opacity: 0;
}

100% {
    transform: translateY(0);
    opacity: 1;
}
`
const ContainerAnimation = styled.div`
${props => { return props.active === 1 && css`animation: ${AnimationRight} 200ms;` }}

`
const ContainerAnimationTow = styled.div`
${props => { return props.active === 2 && css`animation: ${AnimationLeft} 200ms;` }}

`
const ContainerAnimationThree = styled.div`
${props => { return props.active === 2 && css`animation: ${AnimationLeft} 200ms;` }}

`
const ContainerAnimationFour = styled.div`
${props => { return props.active === 4 && css`animation: ${AnimationLeft} 200ms;` }}

`
const ContainerAnimationFive = styled.div`
${props => { return props.active === 5 && css`animation: ${AnimationLeft} 200ms;` }}

`
const ContentButton = styled.div`
  display: flex;
  gap: 5px;
  overflow: hidden;
  background: linear-gradient(to right, red, red) no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s;
`
