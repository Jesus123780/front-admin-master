import ReactDOM from 'react-dom'
import { useState } from 'react'
import { Rate } from '../../Rate'
import NewSelect from '../../NewSelectHooks/NewSelect'
import { numberFormat } from '../../../utils'
import { RippleButton } from '../../Ripple'
import { Container, FormProducts, CardOne, CardProduct, Card, ColumnCard } from './styled'
import { Skeleton } from '../../Skeleton/SkeletonCard'
import { IconArrowRight, IconDelete, IconEdit, IconLove } from '../../../public/icons'
import { APColor, PColor, PVColor, SEGColor } from '../../../public/colors'
import InputHooks from '../../InputHooks/InputHooks'
import { StatusToggle } from '../../Table'

export const CategoriesStoreComponent = ({ values, handleRegister, handleChange, handleDelete, data, handleToggle }) => {
  const [modal, setModal] = useState(0)
  const handleClickModal = index => {return setModal(index === modal ? true : index)}
  return (<div>
    <Container>
      <CardOne>
        <FormProducts onSubmit={handleRegister}>
          <InputHooks
            name='cName'
            onChange={handleChange}
            range={{ min: 0, max: 180 }}
            required
            title='Nombre'
            type='text'
            value={values.cName}
          />
          <InputHooks
            name='csDescription'
            onChange={handleChange}
            range={{ min: 0, max: 180 }}
            required
            title='Description'
            value={values.csDescription}
          />
          <RippleButton
            bgColor={APColor}
            margin='20px auto'
            type='submit'
            widthButton='100%'
          >Subir</RippleButton>
        </FormProducts>
      </CardOne>
      <ColumnCard>
        {data.map(x => {return (
          <Card height='100px' key={x.catStore}>
            <div>
              {x.cName}
            </div>
            <div>
              {x.csDescription}
            </div>
            <StatusToggle
              id={x?.catStore}
              onChange={e => {return handleToggle(e, x?.catStore)}}
              state={x?.cState === 1}
            />
          </Card>
        )})}
      </ColumnCard>
    </Container>
  </div>
  )
}
export const SkeletonP = () => {
  return <>
    <>
      {[1, 2, 3, 4].map((x, i) => {return (
        <CardProduct key={i + 1}>
          <Skeleton />
        </CardProduct>
      )})}
    </>
  </>
}