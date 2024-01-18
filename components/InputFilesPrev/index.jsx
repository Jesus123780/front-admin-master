/* eslint-disable consistent-return */
import PropTypes from 'prop-types'
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Context } from 'context/Context'
import styled, { css } from 'styled-components'
import { BGColor, EColor, PColor } from '../../public/colors'
import { IconDelete, IconExcel, IconPDF, IconWord } from '../../public/icons'
import useDropZone from './useDrag'
// import { Context } from'../../context'

export const InputFiles = ({ onChange, reset, Disable, MaximumSizeFiles, ShowMessage, imageOnly }) => {
  const { setAlertBox } = useContext(Context)
  const [images, setImages] = useState([])
  const [previewImg, setPreviewImg] = useState([])
  const fileInputRef = useRef(null)
  const [size, setsize] = useState(0)
  useEffect(() => {
    if (reset) {
      setImages([])
      setPreviewImg([])
    }
  }, [reset])
  const onFileInputChange = event => {
    const { files } = event.target
    if (imageOnly && !(/\.(jpg|png|gif)$/i).test(files[0]?.name)) return setAlertBox({ message: 'The file to be attached is not an image' })
    if (size >= MaximumSizeFiles) return
    if (size === 0) setImages([])
    setImages([...images, ...files])
    onChange([...images, ...files])
    onDropZone(files)
  }
  useEffect(() => {
    const size = Array.from(images).map(x => {
      const array = x.size
      return parseInt(array)
    })
    let totalSize = 0
    for (const i of size) {
      totalSize += i
      setsize(totalSize += i)
    }
    // 1M = 1048576 Bytes
    if (totalSize >= MaximumSizeFiles) return setAlertBox({ message: `The minimum weight is ${ShowMessage}`, duration: 8000, color: 'warning' })
  }, [images, size, setsize, previewImg, setImages])
  const onDropZone = useCallback((f) => {
    let newFiles = []
    for (let i = 0; i < f.length; i++) newFiles = [...newFiles, f[i]]
    let newFilesPreview = []
    for (let i = 0; i < newFiles.length; i++) {
      newFilesPreview = [
        ...newFilesPreview,
        {
          temPath: URL.createObjectURL(f[i]),
          name: f[i]?.name,
          ext: f[i]?.name?.substring(f[i]?.name?.lastIndexOf('.'), f[i]?.name?.length)
        }
      ]
    }

    setPreviewImg([
      ...previewImg,
      ...newFilesPreview
    ])
  },
  [images, setPreviewImg, setImages]
  )

  const handleDelete = (e, item, index) => {
    e.stopPropagation()
    const newImages = images.filter((x, i) => { return (x.name !== item.name && i !== index) })
    const previewNewImages = previewImg.filter((x, i) => { return (x.temPath !== item.temPath && i !== index) })
    setImages(newImages)
    setPreviewImg(previewNewImages)
  }

  const { isDragging, dropProps } = useDropZone(onDropZone)
  return (
    <Box {...dropProps}>
      {MaximumSizeFiles && <Label center={'start'}>  Maximum size: {ShowMessage} </Label>}
      <div>
        {!Disable && <InputFile
          id='dropZone'
          multiple
          onChange={onFileInputChange}
          ref={fileInputRef}
          type='file'
        />}
        <DropZone
          onClick={e => {
            e.stopPropagation()
            document.getElementById('dropZone')?.click()
          }}
        >
          {!previewImg?.length && (
            <>
              {isDragging ? <Label justify>drop the file</Label> : <Label justify>Drag Files Here<br></br>or<br></br>Click Here </Label>}
            </>
          )}
          {!!previewImg?.length && <Preview>

            {!!previewImg?.length && previewImg?.map((x, i) => {
              return (
                <Fragment key={i}>
                  <ImgCont title={x.name}>
                    <ButtonDelete onClick={e => { return handleDelete(e, x, i) }} type='button'>
                      <IconDelete color={EColor} size='15px' />
                    </ButtonDelete>
                    {(x.ext === '.png' || x.ext === '.svg' || x.ext === '.jpg' || x.ext === '.jpeg')
                      ? <Image src={x?.temPath} />
                      : (x.ext === '.doc' || x.ext === '.docm' || x.ext === '.dotx' || x.ext === '.dotm')
                        ? <IconWord size='250px' />
                        : (x.ext === '.pdf')
                          ? <IconPDF size='150px' />
                          : (x.ext === '.xlsx' || x.ext === '.xlsm' || x.ext === '.xlsb' || x.ext === '.xltx' || x.ext === '.xls')
                            ? <IconExcel size='250px' />
                            : <i>FILE COMUN</i>
                    }
                    <FileText>{x.name}</FileText>
                  </ImgCont>
                </Fragment>
              )
            })}
          </Preview>}
        </DropZone>
        {MaximumSizeFiles && <ProgressBarContainer><ProgressBar final={MaximumSizeFiles} progress={size} /></ProgressBarContainer>}

      </div>
    </Box>
  )
}

const Box = styled.div`
    display: block;
    ${({ width }) => { return width && css` width: ${width}; ` }}
    flex-direction: ${({ direction }) => { return (direction || 'row') }};
    position: relative;
    box-sizing: border-box;
`
const Label = styled.label`
    text-align: ${({ center }) => { return center || 'center' }}; 
    width: 100%;
    font-size: 15px;
    font-family: PFont-Light;
    box-sizing: border-box;
    cursor: pointer;
    ${props => {
    return props.justify && css`
      display: grid;
      place-content: center;
    `
  }}
`
const InputFile = styled.input`
    display: none;
`
const DropZone = styled.div`
    min-height: 100px;
    max-height: 200px;
    overflow: auto;
    cursor: pointer;
    background-color: ${({ theme }) => { return theme.TColor }};
    border: 2px dashed rgba(0, 0, 0, 0.1);
    display: grid;
    box-sizing: border-box;
`
const Preview = styled.div`
    position: relative;
    display: flex;
    vertical-align: top;
    margin: 16px;
    min-height: 100px;
    flex-flow: wrap;
`
const ImgCont = styled.div`
    border-radius: 4px;
    width: 25%;
    height: 25%;
    min-width: 80px;
    min-height: 80px;
    position: relative;
    z-index: 10;
    margin: 10px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: scale-down;
`
const FileText = styled.span`
    position: absolute;
    bottom: 0;
    color: #FFF;
    width: 100%;
    background-color: rgba(0,0,0,.7);
    padding: 2px;
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const ButtonDelete = styled.button`
    background-color: ${BGColor};
    border: none;
    outline: none;
    position: absolute;
    right: 4px;
    top: 0px;
    border-radius: 2px;
    padding: 2px 0;
    cursor: pointer;
`
const ProgressBarContainer = styled.div`
    display: flex;
    width: 100%;
    background-color: #f1f1f1;
    border: 1px solid #dfdfdf;
    padding: 4px;
    overflow: hidden;
    position: relative;
`
const ProgressBar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${PColor};
    height: 100%;
    width: ${props => { return (100 / props.final) * props.progress }}%;
    border-radius: 8px;
    transition: .2s;
    ${props => { return (props.final) <= props.progress && css`background-color: ${EColor};` }}
`
InputFiles.propTypes = {
  onChange: PropTypes.func.isRequired,
  Disable: PropTypes.bool,
  imageOnly: PropTypes.bool,
  MaximumSizeFiles: PropTypes.number,
  ShowMessage: PropTypes.string,
  reset: PropTypes.bool
}
