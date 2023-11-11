import React, { useState, useEffect, useCallback } from 'react'
import { Container, Wrapper, Modal, ModalHeader, ModalTitle, BtnClose, ModalBody, ModalFooter, BtnCancel, BtnConfirm } from './styled'
import { MODAL_SIZES, BUTTONS_TEXT } from './constanst'
import { IconCancel } from '../../public/icons'
import { BGColor } from '../../public/colors'
import { RippleButton } from '../Ripple'

export const AwesomeModal = ({
  title,
  size = MODAL_SIZES.medium,
  show,
  disabled,
  display,
  onClickConfirm,
  showLateral,
  zIndex,
  padding,
  backdrop = true,
  useScroll = false,
  keyboard = true,
  footer = true,
  btnCancel = true,
  openLateral,
  btnConfirm = true,
  children,
  hideOnConfirm = true,
  timeOut = 200,
  height,
  bgColor,
  submit = false,
  header = true,
  closeIcon = false,
  borderRadius = '.3rem',
  onHide = () => {return undefined},
  onCancel = () => {return undefined},
  onConfirm = () => {return undefined}
}) => {
  const [state, setState] = useState(show)
  const [backdropA, setAnimationBackdrop] = useState(false)
  const hide = useCallback(() => {
    setState(false)
    onCancel()
    setTimeout(onHide, timeOut)
  }, [onCancel, onHide, timeOut])
  useEffect(() => {
    if (backdrop !== 'static') {
      if (keyboard && show) window.addEventListener('keyup', e => {return e.code === 'Escape' && hide()})
      return () => {return keyboard && window.removeEventListener('keyup', () => { return })}
    }
  }, [keyboard, hide, show, backdrop])
  useEffect(() => {
    setState(show)
  }, [show])
  const onBackdropHide = e => {
    e.preventDefault()
    if (backdrop === 'static') {
      setAnimationBackdrop(!backdropA)
    } else {
      hide()
    }
  }
  useEffect(() => {
    if (show && useScroll) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [show, useScroll])
  const clickCancel = () => {
    hide()
    onCancel()
  }
  const clickConfirm = () => {
    if (hideOnConfirm) hide()
    onConfirm()
  }
  return (
    <Container
      bgColor={bgColor}
      onMouseDown={onBackdropHide}
      openLateral={openLateral}
      show={show}
      showLateral={show}
      state={state}
      zIndex={zIndex}
    >
      <Wrapper backdropA={backdropA} onMouseDown={onBackdropHide}>
        <Modal
          backdropA={backdropA}
          borderRadius={borderRadius}
          height={height}
          onMouseDown={e => {return e.stopPropagation()}}
          show={show}
          showLateral={show}
          size={size}
          state={state}
        >
          {header && <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <BtnClose onClick={hide}><IconCancel size='20px' /></BtnClose>
          </ModalHeader>}
          {(closeIcon && !header) && <BtnClose fixed onClick={hide}></BtnClose>}
          <ModalBody
            display={display}
            height={height}
            padding={padding}
          >
            {children}
            {footer && <ModalFooter>
              {btnCancel ? <RippleButton
                border
                disabled={disabled}
                onClick={clickCancel}
                type='button'
              >{BUTTONS_TEXT.cancel}</RippleButton> : <div>as </div>}
              {btnConfirm && <RippleButton
                border
                onClick={clickConfirm}
                type={submit ? 'submit' : 'button'}
              >{BUTTONS_TEXT.confirm}</RippleButton>}
            </ModalFooter>}
          </ModalBody>
        </Modal>
      </Wrapper>
    </Container>
  )
}
