import { PColor, PLColor } from "public/colors";
import styled from "styled-components";

export const Select = styled.select`
    background-color: #fff;
    border-bottom: 1px solid #d3d3d3;
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    border: none;
    color: #3e3e3e;
    font-size: 1.375rem;
    font-size: 1rem;
    font-weight: 500;
    height: 40px;
    height: 48px;
    padding: 13px 20px;
    width: 100%;
`
export const ItemStatus = styled.div`
    background-color: ${props => !props.active ? '#ebf6f1' : `${PColor}69`};
    border-radius: 8px;
    font-family: PFont-Bold;
    font-weight: 800;
    padding: 13px 20px;
    & span {
        color: ${props => !props.active ? `#11af7a` : PColor }!important;
    }
`
export const Item = styled.div`
    border-radius: 5px;
    display: grid;
    margin: auto;
    padding: 15px 1px;
    place-content: center;
    & span {
        color: ${PLColor};
    }
`
export const Button = styled.button`
    color: ${PColor};
    & a {
        color: ${PColor}!important;
    }
    text-decoration: underline;
    background-color: transparent;
    cursor: pointer;
`