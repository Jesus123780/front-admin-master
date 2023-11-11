import { Context } from 'context/Context'
import { Column, Row } from 'pkg-components'
import { IconHome } from 'public/icons'
import { useContext } from 'react'

const Update = () => {
  const { listRoutes } = useContext(Context)

  return (
    <Row flexWrap='wrap' margin='auto' justifyContent={'center'}>
        {listRoutes ? listRoutes.map((route, i) => (
          <Column width={'20%'} display={'flex'} height='100px' border='1px solid' margin='10px' key={i + 1} activeClassName="active" href={`/update/${route.name}` || '/'}>
            <div><IconHome size='15px' />{route.name} </div>
          </Column>
        )) : <div></div>}
    </Row>
  )
}

export default Update