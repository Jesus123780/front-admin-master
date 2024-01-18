import PropTypes from 'prop-types'
import {
  Container,
  FormProducts,
  CardOne,
  Card,
  ColumnCard
} from './styled'
import {
  InputHooks,
  Text,
  Checkbox,
  Column,
  Button,
  Row,
  PColor,
  motion,
  AnimatePresence,
  IconDelete
} from 'pkg-components'

export const CategoriesStoreComponent = ({
  data,
  errors = {},
  loading = false,
  values = {},
  handleChange = () => { },
  handleDelete = () => { },
  handleRegister = () => { },
  handleToggle = () => { }
}) => {
  return (<div>
    <Container>
      <CardOne>
        <FormProducts onSubmit={handleRegister}>
          <InputHooks
            error={errors.cName}
            name='cName'
            onChange={handleChange}
            range={{ min: 0, max: 180 }}
            required
            title='Nombre'
            type='text'
            value={values.cName}
          />
          <InputHooks
            error={errors.csDescription}
            name='csDescription'
            onChange={handleChange}
            range={{ min: 0, max: 180 }}
            required
            title='Description'
            value={values.csDescription}
          />
          <Button
            borderRadius='5px'
            loading={loading}
            margin='20px auto'
            primary
            type='submit'
            width='100%'
          >
            Subir
          </Button>
        </FormProducts>
      </CardOne>
      <ColumnCard>
        <AnimatePresence>
          {data.map(x => {
            const { csDescription, cName } = x || {}
            return (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                initial={{ opacity: 0, x: -50 }}
                key={x.catStore}
                positionTransition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
                transition={{ duration: 0.5 }}
              >
                <Card height='200px'>
                  <>
                    <Column className='card_wraper_text'>
                      <Column>
                        <Text
                          className='ellipsis-text'
                          color={'#272323'}
                          fontSize='18px'
                        >
                          {cName}
                        </Text>
                      </Column>
                    </Column>
                    <Column>
                      <Text className='ellipsis-text'>
                        {csDescription}
                      </Text>
                    </Column>
                  </>
                  <Row justifyContent='space-between'>
                    <Checkbox
                      checked={x?.cState === 1}
                      id={x?.catStore}
                      name={`__id_${x?.catStore}`}
                      onChange={e => { return handleToggle(e, x?.catStore) }}
                      state={x?.cState === 1}
                    />
                    <button
                      onClick={() => {
                        return handleDelete(x)
                      }}
                      style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <IconDelete color={PColor} size={30} />
                    </button>
                  </Row>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </ColumnCard>
    </Container>
  </div>
  )
}

CategoriesStoreComponent.propTypes = {
  data: PropTypes.shape({
    map: PropTypes.func
  }),
  handleChange: PropTypes.func,
  handleDelete: PropTypes.func,
  handleRegister: PropTypes.func,
  handleToggle: PropTypes.func,
  loading: PropTypes.bool,
  values: PropTypes.object,
  errors: PropTypes.object
}
