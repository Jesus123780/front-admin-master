import { useMutation } from '@apollo/client'
import { Container } from 'components/common/Reusable'
import { CREATE_BANNER_MAIN, CREATE_BANNER_PROMO } from 'container/dashboard/queries'
import { GET_ALL_BANNERS_PROMO } from 'gql/getBanners'
import { useFormTools } from 'npm-pkg-hook'
import {
  AwesomeModal,
  InputHooks,
  RippleButton
} from 'pkg-components'
import { useState } from 'react'
import { updateCache } from 'utils'
import { PromosBanner } from '../PromosBanner'
import { GET_ALL_BANNERS } from './queries'

export const Banners = () => {
  const [open, setOpen] = useState(false)
  const [openModalPromo, setOpenModalPromo] = useState(false)
  const [handleChange, handleSubmit, setDataValue, { dataForm, errorForm, setForcedError }] = useFormTools()
  const [setBanners] = useMutation(CREATE_BANNER_MAIN, {
  })

  const [setPromoBanners] = useMutation(CREATE_BANNER_PROMO, {
  })

  const initialState = { alt: '/ images/DEFAULTBANNER.png', src: '/images/DEFAULTBANNER.png' }
  const [{ alt, src }, setPreviewImg] = useState(initialState)

  const [selectedImage, setSelectedImage] = useState(null)
  const onFileInputChange = async event => {
    const { files } = event.target
    const file = event.target.files[0]
    setSelectedImage(file)
    setPreviewImg(
      files.length
        ? {
          src: URL.createObjectURL(files[0]),
          alt: files[0].name
        }
        : initialState
    )
  }

  // GET_ALL_BANNERS_PROMO
  const handleForm = (e, show) => {
    return handleSubmit({
      event: e,
      action: () => {
        if (show === 1) {
          return setPromoBanners({
            variables: {
              input: {
                description: dataForm.description,
                bpState: 1,
                name: dataForm.name

              }
            },
            update: (cache, { data: { getAllPromoBanners } }) => {
              return updateCache({
                cache,
                query: GET_ALL_BANNERS_PROMO,
                nameFun: 'getAllPromoBanners',
                dataNew: getAllPromoBanners
              })
            }
          })
        }
        return setBanners({
          variables: {
            input: {
              description: dataForm.description,
              BannersState: 1,
              name: dataForm.name,
              image: selectedImage
            }
          },
          update: (cache, { data: { getAllMasterBanners } }) => {
            return updateCache({
              cache,
              query: GET_ALL_BANNERS,
              nameFun: 'getAllMasterBanners',
              dataNew: getAllMasterBanners
            })
          }
        })
      },
      actionAfterSuccess: () => {
        setDataValue({})
      }
    })
  }
  const handleReset = () => {
    setOpen(!open)
  }
  const handleResetPromo = () => {
    setOpenModalPromo(!openModalPromo)
  }
  const handleSetOpenModalPromo = () => {
    setOpenModalPromo(!openModalPromo)
  }
  return (
    <Container>
      <PromosBanner />
      <RippleButton onClick={() => { return handleReset() }}>
        Adicionar Item
      </RippleButton>
      <AwesomeModal
        btnCancel={true}
        btnConfirm={false}
        customHeight='calc(100vh - 20vh)'
        footer={false}
        header={true}
        onCancel={() => { return false }}
        onHide={() => { return handleReset() }}
        padding='20px'
        show={open}
        size='medium'
        zIndex='99390'
      >
        <form
          onSubmit={(e) => { return handleForm(e) }}
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            height: '100%',
            flexDirection: 'column'
          }}
        >
          <div>
            <input
              onChange={onFileInputChange}
              style={{
                opacity: 0,
                position: 'absolute',
                height: '180px',
                left: 0
              }}
              type='file'
            />
            <img
              alt={alt}
              src={src}
              style={{ border: '3px dashed #f5cfd1', width: '100%', height: '180px', objectFit: 'contain' }}
            />
            <InputHooks
              errors={dataForm?.name}
              name='name'
              onChange={handleChange}
              required
              title='Nombre del banner'
              value={dataForm?.name}
            />
            <InputHooks
              errors={dataForm?.description}
              name='description'
              onChange={handleChange}
              required
              title='Description'
              value={dataForm?.description}
            />
          </div>
          <RippleButton type='submit' widthButton='100% '>Subir</RippleButton>
        </form>
      </AwesomeModal>
      {/* <PromoBannerStores /> */}
      <RippleButton onClick={() => { return handleSetOpenModalPromo() }}>Adicionar promo</RippleButton>
      <AwesomeModal
        btnCancel={true}
        btnConfirm={false}
        footer={false}
        header={true}
        onCancel={() => { return false }}
        onHide={() => { return handleResetPromo() }}
        padding='20px'
        show={openModalPromo}
        size='medium'
        zIndex='99390'
      >
        Banner PROMO
        <form onSubmit={(e) => { return handleForm(e, 1) }}>
          <InputHooks
            errors={dataForm?.name}
            name='name'
            onChange={handleChange}
            required
            title='Nombre del banner'
            value={dataForm?.name}
          />
          <InputHooks
            errors={dataForm?.description}
            name='description'
            onChange={handleChange}
            required
            title='Description'
            value={dataForm?.description}
          />
          <RippleButton
            type='submit'
            widthButton='100% '
          >Subir</RippleButton>
        </form>
      </AwesomeModal>
    </Container>
  )
}
