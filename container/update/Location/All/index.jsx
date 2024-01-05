import { LoadEllipsis } from 'components/LoadingButton'
import { BGColor } from 'public/colors'
import { NewSelect } from 'pkg-components'

import { ButtonSubmit, Content } from './styled'
export const Location = ({ handleChange, onChangeSearch, countries, cities, departments, road, valuesForm, errorForm, loading }) => {
    return (
        <div style={{ display: 'flex',  justifyContent: 'center', placeItems: 'center' }}>
                <NewSelect name='countryId' options={countries} id='cId' onChange={onChangeSearch} error={errorForm?.countryId} optionName='cName' value={valuesForm?.countryId} title='País' required />
                <NewSelect name='dId' options={departments} id='dId' onChange={onChangeSearch} error={errorForm?.dId} optionName='dName' value={valuesForm?.dId} title='Departamento' required />
                <NewSelect name='ctId' options={cities} id='ctId' onChange={handleChange} error={errorForm?.ctId} optionName='cName' value={valuesForm?.ctId} title='Ciudad' required />
                <NewSelect name='rId' options={road} id='rId' onChange={handleChange} error={errorForm?.rId} optionName='rName' value={valuesForm?.rId} title='Tipo de via' required />
                <ButtonSubmit type='submit' >{loading ? <LoadEllipsis color={BGColor} /> : 'Registrar'} </ButtonSubmit>
        </div>
    )
}