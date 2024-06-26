import { Anchor, Text } from 'grommet'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { string } from 'prop-types'
import styled from 'styled-components'

const StyledAnchor = styled(Anchor)`
  border-bottom: 2px solid transparent;
  text-decoration: none;

  &:hover {
    border-bottom-color: white;
  }

  &[aria-current=page] {
    border-bottom-color: white;
  }
`

function NavLink({ color, href = '', label = '' }) {
  const { asPath } = useRouter()
  const isActive = asPath === href
  return (
    <StyledAnchor
      as={Link}
      aria-current={isActive ? 'page' : undefined}
      href={href}
    >
      <Text color={color}>{label}</Text>
    </StyledAnchor>
  )
}

NavLink.propTypes = {
  label: string.isRequired,
  href: string.isRequired
}

export default NavLink
