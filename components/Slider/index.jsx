import React from 'react'
import styled, { css } from 'styled-components'
import Slider from 'react-slick'
import { BGColor, PColor } from '../../public/colors'
import { IconArrowLeft, IconArrowRight } from '../../public/icons'
// import PropTypes from 'prop-types'

const CustomSlider = ({ children, spaceBetween, slidesToShow, touchMove = true, autoplay = false, dots = false, centerMode, infinite, arrows, vertical, direction }) => {return (
  <Slider
    autoplay={autoplay}
    direction={direction}
    dots={dots}
    // fade={true}
    infinite={infinite || false}
    nextArrow={<CustomArrow icon={<IconArrowRight color={ PColor} size='20px' />} />}
    pauseOnHover
    prevArrow={<CustomArrow icon={<IconArrowLeft color={ PColor } size='20px' />} next />}
    responsive={[
      { breakpoint: 920,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      { breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }
    ]}
    slidesToShow={slidesToShow}
    speed={600}
    swipeToSlide={true}
    touchMove={touchMove}
    vertical={vertical}
  >
    { children }
  </Slider>
)}

// CustomSlider.propTypes = {

// }

const CustomArrow = ({ onClick, next, icon }) => {return (
  !!onClick && <IconNext next={next} onClick={onClick}>{icon}</IconNext>
)}

const IconNext = styled.div`
    background: ${BGColor};
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    ${ ({ next }) => {return next ? css`left: -15px;` : css`right: -15px;`} }
    display: flex;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.19);
    align-items: center;
    justify-content: center;
    padding: 0;
    z-index: 99;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    cursor: pointer;
   
    @media(min-width: 768px){
        width: 64px;
        height: 64px;
        ${ ({ next }) => {return next ? css`left: 0px;` : css`right: 0px;`} }
    }

`

export default CustomSlider