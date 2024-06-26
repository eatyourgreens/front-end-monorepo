import { Anchor, Box, Heading, ResponsiveContext } from 'grommet'
import { useTranslation } from '../../../translations/i18n.js'
import { SpacedHeading } from '@zooniverse/react-components'
import styled from 'styled-components'
import { useContext } from 'react'

import Article from '../../../components/Article/Article.js'
import SubHeading from '../../../components/HeadingForAboutNav/SubHeading.js'

const ElevatedBox = styled(Box)`
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3); // Grommet elevation = 'medium'
  clip-path: inset(1px -30px 0px -30px); // don't put elevation top and bottom
  padding: 60px 0;

  // hides seam between DefaultHome or UserHome and this component
  position: relative;
  z-index: 99;
  margin-top: -3px;

  @media (width <= 90rem) {
    padding: 30px;
  }
`

export default function Community({ dailyZooPosts = [], zooBlogPosts = [] }) {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)

  return (
    <Box
      background={{
        dark: 'dark-1',
        light: 'light-1'
      }}
      align='center'
    >
      <ElevatedBox
        align='center'
        background={{ dark: 'dark-3', light: 'neutral-6' }}
        width='min(100%, 90rem)'
      >
        <Box
          round='small'
          pad={size === 'small' ? '0' : 'large'}
          border={
            size === 'small'
              ? false
              : {
                  color: { light: 'light-5', dark: 'black' },
                  size: 'xsmall'
                }
          }
          width='min(100%, calc(90rem - 160px))' // Like 80px horizontal padding, matches lib-user Layout
        >
          <SpacedHeading
            color={{ light: 'neutral-1', dark: 'accent-1' }}
            level={2}
            size='1.5rem'
            alignSelf='center'
            textAlign='center'
          >
            {t('Home.Community.heading')}
          </SpacedHeading>
          <SubHeading>{t('Home.Community.subheading')}</SubHeading>

          {/* The Daily Zooniverse */}
          <Box
            border={{
              side: 'bottom',
              color: { light: 'light-4', dark: 'black' },
              size: 'xsmall'
            }}
            direction='row'
            justify='between'
            align='center'
            margin={{ vertical: 'small' }}
          >
            <Heading level={3} size='1rem'>
              {t('Home.Community.feedOne')}
            </Heading>
            <Anchor href='https://daily.zooniverse.org' size='1rem'>
              {t('Home.Community.seeAll')}
            </Anchor>
          </Box>
          <Box gap='small' margin={{ bottom: 'medium' }}>
            {dailyZooPosts.length
              ? dailyZooPosts.map(item => <Article key={item.id} {...item} />)
              : null}
          </Box>

          {/* The Zooniverse Blog */}
          <Box
            direction='row'
            justify='between'
            align='center'
            border={{
              position: 'bottom',
              color: { light: 'light-1', dark: 'dark-1' }
            }}
          >
            <Heading level={3} size='1rem'>
              {t('Home.Community.feedTwo')}
            </Heading>
            <Anchor href='https://blog.zooniverse.org' size='1rem'>
              {t('Home.Community.seeAll')}
            </Anchor>
          </Box>
          <Box gap='small'>
            {zooBlogPosts.length
              ? zooBlogPosts.map(item => <Article key={item.id} {...item} />)
              : null}
          </Box>
        </Box>
      </ElevatedBox>
    </Box>
  )
}
