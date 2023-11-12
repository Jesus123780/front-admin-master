import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client'
import { Context } from 'context/Context'
import { GET_ALL_CITIES, GET_ALL_COUNTRIES, GET_ALL_DEPARTMENTS, GET_ONE_COUNTRY } from 'gql/Location'
import { useStoreAdmin } from 'hooks/useStoreAdmin'
import { useRouter } from 'next/router'
import { NewSelect } from 'pkg-components'
import { BColor, PColor } from 'public/colors'
import { IconArrowLeft, IconLogo, IconLogout } from 'public/icons'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { URL_BASE } from '../../../apollo/urls'
import {
  ActionContent,
  Button,
  ButtonGlobalCreate,
  ContainerHeader,
  CtnSwitch,
  SwitchOption
} from './styled'

export const Header = () => {
  const Router = useRouter()
  const { client } = useApolloClient()
  const { Location } = useContext(Context)
  const onClickLogout = useCallback(async () => {
    localStorage.removeItem('location.data')
    await window
      .fetch(`${URL_BASE}auth/logout/`, {})
      .then(res => {
        if (res) {
          client?.clearStore()
          Router.replace('/')
        }
      })
      .catch(() => {
        console.log({
          message: 'Se ha producido un error.',
          duration: 30000,
          color: 'error'
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])
  const [values, setValues] = useState({})
  const [dataStoreReport] = useStoreAdmin()
  const { data: dataCountries } = useQuery(GET_ALL_COUNTRIES)
  const [getDepartments, { data: dataDepartments }] = useLazyQuery(GET_ALL_DEPARTMENTS)
  const [getCities, { data: dataCities }] = useLazyQuery(GET_ALL_CITIES)
  const [getOneCountry, { data: dataOneCountry }] = useLazyQuery(GET_ONE_COUNTRY)
  const handleChangeLocation = (e, error) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const handleChangeSearch = e => {
    if (show === true) {
      if (e.target.name === 'countryId') getDepartments({ variables: { cId: e.target.value } })
      else if (e.target.name === 'dId') getCities({ variables: { dId: e.target.value } })
      handleChangeLocation(e)
    }
  }
  const [show, setShow] = useState(false)
  const departments = dataDepartments?.departments || []
  const countries = useMemo(() => {return dataCountries?.countries}, [dataCountries?.countries])
  const cities = dataCities?.cities || []
  useEffect(() => {
    if (show === true) {
      getOneCountry({ variables: { cId: values?.countryId || Location.countryId } })
      // useUseLocation(values?.countryId, values.dId, values.ctId)
    }
  }, [values, dataOneCountry, countries, show, getOneCountry, Location.countryId])
  const { cName } = dataOneCountry?.getOneCountry || {}
  return (
    <header>
      <ContainerHeader>
        <Button onClick={() => {return Router.back()}}>
          <IconArrowLeft color={BColor} size='30px' />
                    Volver
        </Button>
        <ButtonGlobalCreate onClick={() => {return setShow(!show)}}>
                    Filtro por {cName}
        </ButtonGlobalCreate>
        <CtnSwitch>
          {!!dataCountries && <SwitchOption show={show}>
            {show && <>
              <NewSelect
                action
                id='cId'
                name='countryId'
                onChange={handleChangeSearch}
                onClick={() => {return console.log('first')}}
                optionName={['cCalCod', 'cName']}
                options={countries}
                value={values?.countryId || Location.countryId}
                width='100%'
              />
              <NewSelect
                action
                id='dId'
                name='dId'
                onChange={handleChangeSearch}
                onClick={() => {return console.log('first')}}
                optionName='dName'
                options={departments}
                value={values?.dId || Location.department}
                width='100%'
              />
              <NewSelect
                action
                id='ctId'
                name='ctId'
                onChange={handleChangeSearch}
                onClick={() => {return console.log('first')}}
                optionName='cName'
                options={cities}
                value={values?.ctId || Location.city}
                width='100%'
              />
            </>}
          </SwitchOption>}
        </CtnSwitch>
        <ActionContent style={{ margin: '10px', fontSize: '20px' }}>{dataStoreReport?.count || 0}</ActionContent>
        <IconLogo color={PColor} size='50px' />
        <ActionContent></ActionContent>
        <ActionContent>
          <Button onClick={() => {return onClickLogout()}}>
            <IconLogout color={PColor} size='20px' />
          </Button>
        </ActionContent>
      </ContainerHeader>
    </header>
  )
}
