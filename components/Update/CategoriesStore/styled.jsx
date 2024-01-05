import styled, { css } from 'styled-components'
import { BGColor, PColor } from '../../../public/colors'

export const Button = styled.button` 
    position: absolute;
    z-index: 9999;
`
export const FormProducts = styled.form`
    height: min-content;
    overflow-y: auto;
    &::-webkit-scrollbar {
    width: 3px;
    background-color: #dcdcdc;
    border-radius: 5px;
    }
`

export const Card = styled.div` 
    background-color: ${ ({ theme }) => {return theme.InvColor} };
    border-radius: 5px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    height: ${({ height }) => {return height || 'auto'}};
    justify-content: space-between;
    overflow: hidden;
    padding: 10px;
    position: relative;
    text-overflow: ellipsis;

    .ellipsis-text {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .card_wraper_text {
        border-bottom: 1px dotted gray;
        display: flex;
        flex-direction: column;
        height: 40%;
        max-height: 40%;
        min-height: 40%;
        overflow: hidden;
        padding: 10px;
    }
`
export const Container = styled.div`
    display: flex;
    border-radius: 4px;
    background-color: ${ ({ theme }) => {return theme.InvColor} };
    transition:  6s ease;
    padding-bottom: 30px;
    height: 100%;
    padding: 30px;
    .filter{
        display: none !important;
    }
`
export const CardOne = styled(Card)` 
    transition:  .6s ease;
    width: 400px;
    margin: 0 30px 0 0;
    height: min-content;
    position: sticky;
    top: 0;
`
export const ColumnCard = styled.div`
    display: grid;
    gap: 10px;
    height: min-content;
    grid-template-columns: 24% repeat(auto-fill, 24%);
` 
export const ButtonCard = styled.button` 
    font-size: 12px;
    font-family: PFont-Light;
    cursor: pointer;
    word-break: break-word;
    box-shadow: 0px 0px 6px 0px #16101028;
    position: absolute;
    right: -50px;
    transition: .4s ease;
    width: 50px;
    height: 50px;
    top: ${ ({ top }) => {return top ? top : '20px'} };
    transition-delay: ${ ({ delay }) => {return delay ? delay : 'auto'} };
    max-height: 50px;
    max-width: 50px;
    border-radius: 50%;
    align-items: center;
    display: grid;
    justify-content: center;
    background-color: ${ BGColor };
    ${ props => {return props.grid && css`
        top: ${ ({ top }) => {return top ? top : '80px'} };
        `}
}
`
export const CardProduct = styled.div` 
    flex: 0 1 auto;
    display: flex;
    position: relative;
    width: ${({ width }) => {return width ? width : '100%'}};
    overflow: hidden;
    flex-direction: column;
    margin: 10px;
    border-radius: 8px;
    background-color: #FFFFFF;
    border: 1px solid rgba(0,0,0,.1);
    height: 450px;
    &:hover  ${ ButtonCard } {
        right: 15px;
    }
    &#space {
        padding: 30px;
        justify-content: space-between;
    }
    ${ props => {return props.grid && css`
    height: min-content;
    flex-direction: row;

`} }
`
