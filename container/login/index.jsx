import { AwesomeModal } from "components/AwesomeModal";
import { RippleButton } from "components/Ripple";
import * as faceapi from "face-api.js";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  fetchJson,
  useSetSession,
} from 'npm-pkg-hook';
import { useEffect, useRef, useState } from "react";
import { decodeToken } from "utils";
import { Container, ContainerLeft, ContentImage, Form } from "./styled";

export const Login = (props) => {
  const [handleSession] = useSetSession()
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [openModal, setOpenModal] = useState(false)
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
  };

  const handleForm = async () => {

    const res = await fetchJson(`${process.env.URL_BACK_SERVER}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    const { userId, token, success, idStore } = res || {};
    if (success) {
        const decode = decodeToken(token)
        const cookiesDefault = [
            { name: 'restaurant', value: idStore },
            { name: 'usuario', value: decode?.id || id },
            { name: 'session', value: token }
          ]
          await handleSession({ cookies: cookiesDefault })
      window.localStorage.setItem("session", token);
      window.localStorage.setItem("usuario", userId);
      router.push("/dashboard");
    }
  };
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch(error => {
          console.error("Error accessing the camera:", error);
        });
    }
  }, []);
  useEffect(() => {
    // Cargar modelos de face-api.js
    const loadModels = async () => {
      setLoading(true)
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]);
      setIsModelLoaded(true);
      setOpenModal(true);
      setLoading(false)
    };
    loadModels();
  }, [])
  useEffect(() => {
    const loadReferenceImage = async () => {
      if (!isModelLoaded) return;
      const referenceImage = await faceapi.fetchImage('/images/me.png');
      const singleResult = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor();
      if (singleResult) {
        setReferenceDescriptor(singleResult.descriptor);
      }
    };
    loadReferenceImage();
  }, [isModelLoaded]);

  const captureImage = async () => {
    if (!isModelLoaded || !referenceDescriptor) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL('image/png'));
    const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
      const faceDescriptor = detections[0].descriptor
      const distance = faceapi.euclideanDistance(faceDescriptor, referenceDescriptor);
      if (distance < 0.6) {
        console.log('Las imágenes son del mismo rostro');
        handleForm()
      } else {
        console.log('Las imágenes son de rostros diferentes');
      }
    }
  };
  return (
    <div>
      <AwesomeModal
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
      <video ref={videoRef} width="720" height="560"  style={{ width: '100%', height: '100%' }} />
      <RippleButton widthButton="100%" margin="0" type="submit" onClick={loading ? () => { return } : captureImage}>
            Captura imagen
          </RippleButton>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
  );
};
