import { RippleButton } from "components/Ripple";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    fetchJson,
    useSetSession,
} from 'npm-pkg-hook';

import { decodeToken } from "utils";
import { Container, ContainerLeft, ContentImage, Form } from "./styled";

export const Login = (props) => {
    const [handleSession] = useSetSession()

  const router = useRouter();
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

  const handleForm = async (e) => {
    e.preventDefault();

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
  return (
    <div>
      <Container>
        <ContainerLeft>
          <ContentImage>
            <Image
              objectFit="cover"
              layout="fill"
              src={"/images/sign-in_3f701ac0c6.png"}
              alt={"Picture of the author"}
              blurDataURL="/images/sign-in_3f701ac0c6.png"
              placeholder="blur"
            />
          </ContentImage>
        </ContainerLeft>
        <Form onSubmit={(e) => handleForm(e)}>
          <RippleButton widthButton="100%" margin="20px auto" type="submit">
            Login
          </RippleButton>
        </Form>
      </Container>
    </div>
  );
};
