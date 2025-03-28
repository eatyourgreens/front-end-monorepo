import { Anchor } from 'grommet'
import { Blank, FacebookOption, Instagram, X } from 'grommet-icons'
import { objectOf, string } from 'prop-types'
import styled from 'styled-components'

const StyledAnchor = styled(Anchor)`
  padding: 0;
`

// Can replace with grommet-icon once that library includes Bluesky
function BlueSkyIcon(props) {
  return (
    <Blank
      viewBox='0 0 600 530'
      width='100'
      height='88'
      aria-label='BlueSky'
      {...props}
    >
      <path
        d='m135.7 44c66.5 50 138 151.2 164.3 205.5 26.3-54.3 97.8-155.5 164.3-205.5 48-36 125.7-63.9 125.7 24.8 0 17.7-10.2 148.8-16.1 170.1-20.7 74-96.2 92.8-163.3 81.4 117.3 20 147.2 86.1 82.7 152.2-122.4 125.6-175.9-31.5-189.6-71.7-2.5-7.4-3.7-10.8-3.7-7.9 0-3-1.2 0.5-3.7 7.9-13.7 40.2-67.2 197.3-189.6 71.7-64.5-66.1-34.6-132.2 82.7-152.2-67.2 11.4-142.6-7.4-163.3-81.4-5.9-21.3-16.1-152.4-16.1-170.1 0-88.7 77.7-60.8 125.7-24.8z'
      />
    </Blank>
  )
}

const defaultHrefs = {
  bluesky: 'https://bsky.app/profile/zooniverse.bsky.social',
  facebook: 'https://www.facebook.com/therealzooniverse',
  instagram: 'https://www.instagram.com/the.zooniverse/',
  twitter: 'https://x.com/the_zooniverse',
}

const icons = {
  bluesky: <BlueSkyIcon size='25px' />,
  facebook: <FacebookOption size='25px' />,
  instagram: <Instagram size='25px' />,
  twitter: <X size='25px' />
}

function SocialAnchor ({ className = '', hrefs = defaultHrefs, service }) {
  return (
      <StyledAnchor
        a11yTitle={service}
        className={className}
        icon={icons[service]}
        href={hrefs[service]}
      />
  )
}

SocialAnchor.propTypes = {
  className: string,
  hrefs: objectOf(string),
  service: string.isRequired
}

export default SocialAnchor
