import { useMutation, useQuery } from '@apollo/client'
import { AwesomeModal } from 'components/AwesomeModal'
import { InputFiles } from 'components/InputFilesPrev'
import InputHooks from 'components/InputHooks/InputHooks'
import { RippleButton } from 'components/Ripple'
import { Container } from 'components/common/Reusable'
import { CREATE_BANNER_MAIN, CREATE_BANNER_PROMO } from 'container/dashboard/queries'
import { PromoBannerStores, PromosBanner } from 'container/update/PromosBanner'
import { GET_ALL_BANNERS_PROMO } from 'gql/getBanners'
import { useFormTools } from 'npm-pkg-hook'
import { useState } from 'react'
import { updateCache } from 'utils'
import { GET_ALL_BANNERS, GET_ALL_RESTAURANT } from './queries'

export const Banners = () => {
  const [open, setOpen] = useState(false)
  const [openModalPromo, setOpenModalPromo] = useState(false)
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [reset, setReset] = useState(false)
  const [handleChange, handleSubmit, setDataValue, { dataForm, errorForm, setForcedError }] = useFormTools()
  const [setBanners, { error: Error }] = useMutation(CREATE_BANNER_MAIN, {
  })
  const [setPromoBanners] = useMutation(CREATE_BANNER_PROMO, {
  })
  const { data, loading } = useQuery(GET_ALL_BANNERS, {
  })
  const { data: dataListStore, fetchMore } = useQuery(GET_ALL_RESTAURANT, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    refetchWritePolicy: 'merge',
    context: { clientName: "admin-store" }

  })
  const handleFileChange = async (param) => {
    setImage(param[0])
    setName(param.name)
  }
  const handleFileChange2 = async (param) => {
    setName(param.name)
    setImage(param[0])
  }
  // GET_ALL_BANNERS_PROMO
  const handleForm = (e, show) => handleSubmit({
    event: e,
    action: () => {
      if (show === 1) {
        return setPromoBanners({
          variables: {
            input: {
              description: dataForm.description,
              bpState: 1,
              name: dataForm.name,
              image: image,
            }
          }, update: (cache, { data: { getAllPromoBanners } }) => updateCache({
            cache,
            query: GET_ALL_BANNERS_PROMO,
            nameFun: 'getAllPromoBanners',
            dataNew: getAllPromoBanners
          })
        })
      }
      else {
        return setBanners({
          variables: {
            input: {
              description: dataForm.description,
              BannersState: 1,
              name: dataForm.name,
              image: image,
            }
          }, update: (cache, { data: { getAllMasterBanners } }) => updateCache({
            cache,
            query: GET_ALL_BANNERS,
            nameFun: 'getAllMasterBanners',
            dataNew: getAllMasterBanners
          })
        }).then(res => {
          if (res) {
          }
        }).catch(e => {
        })
      }
    },
    actionAfterSuccess: () => {
      setDataValue({})
      setReset(true)
    }
  })
  const handleReset = () => {
    setOpen(!open)
    setReset(true)
  }
  const handleResetPromo = () => {
    setOpenModalPromo(!openModalPromo)
    setReset(true)
  }
  const handleSetOpenModalPromo = () => {
    setReset(false)
    setOpenModalPromo(!openModalPromo)
  }
  return (
    <Container>
      <PromosBanner />
      <RippleButton onClick={() => handleReset()}>Adicionar Item</RippleButton>
      <AwesomeModal zIndex='99390' padding='20px' show={open} onHide={() => handleReset} onCancel={() => false} size='medium' btnCancel={true} btnConfirm={false} header={true} footer={false} >
        Banners
        <form onSubmit={(e) => handleForm(e)}>
          <InputHooks
            title='Nombre del banner'
            required
            errors={dataForm?.name}
            value={dataForm?.name}
            onChange={handleChange}
            name='name'
          />
          <InputHooks
            title='Description'
            required
            errors={dataForm?.description}
            value={dataForm?.description}
            onChange={handleChange}
            name='description'
          />
          <RippleButton type='submit' widthButton='100% '>Subir</RippleButton>
        </form>
      </AwesomeModal>
      <PromoBannerStores />
      <RippleButton onClick={() => handleSetOpenModalPromo()}>Adicionar promo</RippleButton>
      {/* Adicionar promos */}
      <AwesomeModal zIndex='99390' padding='20px' show={openModalPromo} onHide={() => handleResetPromo()} onCancel={() => false} size='medium' btnCancel={true} btnConfirm={false} header={true} footer={false} >
        Banner PROMO
        <form onSubmit={(e) => handleForm(e, 1)}>
          <InputFiles Disable={false} onChange={handleFileChange2} reset={reset} />
          <InputHooks
            title='Nombre del banner'
            required
            errors={dataForm?.name}
            value={dataForm?.name}
            onChange={handleChange}
            name='name'
          />
          <InputHooks
            title='Description'
            required
            errors={dataForm?.description}
            value={dataForm?.description}
            onChange={handleChange}
            name='description'
          />
          <RippleButton type='submit' widthButton='100% ' onClick={() => setReset(true)}>Subir</RippleButton>
        </form>
      </AwesomeModal>
    </Container>
  )
}
