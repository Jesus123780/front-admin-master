// import { useMutation } from '@apollo/client'
// import { useSetState } from 'hooks/useState'
// import { UPLOAD_FILE } from './queries'

// export const Dashboard = () => {
//     const [uploadFileMultiple, { error: Error }] = useMutation(UPLOAD_FILE)
//     const Files = useSetState('')
//     const Reset = useSetState(false)
    
//     const handleFileChange = async (e) => {
//       const file = e.target.files[0]
//       try {
//         console.log(file)
//         const res = await uploadFileMultiple({ variables: { file: file } })
//         console.log(res)
//       } catch (error) {
//         console.log(error)
//       }

//         // Files.setState(paramFiles)
//     }

//     const handleSubmitFile = async () => {
//         // e.stopPropagation()
//         // e.preventDefault()
//         for (const element of Files.state) {
//           Reset.setState(true)
//           try {
//             const res = await uploadFileMultiple({ variables: { file: element, input: { aSize: element.size } } })
//             Reset.setState(!Reset)
//           } catch (error) {
//           }
//         }
//       }
//     return (
//         <div>
//           <input type="file"  onChange={handleFileChange} />
//             {/* <InputFiles Disable={null} onChange={handleFileChange} reset={Reset.state} /> */}
//             <button onClick={() => handleSubmitFile()}>Subir</button>
//         </div>
//     )
// }


export const Dashboard = () => {
  return (
    <div>index</div>
  )
}
