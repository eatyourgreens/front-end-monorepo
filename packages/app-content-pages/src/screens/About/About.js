import { Box, Heading } from 'grommet'
import { useTranslation } from 'next-i18next'
import Script from 'next/script'
import { useState } from 'react'
import styled from 'styled-components'

import PageLayout from '../../shared/components/PageLayout/layout.js'
import DropdownNav from '../../shared/components/DropdownNav/DropdownNav.js'
import Head from '../../shared/components/Head'
import HeadingForAboutNav from '../../shared/components/HeadingForAboutNav/HeadingForAboutNav.js'
import MaxWidthContent from '../../shared/components/MaxWidthContent/MaxWidthContent.js'
import {
  mobileBreakpoint,
  MobileHeading,
  StickyBox,
  StickySidebar,
  StyledGrid
} from '../../shared/components/SharedStyledComponents/SharedStyledComponents.js'
import AboutLogo from './components/AboutLogo.js'
import Contact from './components/Contact.js'
import Highlights from './components/Highlights.js'
import HowItWorks from './components/HowItWorks.js'
import Mobile from './components/Mobile.js'
import OurMission from './components/OurMission.js'

const StyledAboutHeading = styled(Heading)`
  position: relative;
  padding: 44px 0;
  margin: 0;
  text-align: center;

  @media (width <= ${mobileBreakpoint}) {
    display: none;
  }
`

function AboutPage() {
  const { t } = useTranslation('components')
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  const sidebarSections = [
    { name: t('AboutPage.ourMission.heading'), slug: '' },
    { name: t('AboutPage.howItWorks.heading'), slug: 'how-it-works' },
    { name: t('AboutPage.mobile.sidebar'), slug: 'mobile' },
    { name: t('AboutPage.highlights.sidebar'), slug: 'highlights' },
    { name: t('AboutPage.contact.heading'), slug: 'contact' }
  ]

  return (
    <>
      <Script
        id='freshdesk-widget-init'
        dangerouslySetInnerHTML={{
          __html: `
        window.fwSettings={
          'widget_id':44000004375,
          'locale': 'en'
        };
        !function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}()
      `
        }}
      />
      {/** Init the Freshdesk Widget, but hide it until volunteer clicks Contact section button */}
      <Script
        id='freshdesk-widget-src'
        src='https://widget.freshworks.com/widgets/44000004375.js'
        async
        defer
        onLoad={() => {
          window.FreshworksWidget('hide', 'launcher')
          setWidgetLoaded(true)
        }}
      />

      <Head
        description={t('AboutPage.description')}
        title={t('AboutPage.title')}
      />
      <PageLayout>
        <MobileHeading level='1' size='1.5rem'>
          {t('AboutPage.title')}
        </MobileHeading>
        <StickyBox background={{ dark: 'dark-3', light: 'neutral-6' }}>
          <DropdownNav
            activeSection={activeSection}
            sidebarLabel={t('AboutPage.sidebarLabel')}
            sections={sidebarSections}
            setActiveSection={setActiveSection}
          />
        </StickyBox>
        <MaxWidthContent>
          <StyledAboutHeading
            color={{ light: 'neutral-1', dark: 'accent-1' }}
            level='1'
            size='small'
          >
            {t('AboutPage.title')}
          </StyledAboutHeading>
        <AboutLogo />
        </MaxWidthContent>

        <StyledGrid>
          <Box as='aside' align='center'>
            <StickySidebar
              activeSection={activeSection}
              ariaLabel={t('AboutPage.sideBarLabel')}
              sections={sidebarSections}
              setActiveSection={setActiveSection}
            />
          </Box>
          <article>
            {/** Our Mission */}
            <HeadingForAboutNav
              color={{ light: 'neutral-1', dark: 'accent-1' }}
              pad={{ top: '30px', bottom: '10px' }}
              sectionIndex={0}
              sectionName={t('AboutPage.ourMission.heading')}
              setActiveSection={setActiveSection}
              slug={sidebarSections[0].slug}
            />
            <OurMission />

            {/** How It Works */}
            <HowItWorks setActiveSection={setActiveSection} />

            {/** Mobile App */}
            <MaxWidthContent pad={{ horizontal: 'medium' }}>
              <HeadingForAboutNav
                color={{ light: 'neutral-1', dark: 'accent-1' }}
                pad={{ top: '30px', bottom: '10px' }}
                sectionIndex={2}
                sectionName={t('AboutPage.mobile.heading')}
                setActiveSection={setActiveSection}
                slug={sidebarSections[0].slug}
              />
              <Mobile />
            </MaxWidthContent>

            {/** Highlights */}
            <MaxWidthContent pad={{ horizontal: 'medium' }}>
              <HeadingForAboutNav
                color={{ light: 'neutral-1', dark: 'accent-1' }}
                pad={{ top: '30px', bottom: '10px' }}
                sectionIndex={3}
                sectionName={t('AboutPage.highlights.heading')}
                setActiveSection={setActiveSection}
                slug={sidebarSections[3].slug}
              />
              <Highlights />
            </MaxWidthContent>

            {/** Contact Us */}
            <MaxWidthContent>
              <HeadingForAboutNav
                color={{ light: 'neutral-1', dark: 'accent-1' }}
                pad={{ top: '30px', bottom: '10px' }}
                sectionIndex={4}
                sectionName={t('AboutPage.contact.heading')}
                setActiveSection={setActiveSection}
                slug={sidebarSections[4].slug}
              />
              <Contact widgetLoaded={widgetLoaded} />
            </MaxWidthContent>
          </article>
          <Box />
        </StyledGrid>
      </PageLayout>
    </>
  )
}

export default AboutPage
