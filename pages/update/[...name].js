import {
  Banners,
  Card,
  CategoriesStore,
  Location,
  Notification,
  Pqr,
  PromoBannerDashboard,
  PromosBanner,
  Stores
} from 'container'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Login ({ ...args }) {
  const router = useRouter()
  const { name } = router.query || {}
  const props = {
    args
  }
  const rutesUpdate = {
    location: <Location {...props} />,
    banners: <Banners {...props} />,
    notification: <Notification {...props} />,
    promos: <PromosBanner {...props} />,
    stores: <Stores {...props} />,
    Pqr: <Pqr {...props} />,
    categories: <CategoriesStore {...props} />,
    card: <Card {...props} />,
    'promos-dashboard': <PromoBannerDashboard {...props} />
  }
  return (
    <div>
      <Head>
        <title>{process.env.NEXT_NAME_APP || ''}</title>
        <meta content='' name='description' />
      </Head>
      {name && name.length > 0 && rutesUpdate[name[0]]}
    </div>
  )
}
