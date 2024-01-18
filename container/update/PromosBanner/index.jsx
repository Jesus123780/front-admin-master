import { useMutation, useQuery } from '@apollo/client'
import CustomSlider from 'components/Slider'
import { GET_ALL_BANNERS, GET_ALL_BANNERS_PROMO } from 'gql/getBanners'
import Image from 'next/image'
import Link from 'next/link'
import { BColor, PColor, Text } from 'pkg-components'
import { IconDelete } from 'public/icons'
import { SwiperSlide } from 'swiper/react'
import { updateCache } from 'utils'
import { DELETE_BANNERS, DELETE_BANNERS_MASTER } from './querys'
import {
  BannerPromo,
  CardPromo,
  ContainerCardProduct,
  ContainerSliderPromo,
  Content,
  ImageBannerPromo
} from './styled'

export const PromosBanner = () => {
  // HANDLES
  const { data } = useQuery(GET_ALL_BANNERS, {})
  const [deleteOneBannerMaster] = useMutation(DELETE_BANNERS_MASTER, {})
  const isValidImageUrl = (url) => {
    // Expresión regular para validar URLs con protocolo http o https
    const urlPattern = /^(http|https):\/\/.*$/
    // Expresión regular para validar extensiones de imagen comunes
    const imageExtensionPattern = /\.(jpg|jpeg|png|gif)$/i

    return urlPattern.test(url) && imageExtensionPattern.test(url)
  }

  return (
    <Content>
      <ContainerCardProduct>
        <CustomSlider
          autoplay={false}
          centeredSlides
          direction='horizontal'
          infinite={false}
          slidesToShow={4}
          spaceBetween={35}
        >
          {data?.getAllMasterBanners?.map((banner) => {
            return (
              <SwiperSlide key={banner.BannerId} style={{ margin: '20px' }}>
                <CardPromo height='200px'>
                  <div className='goto-action'>
                    <Link
                      href={`${
                        process.env.MAIN_URL_BASE
                      }/restaurantes/promos/${banner.name.replace(/\s/g, '-')}/${
                        banner.BannerId
                      }`}
                    >
                      <a target='_blank'>
                        <BannerPromo key={banner.pId}>
                          <Image
                            alt={banner.description}
                            height={180}
                            objectFit='contain'
                            src={isValidImageUrl(banner?.path) ? banner.path : '/images/DEFAULTBANNER.png'}
                            width={300}
                          />
                        </BannerPromo>
                        <Text color={BColor} fontSize='20px'>
                          {banner?.name}
                        </Text>
                      </a>
                    </Link>
                    <button
                      className='btn btn-delete-master-banner'
                      onClick={() => {
                        return deleteOneBannerMaster({
                          variables: { id: banner.BannerId },
                          update: (cache, { data: { getAllMasterBanners } }) => {
                            return updateCache({
                              cache,
                              query: GET_ALL_BANNERS,
                              nameFun: 'getAllMasterBanners',
                              dataNew: getAllMasterBanners
                            })
                          }
                        })
                      }
                      }
                    >
                      <IconDelete color={PColor} size='30px' />
                    </button>
                  </div>
                </CardPromo>
              </SwiperSlide>
            )
          })}
        </CustomSlider>
      </ContainerCardProduct>
    </Content>
  )
}

export const PromoBannerStores = () => {
  const [deleteOneBannerPromo] = useMutation(DELETE_BANNERS, {
    context: { clientName: 'admin-server' }
  })
  const { data: datapro } = useQuery(GET_ALL_BANNERS_PROMO, {
    context: { clientName: 'admin-server' }
  })
  const chartColor = [
    'rgba(1,25,71, 0.0001)',
    'rgb(1,25,71)',
    'rgb(255 0 0 / 0%)'
  ]
  const final = `0deg, ${
    chartColor[(Math.random() * (3 - 0) + 0).toFixed(0)]
  } 0%, ${chartColor[(Math.random() * (3 - 0) + 0).toFixed(0)]} 100%`
  return (
    <ContainerSliderPromo>
      {datapro?.getAllPromoBanners?.map((pb) => {
        return (
          <CardPromo final={final} key={pb.bpId}>
            <ImageBannerPromo alt={pb.description} src={pb.path} />
            <div className='goto-action'>
              <Text>{pb.name}</Text>
              <button
                className='btn'
                onClick={() => {
                  return deleteOneBannerPromo({
                    variables: {
                      bpId: pb.bpId,
                      bpState: pb.bpState,
                      path: pb.name
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
                }
              >
                <IconDelete color={PColor} size='30px' />
              </button>
            </div>
          </CardPromo>
        )
      })}
    </ContainerSliderPromo>
  )
}
