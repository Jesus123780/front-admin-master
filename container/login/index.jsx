import { useFormTools } from 'components/BaseForm';
import { RippleButton } from 'components/Ripple';
import fetchJson from 'hooks/fetchJson';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Container, ContainerLeft, ContentImage, Form } from './styled';

export const Login = (props) => {
    // STATES
    const [handleChange, handleSubmitMain, setDataValue, { dataForm, errorForm, setForcedError }] = useFormTools()
    const fileInputRef = React.useRef(null);
    const formRef = React.useRef(null);
    const router = useRouter()
    // setDataValue({...dataForm})
    // HANDLES
    const onClickHandler = () => {
        fileInputRef.current?.click();
    };
    const onChangeHandler = (event) => {
        if (!event.target.files?.length) {
            return;
        }
        const formData = new FormData();

        Array.from(event.target.files).forEach((file) => {
            formData.append(event.target.name, file);
        });

        props.onChange(formData);

        formRef.current?.reset();
    };
    const body = {
        name: 'juvinaojesusd@gmail.com',
        username: 'juvinaojesusd@gmail.com',
        lastName: 'juvinaojesusd@gmail.com',
        email: 'juvinaojesusd@gmail.com',
        password: '113561675852804771364',
        locationFormat: ' locationFormat[0]?.formatted_address',
        useragent: 'window.navigator.userAgent',
        deviceid: '23423423432',
    }
    const handleForm = (e) => handleSubmitMain({
        event: e,
        action: () => {
            return fetchJson(`${process.env.URL_BASE}/api/auth`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(res => {
                if (res.success === true) {
                    window.localStorage.setItem('restaurant', res?.idStore)
                    router.push('/dashboard')
                }
            }).catch(e => {
            })
        }
    })
    return (
        <div>
            <Container>
                <ContainerLeft>
                    <ContentImage>
                        <Image
                            objectFit='cover'
                            layout='fill'
                            src={'/images/sign-in_3f701ac0c6.png'}
                            alt={"Picture of the author"}
                            blurDataURL="/images/sign-in_3f701ac0c6.png"
                            placeholder="blur"
                        />
                    </ContentImage>
                </ContainerLeft>
                <Form onSubmit={(e) => handleForm(e)}>
                    <RippleButton widthButton='100%' margin='20px auto' type='submit'>Login</RippleButton>
                </Form>
            </Container>
        </div>
    )
}
