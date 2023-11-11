/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { BColor, BGColor, EColor, PColor, PLColor, PVColor, SEGColor, SFColor, SFVColor } from '../../public/colors'
import { IconArrowBottom, IconFolder, IconLocationMap, IconPlus, IconWarning } from '../../public/icons'
import { Overline } from '../common/Reusable'
export default function NewSelect({ options, secOptionName, noLabel, border, heightBody, icon, top, action, topTitle, beforeLabel, onClick, disabled, id, idD, name, onChange, sideLabel, optionName, value, width, search, title, padding, margin, minWidth, error, required, accessor, fullName }) {
  const [select, setSelect] = useState(false)
  const [selectRef, setSelectRef] = useState(0)
  const [valueInput, setValueInput] = useState()
  const [selectBody, setSelectBody] = useState(0)
  const [newOption, setNewOption] = useState(false)
  const [bodyHeight, setBodyHeight] = useState('')
  useEffect(() => {
    setBodyHeight(window.screen.height)
  }, [])
    
  const inputSearch = useRef(null)
  const [refSelect, setRefSelect] = useState(false)
  // Render the main value
  const renderVal = data => {
    if (!data) return ''
    if (Array.isArray(optionName)) {
      let valueRender = ''
      optionName.forEach(x => {return valueRender = `${ valueRender } ${ (accessor && data[accessor]) ? data[accessor][x] : data[x] }`})
      return valueRender
    } return data[optionName]
  }
  // Render the second value
  const renderVal2 = data => {
    if (!data) return ''
    if (Array.isArray(secOptionName)) {
      let valueRender = ''
      secOptionName.forEach(x => {return valueRender = `${ valueRender } ${ (accessor && data[accessor]) ? data[accessor][x] : data[x] }`})
      return valueRender
    } return data[secOptionName]
  }
  /** Use Effect */
  useEffect(() => {
    setNewOption(options)
  }, [options])
  /** Use Effect */
  useEffect(() => {
    if (search) { select && inputSearch.current.focus() }
  }, [select, search])
  // Save the box reference */
  const changeRef = v => {
    setSelectRef(v.offsetTop + selectBody)
    setRefSelect(v)
  }
  // Selected value
  const changeValue = v => {
    setSelect(false)
    onChange({ target: { name, value: v[id] } }, !v[id], refSelect)
  }
  // Search
  const changeSearch = v => {
    setValueInput(v.target.value)
    const fil = options.filter(x => {return renderVal(x).toUpperCase().indexOf(v.target.value.toUpperCase()) > -1})
    setNewOption(fil)
  }
  // Function when clicking on the select
  const handleClick = e => {
    e.preventDefault()
    setSelect(!select)
    setTimeout(() => {return setNewOption(options)}, 500)
  }
  const handleBlur = () => {
    setTimeout(() => {return setSelect(false)}, 400)
    setTimeout(() => {return setNewOption(options)}, 300)
  }
  const handleClickAction = () => {
    setSelect(!select)
    onClick()
  }
  const val = options?.find(x => {return x[id] === value})
  return (
    <BoxSelect
      id={idD}
      margin={margin}
      minWidth={minWidth}
      padding={padding}
      ref={v => {return !!v && changeRef(v)}}
      width={width}
    >
      <Overline onClick={() => {return setSelect(false)}} show={select} />
      <MainButton
        border={border}
        color={val ? SFColor : '#757575'}
        disabled={disabled}
        error={error}
        height={heightBody}
        minWidth={minWidth}
        onClick={handleClick}
        type='button'
        value={value}
      >
        <SpanText noLabel={noLabel}>{renderVal(val)} {renderVal2(val)} {val && sideLabel}</SpanText>
        {icon && <IconSel>
          <IconArrowBottom color={error ? BGColor : SEGColor} size='15px' />
        </IconSel>}
      </MainButton>
      {<LabelInput
        error={error}
        noLabel={noLabel}
        topTitle={topTitle}
        value={value}
      >{title}</LabelInput>}
      {error && <Tooltip>This field must not be empty</Tooltip>}
      <ContainerItems active={select} top={top} >
        {search && <> <InputText
          onChange={changeSearch}
          placeholder='Search here ...'
          ref={inputSearch}
          value={valueInput || ''}
        /> </>}
        {action && <ButtonAction onClick={() => {return handleClickAction() || undefined}} type='button'><IconPlus color={PColor} size='15px' /> Add new {<>{!newOption.length && valueInput}</>}</ButtonAction>}
        <ContentBox search={search} style={{ zIndex: '9999999' }}>
          <BoxOptions
            autoHeight
            autoHeightMax='200px'
            autoHeightMin={0}
            autoHideDuration={700}
            autoHideTimeout={1500}
            bottom={selectRef > bodyHeight}
            fullName={fullName}
            nodata={newOption.length > 0}
            onBlur={handleBlur}
            ref={v => {return setSelectBody(!!v && v.offsetHeight)}}
            search={search}
            style={{ width: '100%', overflowY: 'auto' }}
            top={selectRef < bodyHeight}
          >
            {newOption.length
              ? newOption.map(x => {return <CustomButtonS
                key={x[id]}
                onClick={() => {return changeValue(x)}}
                option
                type='button'
              > {beforeLabel} {`${ renderVal(x) }  ${ renderVal2(secOptionName ? x : null) }`} {sideLabel}</CustomButtonS>})
              : <TextNotResult><IconLocationMap color={PColor} size='15' /> No hay resultados</TextNotResult>
            }
          </BoxOptions>
        </ContentBox>
      </ContainerItems>
      <input
        data-required={required}
        id={id}
        name={name}
        type='hidden'
        value={value || ''}
      />
      <IconWarning
        color={PColor}
        size={20}
        style={{ position: 'absolute', right: 5, bottom: 10, opacity: 0, pointerEvents: 'none' }}
      />
    </BoxSelect>
  )
}
const BoxSelect = styled.div`
    display: flex;
    flex-direction: column;
    place-content: center;
    justify-content: center;
    align-items: center;
    min-width: ${ ({ minWidth }) => {return minWidth || 'auto'} };
    width: ${ ({ width }) => {return width || '100%'} };
    border-radius: ${ ({ radius }) => {return radius || '0px'} };
    ${ ({ padding }) => {return !!padding && css`padding: ${ padding };`} }
    position: relative;
`
const ButtonAction = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    text-align: left;
    height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: PFont-Light;
    width: 100%;
    font-size: 16px;
    line-height: 20px;
    color: rgb(57, 58, 61);
    background-color: rgb(212, 215, 220);
    &:hover {
      background-color: rgb(44, 160, 28);
      color: ${ BGColor };
    }
    &:hover > svg {
      fill: ${ BGColor };
    }
`
const LabelInput = styled.label`
    position: absolute;
    transition: .2s ease;
    text-align: left;
    font-size: ${ ({ value }) => {return value ? '1rem' : '16px'} };
    top: ${ ({ value, topTitle }) => {return value ? '-4px' : topTitle ? topTitle : '15px'} };
    left: ${ ({ value }) => {return value ? '-8px' : '10px'} };
    color: ${ ({ value, error }) => {return value ? SFColor : (error ? BGColor : SFVColor)} };
    pointer-events: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 80%;
    font-family: PFont-Light;
    background-color: 'transparent';
    padding-left: ${ ({ value }) => {return value ? '10px' : '0px'} };
    @media only screen and (max-width: 960px) {
     top: 12px;
    }
    ${ props => {return props.noLabel && css`
    top: 13px;
    font-size: 15px;
    color: ${ BColor };
    font-family: PFont-Regular;
    background-color: transparent;
    `} }
    `
const ContainerItems = styled.div`
  position: absolute;
  /* top: 98%; */
  top: ${ ({ top }) => {return top || '100%'} };
  z-index: 4;
  left: 0;
  transform-origin: 200% 50%;
  transition: .2s ease;
  z-index: 999 !important;
  box-shadow: hsl(0,0%,80%);
  transform-origin: top left;
    ${ ({ active }) => {return active
    ? css`
        display: block;
        `
    : css`
        display: none;
          `} }
`
const Tooltip = styled.div`
    position: absolute;
    display: block;
    right: 5px;
    bottom: 100%;
    background-color: ${ PColor };
    padding: 0 10px;
    border-radius: 2px;
    z-index: 10;
    font-size: 11px;
    color: #ffffff;
    &::after, &::before {
        top: 100%;
        left: 90%;
        border: solid transparent;
        content: "";
        position: absolute;
        pointer-events: none;
    }
    &::after {
        border-top-color: ${ PColor };
        border-width: 4px;
    }
    &::before {
        border-top-color: ${ PColor };
        border-width: 5px;
        margin-left: -1px;
    }
`
const IconSel = styled.div`
  position: absolute;
  right: 8px;
  top: 30%;
  width: min-content;
  pointer-events: none;
`
// Select
const MainButton = styled.button`
    position: relative;
    display: block;
    background-color: ${ ({ bgColor, disabled, error }) => {return disabled ? 'rgba(239, 239, 239, 0.3)' : (error ? EColor : (bgColor || '#fff'))} };
    border: ${ ({ border }) => {return border || `1px solid ${ SFVColor }`} };
    text-align: left;
    height: ${ ({ height }) => {return height || '45px'} };
    white-space: nowrap;
    border-radius: 2px;
    outline: none;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: PFont-Light;
    color: ${ ({ color }) => {return color || SFColor} };
    width: ${ ({ width }) => {return width || '100%'} };
    &:hover {
        background-color: ${ '#f4f4f4' };
        color: ${ PColor };
        cursor: ${ ({ disabled }) => {return disabled ? 'no-drop' : 'pointer'} };
        ${ ({ hover }) => {return hover && css`color: ${ PVColor };`} }
    }
    &:hover > ${ IconSel }{
        background-color: ${ '#f4f4f4' };
        color: ${ PColor };
        cursor: ${ ({ disabled }) => {return disabled ? 'no-drop' : 'pointer'} };
        ${ ({ hover }) => {return hover && css`color: ${ PVColor };`} }
    }
    &:hover ~ ${ Tooltip } { display: block;  }
    &:focus { border: 2px solid ${ PColor }; }
    &:focus > svg { fill: ${ PLColor }; }
`
const CustomButtonS = styled.button`
    position: relative;
    display: block;
    background-color: ${ ({ bgColor, disabled, error }) => {return disabled ? 'rgba(239, 239, 239, 0.3)' : (error ? EColor : (bgColor || '#fff'))} };
    outline: 0;
    border-bottom: ${ ({ border }) => {return border || `1px solid ${ SFVColor }`} };
    text-align: left;
    height: ${ ({ height }) => {return height || '45px'} };
    white-space: nowrap;
    border-radius: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: PFont-Light;
    color: ${ ({ color }) => {return color || SFColor} };
    width: ${ ({ width }) => {return width || '100%'} };
    &:hover {
        background-color: ${ '#f4f4f4' };
        color: ${ PColor };
        cursor: ${ ({ disabled }) => {return disabled ? 'no-drop' : 'pointer'} };
        ${ ({ hover }) => {return hover && css`color: ${ PVColor };`} }
    }
    &:hover ~ ${ Tooltip } { display: block;  }
    &:focus { border: 1px solid ${ PColor }; }
`

const BoxOptions = styled.div`
    bottom: ${ ({ bottom }) => {return bottom || '0'} };
    top: ${ ({ top, search }) => {return (top && search) ? '0%' : '0'} };
    width: 100%;
    min-width: ${ props => {return props.fullName ? 'min-content' : 'auto'} };
    background-color: ${ BGColor };
    border: 1px solid #cccccc50;
    overflow-y: auto;
    height: ${ ({ heightBox, search }) => {return (heightBox && search) ? 'min-content' : 'min-content'} };
    z-index: 20078;
    max-height: 300px;
`
const ContentBox = styled.div`
    bottom: ${ ({ search }) => {return (search) ? '-20px' : '0'} };
`
const SpanText = styled.label`
    font-size: 14px;
    color: ${ SFColor };
    ${ props => {return props.noLabel && css`
    display: none;
    `} }
`
const TextNotResult = styled.span`
    font-size: 10px;
    color: ${ SEGColor };
    padding: 0 10px; 
    display: flex;
    align-items: center;
    justify-content: center;
`
// Input Text (search engine)
export const InputText = styled.input`
    width: 100%;
    margin: 0;
    padding: 10px 8px;
    outline: none;
    border: 1px solid #CCC;
    font-size: 12px;
`
NewSelect.propTypes = {
  options: PropTypes.array,
  disabled: PropTypes.bool,
  id: (PropTypes.string || PropTypes.number).isRequired,
  idD: (PropTypes.string || PropTypes.number),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number || PropTypes.string,
  width: PropTypes.string,
  search: PropTypes.bool,
  title: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string,
  minWidth: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  accessor: PropTypes.string,
  border: PropTypes.string,
  fullName: PropTypes.bool
}
