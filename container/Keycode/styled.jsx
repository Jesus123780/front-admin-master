import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    white-space: nowrap;
    height: 100vh;

`
export const ContentImage = styled.div`
    width: 40vw;
    position: relative;
    height: 100%;
`
export const Form = styled.div`
    width: 30vw;
    align-items: center;
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: min-content;
    margin: auto;
    justify-content: center;
    align-items: center;
    @media (max-width: 1024px) {
        width: 60vw;
    }
`
export const ContainerLeft = styled.div`
@media (min-width: 1024px){
    display: flex;
    flex: 1 1 0%;
}
    display: none;
    position: static;
    margin: 0px;
    top: 0px;
    left: 0px;
    width: 60%;
    min-width: 60%;
    max-width: 60%;
    height: 93vh;
`