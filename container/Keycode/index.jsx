import { Loading } from "components/Loading"
import { RippleButton } from "components/Ripple"
import Image from "next/image"
import { useRouter } from "next/router"
import { fetchJson, useSetSession } from "npm-pkg-hook"
import { useEffect, useRef, useState } from "react"
import Tesseract from "tesseract.js"
import { decodeToken } from "utils"
import { Container, ContainerLeft, ContentImage, Form } from "./styled"

export const KeyCodeContainer = () => {
  const [handleSession] = useSetSession()
  const [cameraStream, setCameraStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleForm = async () => {
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
      router.push("/dashboard")
    }
  }
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  useEffect(() => {
    let activeStream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          activeStream = stream
          setCameraStream(stream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error)
        })
    }
  }, [])
  

  const captureImage = async () => {
    try {
      if (!videoRef) return
        setLoading(true)
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
        setCapturedImage(canvas.toDataURL("image/png"))
        setLoading(false)
        return true
    } catch (error) {
        return false
    }
  }


  const extractTextFromImage  = async (imageDataURL) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageDataURL,
        'eng',
      );
      return text
    } catch (error) {
      return ''
    }
  }
  const handleCaptureAndProcessImage = async () => {
    try {
      const imageDataURL = await captureImage();
      if (imageDataURL) {
        const extractedText = await extractTextFromImage(capturedImage);
        const isMatch = Boolean(extractedText.match(
          /MENU|JESUS|VALERIA/i
        ))
        if (!isMatch) {
          console.log('No hay coincidencias')
        }
        if (isMatch) {
          handleForm()
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop())
          }
        }
        // Haz algo con el texto extraído
      }
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div>
    <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {loading && <Loading />}
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
              : handleCaptureAndProcessImage
          }
        >
          Captura imagen
        </RippleButton>
        </Form>
      </Container>
    </div>
  )
}
