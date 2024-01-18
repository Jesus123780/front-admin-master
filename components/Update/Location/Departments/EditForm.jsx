/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { RippleButton } from '../../../Ripple'
import { EDIT_DEPARTMENT } from './queries'
import { ContainInput, Input } from './styled'

export function EditForm (props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : '')
  const inputRef = useRef(null)
  //  const { setAlertBox } = useContext(Context)

  useEffect(() => {
    inputRef?.current?.focus()
  })

  const handleChange = e => {
    setInput(e.target.value)
  }
  const [editDepartments, { loading, error }] = useMutation(EDIT_DEPARTMENT)
  // eslint-disable-next-line
    const dName = input
  // eslint-disable-next-line
    const dId = props?.edit?.id
  const handleSubmit = async e => {
    e.preventDefault()
    props.onSubmit({
      id: props.edit?.id,
      text: input
    })
    setInput('')
    try {
      const results = await editDepartments({
        variables: {
          input: {
            // eslint-disable-next-line
                        dName, dId
          }
        }
      })
      // eslint-disable-next-line
      if (results) setAlertBox({ message: ` Departamento actualizado a  ${ dName }`, duration: 5000 })
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
          <RippleButton onClick={handleSubmit}>Actualizar País</RippleButton>
        </ContainInput>
      )}
    </form>
  )
}
