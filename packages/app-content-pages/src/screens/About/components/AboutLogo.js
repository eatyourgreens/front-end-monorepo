import styled, { css, useTheme } from 'styled-components'
import { Box } from 'grommet'
import ZooniverseLogo from '@zooniverse/react-components/ZooniverseLogo'

const LeftElement = styled(Box)`
  position: relative;
  width: calc(50% - 40px);

  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: calc(50% - 5px);
    width: 100%;
    height: 6px;
    ${props =>
      props.theme.dark
        ? css`
            background: linear-gradient(
              -90deg,
              transparent 0%,
              ${props.theme.global.colors['accent-1']} 5%,
              ${props.theme.global.colors['accent-1']} 70%,
              transparent 100%
            );
          `
        : css`
            background: linear-gradient(
              -90deg,
              transparent 0%,
              ${props.theme.global.colors['neutral-1']} 5%,
              ${props.theme.global.colors['neutral-1']} 70%,
              transparent 100%
            );
          `}
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: calc(50% + 2px);
    width: 95%;
    height: 3px;
    ${props =>
      props.theme.dark
        ? css`
            background: linear-gradient(
              -90deg,
              transparent 0%,
              ${props.theme.global.colors['accent-1']} 5%,
              ${props.theme.global.colors['accent-1']} 70%,
              transparent 100%
            );
          `
        : css`
            background: linear-gradient(
              -90deg,
              transparent 0%,
              ${props.theme.global.colors['neutral-1']} 5%,
              ${props.theme.global.colors['neutral-1']} 70%,
              transparent 100%
            );
          `}
  }
`

const AboutLogoContainer = styled(Box)`
  position: relative;
  width: 100%;
`

const RightElement = styled(Box)`
  position: relative;
  width: calc(50% - 40px);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - 5px);
    width: 100%;
    height: 6px;
    ${props =>
      props.theme.dark
        ? css`
            background: linear-gradient(
              90deg,
              transparent 0%,
              ${props.theme.global.colors['accent-1']} 5%,
              ${props.theme.global.colors['accent-1']} 70%,
              transparent 100%
            );
          `
        : css`
            background: linear-gradient(
              90deg,
              transparent 0%,
              ${props.theme.global.colors['neutral-1']} 5%,
              ${props.theme.global.colors['neutral-1']} 70%,
              transparent 100%
            );
          `}
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% + 2px);
    width: 95%;
    height: 3px;
    ${props =>
      props.theme.dark
        ? css`
            background: linear-gradient(
              90deg,
              transparent 0%,
              ${props.theme.global.colors['accent-1']} 5%,
              ${props.theme.global.colors['accent-1']} 70%,
              transparent 100%
            );
          `
        : css`
            background: linear-gradient(
              90deg,
              transparent 0%,
              ${props.theme.global.colors['neutral-1']} 5%,
              ${props.theme.global.colors['neutral-1']} 70%,
              transparent 100%
            );
          `}
  }
`

function AboutLogo() {
  const { dark, global } = useTheme()
  return (
    <AboutLogoContainer align='center' direction='row'>
      <LeftElement />
      <ZooniverseLogo
        id='root-about-zooniverse'
        color={dark ? global.colors['accent-1'] : global.colors['neutral-1']}
        size='76px'
      />
      <RightElement />
    </AboutLogoContainer>
  )
}

export default AboutLogo
