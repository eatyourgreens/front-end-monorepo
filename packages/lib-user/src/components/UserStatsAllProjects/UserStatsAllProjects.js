'use client'

import { bool, shape, string } from 'prop-types'
import { useContext } from 'react'
import { Box, Heading, ResponsiveContext } from 'grommet'
import SpacedText from '@zooniverse/react-components/SpacedText'

import { usePanoptesUser, useStats } from '@hooks'
import {
  AllProjectsByCount,
  AllProjectsByRecent,
  ContentBox,
  HeaderLink,
  Layout,
  SortDropdown
} from '@components/shared'
import { getDateInterval, getStatsDateString } from '@utils'
import { useTranslation } from '../../translations/i18n.js'

const STATS_ENDPOINT = '/classifications/users'
const DEFAULT_HANDLER = () => true

function UserStatsAllProjects({
  authUser,
  login,
  handleSortParam = DEFAULT_HANDLER,
  sortParam = 'top'
}) {
  const { t } = useTranslation()
  const grommetSize = useContext(ResponsiveContext)

  // fetch user
  const {
    data: user,
    error: userError,
    isLoading: userLoading
  } = usePanoptesUser({
    authUser,
    login,
    requiredUserProperty: 'created_at'
  })

  // fetch this users's projects stats with "All Time" interval (same as StatsTab in DefaultHome)
  const allTimeQuery = getDateInterval({
    endDate: getStatsDateString(new Date()),
    startDate: getStatsDateString(user?.created_at)
  })

  allTimeQuery.project_contributions = true

  const {
    data,
    error: statsError,
    isLoading: statsLoading
  } = useStats({
    endpoint: STATS_ENDPOINT,
    sourceId: user?.id,
    query: allTimeQuery
  })

  // order by most contributions --> least contributions
  const projectContributions = data?.project_contributions?.sort(
    (a, b) => b.count - a.count
  )

  const containerLoading = statsLoading || userLoading
  const containerError = statsError || userError

  return (
    <Layout
      primaryHeaderItem={
        <HeaderLink
          href={`/users/${login}/stats`}
          label={t('common.back')}
          primaryItem={true}
        />
      }
    >
      <ContentBox pad={'50px'}>
        <Box
          direction={grommetSize === 'small' ? 'column' : 'row'}
          width='100%'
          margin={{ bottom: 'small' }}
          justify={grommetSize === 'small' ? 'start' : 'between'}
        >
          <Heading level='1' margin={{ top: '0' }}>
            {user?.display_name && (
              <SpacedText
                color={{ dark: 'accent-1', light: 'neutral-1' }}
                size='large'
                weight='bold'
              >
                {t('AllProjects.title', { displayName: user?.display_name })}
              </SpacedText>
            )}
          </Heading>
          <SortDropdown
            handleSortParam={handleSortParam}
            sortParam={sortParam}
          />
        </Box>
        {sortParam === 'top' ? (
          <AllProjectsByCount
            containerError={containerError}
            containerLoading={containerLoading}
            projectContributions={projectContributions}
          />
        ) : (
          // sortParam = 'recent'
          <AllProjectsByRecent
            containerError={containerError}
            containerLoading={containerLoading}
            projectContributions={projectContributions}
            user={user}
          />
        )}
      </ContentBox>
    </Layout>
  )
}

UserStatsAllProjects.propTypes = {
  adminMode: bool,
  authUser: shape({
    id: string
  }),
  login: string
}

export default UserStatsAllProjects
