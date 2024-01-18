import { TextH2Main } from 'components/common/h2'
import PropTypes from 'prop-types'
import { ShadowCardContainer } from './styles'

export const MainCard = ({ children, title, noneShadow, display, width }) => {
  return (
    <div style={{ display, width }}>
      <TextH2Main text={title} />
      {/* <HeadCard>{title}</HeadCard> */}
      <ShadowCardContainer noneShadow={noneShadow}>
        <div>
          {children}
        </div>
      </ShadowCardContainer>
    </div>
  )
}

MainCard.propTypes = {
  children: PropTypes.any,
  display: PropTypes.any,
  noneShadow: PropTypes.any,
  title: PropTypes.any,
  width: PropTypes.any
}
