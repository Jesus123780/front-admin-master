import React from 'react'
import { Content } from './styled'
import { ButtonSubmit } from './styled'
import { BGColor } from '../../../../public/colors'
import { LoadEllipsis } from '../../../LoadingButton'
import NewSelect from 'components/NewSelectHooks/NewSelect'
export const Location = ({ handleChange, onChangeSearch, countries, cities, departments, road, valuesForm, errorForm, loading }) => {
  return (
    <h1>
      <Content>
        <NewSelect
          error={errorForm?.countryId}
          id='cId'
          name='countryId'
          onChange={onChangeSearch}
          optionName='cName'
          options={countries}
          required
          title='País'
          value={valuesForm?.countryId}
        />
        <NewSelect
          error={errorForm?.dId}
          id='dId'
          name='dId'
          onChange={onChangeSearch}
          optionName='dName'
          options={departments}
          required
          title='Departamento'
          value={valuesForm?.dId}
        />
        <NewSelect
          error={errorForm?.ctId}
          id='ctId'
          name='ctId'
          onChange={handleChange}
          optionName='cName'
          options={cities}
          required
          title='Ciudad'
          value={valuesForm?.ctId}
        />
        <NewSelect
          error={errorForm?.rId}
          id='rId'
          name='rId'
          onChange={handleChange}
          optionName='rName'
          options={road}
          required
          title='Tipo de via'
          value={valuesForm?.rId}
        />
        <ButtonSubmit type='submit' >{loading ? <LoadEllipsis color={BGColor} /> : 'Registrar'} </ButtonSubmit>
      </Content>
    </h1>
  )
}