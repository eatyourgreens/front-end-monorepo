import { Box } from 'grommet'
import { Cube } from './Cube.js'
import { object } from 'prop-types'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  background-color: #000000;
  position: relative;
  width: 100%;
  margin-top: -50px;
`

export const ComponentPreview = ({ models }) => {
  return (
    <StyledBox className='volume-cube'>
      <Cube {...models} orbitControlsEnabled={false} />
    </StyledBox>
  )
}

ComponentPreview.propTypes = {
  models: object
}
