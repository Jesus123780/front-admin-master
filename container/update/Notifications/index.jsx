// import { useMutation } from '@apollo/client'
// import { useFormTools } from 'components/BaseForm'
// import { Context } from 'context/Context'
// import {
//   Column,
//   InputHooks,
//   RippleButton,
//   Row,
//   Text
// } from 'pkg-components'
// import { useContext } from 'react'
// import { CREATE_NOTIFICATION } from './queries'

// export const Notification = () => {
//   const { Location, setAlertBox } = useContext(Context)
//   const [handleChange, handleSubmit, setDataValue, { dataForm, errorForm, setForcedError }] = useFormTools()
//   const [createOneNotification, { data }] = useMutation(CREATE_NOTIFICATION, {
//     context: { clientName: 'admin-server' },
//     onCompleted: (data) => setAlertBox({ message: data.createOneNotification.message })
//   })
//   const sendNotification = () => {
//     dataForm?.message?.length >= 0 &&
//       createOneNotification(
//         {
//           variables: { message: dataForm?.message }
//         }
//       ).then(() => (
//         setAlertBox({ message: 'Lo sentimos  a ocurrido un error' })
//       ))
//     setDataValue({})
//   }
//   return (
//     <Column>
//     <Text> {dataForm?.message}</Text>
//       <Row margin='20px 0'>
//         <InputHooks title='mensaje de notificaciones' required error={errorForm?.message} value={dataForm?.message} onChange={handleChange} name='message' />
//         <RippleButton disabled={dataForm?.message?.length <= 0} widthButton='70%' padding='30px' onClick={() => sendNotification()}>Subir</RippleButton>
//       </Row>
//     </Column>
//   )
// }


export const Notification = () => {
  return (
    <div>index</div>
  )
}
