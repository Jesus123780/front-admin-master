/* eslint-disable consistent-return */
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Container } from './styled'

export const AlertBox = ({ err }) => {
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    if (err) {
      const timeOut = setTimeout(() => { return setClosed(true) }, (err.duration || 7000) / 2)
      return () => {
        clearTimeout(timeOut)
        setClosed(false)
      }
    }
  }, [err])
  return (
    <Container
      closed={closed}
      color={err.color}
      error={!!err?.message}
    >{(err.message || '')}</Container>
  )
}

AlertBox.propTypes = {
  err: PropTypes.shape({
    color: PropTypes.any,
    duration: PropTypes.number,
    message: PropTypes.string
  })
}
