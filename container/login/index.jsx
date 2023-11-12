import { AwesomeModal } from "components/AwesomeModal"
import { Loading } from "components/Loading"
import { RippleButton } from "components/Ripple"
import * as faceapi from "face-api.js"
import Image from "next/image"
import { useRouter } from "next/router"
import { fetchJson, useSetSession } from "npm-pkg-hook"
import { useEffect, useRef, useState } from "react"
import Tesseract from "tesseract.js"
import { decodeToken } from "utils"
import { decryptImage } from "./helpers"
import { Container, ContainerLeft, ContentImage, Form } from "./styled"

export const Login = () => {
  const [handleSession] = useSetSession()
  const [referenceDescriptor, setReferenceDescriptor] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const body = {
    name: "juvinaojesusd@gmail.com",
    username: "juvinaojesusd@gmail.com",
    lastName: "juvinaojesusd@gmail.com",
    email: "juvinaojesusd@gmail.com",
    password: "113561675852804771364",
    locationFormat: " locationFormat[0]?.formatted_address",
    useragent: "window.navigator.userAgent",
    deviceid: "23423423432",
  }

  const handleForm = async () => {
    const res = await fetchJson(`${process.env.URL_BACK_SERVER}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    const { userId, token, success, idStore } = res || {}
    if (success) {
      const decode = decodeToken(token)
      const cookiesDefault = [
        { name: "restaurant", value: idStore },
        { name: "usuario", value: decode?.id || id },
        { name: "session", value: token },
      ]
      await handleSession({ cookies: cookiesDefault })
      window.localStorage.setItem("session", token)
      window.localStorage.setItem("usuario", userId)
      router.push("/keycode")
    }
  }
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  useEffect(() => {
    let activeStream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          activeStream = stream
          setCameraStream(stream)
          videoRef.current.srcObject = stream
          videoRef.current.play()
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error)
        })
    }
    // Limpieza: detener la cámara cuando el componente se desmonte
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true)
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ])
      setIsModelLoaded(true)
      setOpenModal(true)
      setLoading(false)
    }
    loadModels()
  }, [])
  useEffect(() => {
    const loadReferenceImage = async () => {
      if (!isModelLoaded) return
      try {
        const response = await fetch("/api/referenceImage")
        const { iv, data } = await response.json()
        // Convertir IV y datos de hex a Uint8Array
        const ivArray = Uint8Array.from(Buffer.from(iv, "hex"))
        const dataArray = Uint8Array.from(Buffer.from(data, "hex"))
        // Desencriptar los datos
        const decryptedImage = await decryptImage(dataArray, ivArray)
        // Convertir el ArrayBuffer desencriptado a Blob
        const blob = new Blob([decryptedImage], { type: "image/png" })
        // Convertir Blob a Image para face-api.js
        const referenceImage = await faceapi.bufferToImage(blob)
        const singleResult = await faceapi
          .detectSingleFace(referenceImage)
          .withFaceLandmarks()
          .withFaceDescriptor()
        if (singleResult) {
          setReferenceDescriptor(singleResult.descriptor)
        }
      } catch (error) {
        console.error("Error al cargar y desencriptar la imagen:", error)
      }
    }
    loadReferenceImage()
  }, [isModelLoaded])

  const captureImage = async () => {

    if (!isModelLoaded || !referenceDescriptor) return
    setLoading(true)
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
    setCapturedImage(canvas.toDataURL("image/png"))
    const detections = await faceapi
      .detectAllFaces(canvas)
      .withFaceLandmarks()
      .withFaceDescriptors()
    if (detections.length > 0) {
      const faceDescriptor = detections[0].descriptor
      const distance = faceapi.euclideanDistance(
        faceDescriptor,
        referenceDescriptor
      )
      if (distance < 0.6) {
        console.log("Las imágenes son del mismo rostro")
        handleForm()
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop())
        }
      } else {
        console.log("Las imágenes son de rostros diferentes")
      }
    }
    setLoading(false)
  }
  const videoRefCC = useRef(null);
  const canvasRefCC = useRef(null);
  const extractTextFromImage  = async (imageDataURL) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageDataURL,
        'eng',
      );
      console.log('Texto encontrado:', text);
      return text;
    } catch (error) {
      console.error("Error al procesar la imagen con OCR:", error);
      return '';
    }
  }
  const  captureImageFromCamera = async (videoRef, canvasRef) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await new Promise(resolve => videoRef.current.onloadedmetadata = resolve);
  
        // Dibujar el frame del video en el canvas
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
  
        // Detener la cámara
        stream.getTracks().forEach(track => track.stop());
  
        // Convertir la imagen del canvas a data URL
        return canvasRef.current.toDataURL('image/png');
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    }
    return null;
  }
  const handleCaptureAndProcessImage = async () => {
    const imageDataURL = await captureImageFromCamera(videoRefCC, canvasRefCC);
    if (imageDataURL) {
      const extractedText = await extractTextFromImage(capturedImage);
      console.log("🚀 ~ file: index.jsx:186 ~ handleCaptureAndProcessImage ~ extractedText:", extractedText)
      // Haz algo con el texto extraído
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <AwesomeModal
        size="small"
        title="Reconocimiento Facial"
        show={openModal}
        onCancel={() => {
          return setOpenModal(false)
        }}
        onHide={() => {
          return setOpenModal(false)
        }}
        footer={false}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%" }}
        />
        <RippleButton
          widthButton="100%"
          margin="0"
          type="submit"
          onClick={
            loading
              ? () => {
                  return
                }
              : captureImage
          }
        >
          Captura imagen
        </RippleButton>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </AwesomeModal>
      <Container>
        <ContainerLeft>
          <ContentImage>
            <Image
              objectFit="cover"
              layout="fill"
              src="/images/sign-in_3f701ac0c6.png"
              alt="Picture of the author"
              blurDataURL="/images/sign-in_3f701ac0c6.png"
              placeholder="blur"
            />
          </ContentImage>
        </ContainerLeft>
        <Form>
          <RippleButton widthButton="100%" margin="20px auto" type="submit">
            Login
          </RippleButton>
        </Form>
      </Container>
    </div>
  )
}
