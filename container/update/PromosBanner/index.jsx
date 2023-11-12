import { useMutation, useQuery } from "@apollo/client"
import CustomSlider from "components/Slider"
import { GET_ALL_BANNERS, GET_ALL_BANNERS_PROMO } from "gql/getBanners"
import Image from "next/image"
import Link from "next/link"
import { PColor } from "public/colors"
import { IconDelete } from "public/icons"
import { SwiperSlide } from "swiper/react"
import { updateCache } from "utils"
import { DELETE_BANNERS, DELETE_BANNERS_MASTER } from "./querys"
import {
  BannerPromo,
  CardPromo,
  ContainerCardProduct,
  ContainerSliderPromo,
  Content,
  ImageBannerPromo,
  Text,
} from "./styled"

export const PromosBanner = () => {
  // HANDLES
  const { data } = useQuery(GET_ALL_BANNERS, {})
  const [deleteOneBannerMaster] = useMutation(DELETE_BANNERS_MASTER, {})
  return (
    <Content>
      <ContainerCardProduct>
        <CustomSlider
          spaceBetween={35}
          centeredSlides
          infinite={false}
          autoplay={false}
          slidesToShow={4}
          direction="horizontal"
        >
          {data?.getAllMasterBanners?.map((banner) => (
            <SwiperSlide style={{ margin: "20px" }} key={banner.BannerId}>
              <CardPromo height={"200px"}>
                <div className="goto-action">
                  <Link
                    href={`${
                      process.env.MAIN_URL_BASE
                    }/restaurantes/promos/${banner.name.replace(/\s/g, "-")}/${
                      banner.BannerId
                    }`}
                  >
                    <a target="_blank">
                      <BannerPromo key={banner.pId}>
                        <Image
                          width={300}
                          height={80}
                          objectFit="contain"
                          src={"/images/DEFAULTBANNER.png"}
                          alt={banner.description}
                        />
                      </BannerPromo>
                    </a>
                  </Link>
                  <button
                    className="btn btn-delete-master-banner"
                    onClick={() =>
                      deleteOneBannerMaster({
                        variables: { id: banner.BannerId },
                        update: (cache, { data: { getAllMasterBanners } }) =>
                          updateCache({
                            cache,
                            query: GET_ALL_BANNERS,
                            nameFun: "getAllMasterBanners",
                            dataNew: getAllMasterBanners,
                          }),
                      })
                    }
                  >
                    <IconDelete color={PColor} size="30px" />
                  </button>
                </div>
              </CardPromo>
            </SwiperSlide>
          ))}
        </CustomSlider>
      </ContainerCardProduct>
    </Content>
  )
}

export const PromoBannerStores = () => {
  const [deleteOneBannerPromo] = useMutation(DELETE_BANNERS, {
    context: { clientName: "admin-server" },
  })
  const { data: datapro } = useQuery(GET_ALL_BANNERS_PROMO, {
    context: { clientName: "admin-server" },
  })
  const chartColor = [
    "rgba(1,25,71, 0.0001)",
    "rgb(1,25,71)",
    "rgb(255 0 0 / 0%)",
  ]
  const final = `0deg, ${
    chartColor[(Math.random() * (3 - 0) + 0).toFixed(0)]
  } 0%, ${chartColor[(Math.random() * (3 - 0) + 0).toFixed(0)]} 100%`
  return (
    <ContainerSliderPromo>
      {datapro?.getAllPromoBanners?.map((pb) => (
        <CardPromo final={final} key={pb.bpId}>
          <ImageBannerPromo src={pb.path} alt={pb.description} />
          <div className="goto-action">
            <Text>{pb.name}</Text>
            <button
              className="btn"
              onClick={() =>
                deleteOneBannerPromo({
                  variables: {
                    bpId: pb.bpId,
                    bpState: pb.bpState,
                    path: pb.name,
                  },
                  update: (cache, { data: { getAllPromoBanners } }) =>
                    updateCache({
                      cache,
                      query: GET_ALL_BANNERS_PROMO,
                      nameFun: "getAllPromoBanners",
                      dataNew: getAllPromoBanners,
                    }),
                })
              }
            >
              <IconDelete color={PColor} size="30px" />
            </button>
          </div>
        </CardPromo>
      ))}
    </ContainerSliderPromo>
  )
}
