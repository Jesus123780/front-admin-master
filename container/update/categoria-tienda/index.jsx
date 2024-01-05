import { useMutation, useQuery } from '@apollo/client'
import { Context } from 'context/Context'
import {
    CREATE_CAT_STORE,
    GET_ALL_CAT_STORE,
    SET_DES_CAT
} from 'gql/catStore'
import { useContext, useState } from 'react'
import { CategoriesStoreComponent } from 'components/Update/CategoriesStore'
import { Loading } from 'pkg-components'
export const CategoriesStore = () => {
    // ------------ ESTADOS ------------
    const [errors, setErrors] = useState({})
    const [values, setValues] = useState({})
    //-----------QUERIES ------------
    const [registerCategoryStore, { loading }] = useMutation(CREATE_CAT_STORE)
    const { data } = useQuery(GET_ALL_CAT_STORE)
    const { setAlertBox } = useContext(Context)
    const [desCategoryStore, { loading: loadingDes }] = useMutation(SET_DES_CAT)
    // ------------ HANDLES ------------
    const handleChange = (e, error) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: error })
    }
    // Contexto de las notificaciones
    const handleRegister = async e => {
        e.preventDefault()
        const { csDescription, cName } = values
        if (!csDescription ||  !cName)  {
            setErrors({ csDescription: true, cName: true })
            return setAlertBox({ message: 'complete el formulario' })
        }
        try {
            return registerCategoryStore({
                variables: {
                    input: { 
                        cState: 1, 
                        cName: cName,
                        csDescription: csDescription
                    }
                }, update(cache) {
                    cache.modify({
                        fields: {
                            getAllCatStore(dataOld = []) {
                                return cache.writeQuery({ query: GET_ALL_CAT_STORE, data: dataOld })
                            }
                        }
                    })
                }
            }).catch(err => setAlertBox({ message: `${err}`, duration: 7000 }))
        }
        catch (error) {
            setAlertBox({ message: `${error.message}`, duration: 7000 })
        }
    }
    const handleDelete = cat => {
        if (!cat) return setAlertBox({ message: 'No pudo ser eliminado, intenta nuevamente' })
        const { catStore } = cat || {}
        const category = data?.getAllCatStore?.find(x => (x.catStore === catStore))
        if (!category) return setAlertBox({ message: 'No pudo ser eliminado, intenta nuevamente' })
        const cState = category.cState
        return setAlertBox({ message: `${cState}` })

    }
    const handleToggle = (e, catStore) => {
        try {
            const { checked } = e.target
            desCategoryStore({
                variables: { 
                    catStore: catStore, 
                    cState: checked ? 0 : 1
                 }, update(cache) {
                    cache.modify({
                        fields: {
                            getAllCatStore(dataOld = []) {
                                const newCatStore = dataOld.map((cate) => {
                                    if (cate.catStore === catStore) {
                                        return {
                                            ...cate,
                                            cState: checked ? 1 : 0
                                        }
                                    } else {
                                        return { ...cate }
                                    }
                                })
                                return newCatStore
                            }
                        }
                    })
                }
            }).catch(err => console.log(err))
        } catch (error) {
            setAlertBox({ message: 'Ha ocurrido un error, intenta de nuevo' })
        }
    }
    return (
        <>
        {loadingDes && <Loading /> }
            <CategoriesStoreComponent
                handleChange={handleChange}
                handleRegister={handleRegister}
                handleToggle={handleToggle}
                values={values}
                loading={loading}
                errors={errors}
                handleDelete={handleDelete}
                data={data?.getAllCatStore || []}
            />
        </>
    )
}
CategoriesStore.propTypes = {
}