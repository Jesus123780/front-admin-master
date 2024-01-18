/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { RippleButton } from '../../../Ripple'
import { EDIT_MUNICIPALITIES } from './queries'
import { ContainInput, Input } from './styled'

export function EditForm (props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : '')
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef?.current?.focus()
  })
  const handleChange = e => {
    setInput(e.target.value)
  }
  const [editMunicipalities, { loading, error }] = useMutation(EDIT_MUNICIPALITIES)
  const cName = input
  const cId = props?.edit?.id
  const handleSubmit = async e => {
    e.preventDefault()
    props.onSubmit({
      id: props.edit?.id,
      text: input
    })
    setInput('')
    try {
      const results = await editMunicipalities({
        variables: {
          input: {
            cName, cId
          }
        }
      })
      // eslint-disable-next-line
      if (results) setAlertBox({ message: ` Cuidad actualizado a  ${cName}`, duration: 5000 })
    } catch (err) {
      // eslint-disable-next-line
      console.log({ message: `${err}`, duration: 7000 })
    }
  }
  if (error) return <div>Ocurrió un error</div>
  return (
    <form className='todo-form' onSubmit={handleSubmit}>
      {loading && <i>Cargando</i>}
      {props.edit && (
        <ContainInput>
          <Input
            name='text'
            onChange={handleChange}
            placeholder='País'
            ref={inputRef}
            value={input}
          />
          <RippleButton onClick={handleSubmit}>Actualizar Cuidad</RippleButton>
        </ContainInput>
      )}
    </form>
  )
}
