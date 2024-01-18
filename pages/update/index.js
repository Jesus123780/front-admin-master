import { Context } from 'context/Context'
import { Column, Row } from 'pkg-components'
import { IconHome } from 'public/icons'
import { useContext } from 'react'

const Update = () => {
  const { listRoutes } = useContext(Context)

  return (
    <Row
      flexWrap='wrap'
      justifyContent={'center'}
      margin='auto'
    >
      {listRoutes
        ? listRoutes.map((route, i) => {
          return (
            <Column
              activeClassName='active'
              border='1px solid'
              display={'flex'}
              height='100px'
              href={`/update/${route.name}` || '/'}
              key={i + 1}
              margin='10px'
              width={'20%'}
            >
              <div><IconHome size='15px' />{route.name} </div>
            </Column>
          )
        })
        : <div></div>}
    </Row>
  )
}

export default Update
