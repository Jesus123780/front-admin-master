/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { BGColor } from '../../public/colors'

export const RippleButton = props => {
  const { label, onClick, style, family, standard, active, type, widthButton, disabled } = props
  const button = useRef(null)

  useEffect(() => {
    let mounted = true
    const b = button.current
    b.addEventListener('click', e => {
      const rect = button.current.getBoundingClientRect()
      const ripple = document.createElement('div')
      const width = Math.max(rect.width, rect.height) * 2
      ripple.style.width = `${width}px`
      ripple.style.height = `${width}px`
      ripple.style.left = `${e.clientX - rect.left - width / 2}px`
      ripple.style.top = `${e.clientY - rect.top - width / 2}px`
      ripple.className = 'ripple'
      button.current.appendChild(ripple)

      setTimeout(() => { return mounted && button?.current?.removeChild(ripple) }, 1000)
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <ContainButton widthButton={widthButton} >
      <Button
        active={active}
        bgColor={props.bgColor}
        className='ripple-button'
        color={props.color}
        disabled={disabled}
        family={family}
        margin={props.margin}
        onClick={onClick}
        padding={props.padding}
        ref={button}
        standard={standard}
        style={style}
        type={type}
        widthButton={widthButton}
      >
        <span id='ripple-button-label'>{label}</span>
        {props.children}
      </Button>
    </ContainButton>
  )
}
const ContainButton = styled.div`
${({ widthButton }) => {
    return widthButton && css`
    width: ${widthButton};`
  }
}
    justify-content: center;
    display: flex;
    height: min-content;
    align-items: center;
    margin: auto;
.ripple-button {
  position: relative;
  overflow: hidden;
  border: none;
  line-height: 1.75;
  padding: 10px 20px;
  text-transform: uppercase;
  transition: background-color 0.3s;
  cursor: pointer;
  border-radius: 4px;
}


.ripple-button .ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  z-index: 1;
  animation: ripple-animation 0.7s;
  animation-fill-mode: forwards;
}

.ripple-button #ripple-button-label {
  position: relative;
  z-index: 2;
  font-weight: bold;
}

@keyframes ripple-animation {
  from {
    transform: scale(0);
    opacity: 1.2;
  }
  to {
    transform: scale(1);
    opacity: 0;
  }
}

`
const Button = styled.button`
 padding: ${({ padding }) => { return padding || '1em' }};
 background-color: ${({ bgColor }) => { return bgColor || 'red' }};
 color: ${({ color }) => { return color || BGColor }};
 font-family: ${({ family }) => { return family || 'PFont-Light' }};
 ${({ margin }) => { return !!margin && css`margin: ${margin};` }}
 ${({ standard }) => {
    return standard && css`
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    color: #000;
    width: 100%;
    font-size: 11px !important;
    font-family: PFont-Light !important;`
  }
}
 ${({ widthButton }) => {
    return widthButton && css`
    width: ${widthButton};`
  }
}
${props => {
    return props.active && css`
    border-radius: 0;
border-bottom: 3px solid red; `
  }}

`
