import { Box, Text } from 'grommet'
import Loader from '@zooniverse/react-components/Loader'
import SpacedText from '@zooniverse/react-components/SpacedText'
import { arrayOf, bool, object, number, shape, string } from 'prop-types'
import styled from 'styled-components'

import ContentBox from '@shared/components/ContentBox'
import RequireUser from '@shared/components/RequireUser/RequireUser.js'
import { useTranslation } from 'next-i18next'

// See the same breakpoint in ClassifyPage.js
const StyledBox = styled(Box)`
  flex-direction: column;
  justify-content: center;
  gap: 30px;

  @media (width < 1000px) {
    flex-direction: row;
    justify-content: center;
  }
`

function Stat({ label = '', value = 0 }) {
  return (
    <Box>
      <SpacedText textAlign='center'>{label}</SpacedText>
      <Text
        color={{ light: 'neutral-1', dark: 'accent-1' }}
        size='xxlarge'
        textAlign='center'
      >
        {/* Insert commmas where appropriate */}
        {value.toLocaleString()}
      </Text>
    </Box>
  )
}

const defaultStatsData = {
  allTimeStats: {
    data: [
      {
        count: 0,
        period: ''
      }
    ],
    total_count: 0
  },
  sevenDaysStats: {
    data: [
      {
        count: 0,
        period: ''
      }
    ],
    total_count: 0
  }
}

function YourProjectStats({
  data = defaultStatsData,
  loading = false,
  error = undefined,
  projectID = '',
  userID = '',
  userLogin = ''
}) {
  const { t } = useTranslation('screens')
  const linkProps = {
    externalLink: true,
    href: `https://www.zooniverse.org/users/${userLogin}/stats?project_id=${projectID}`
  }

  return (
    <ContentBox
      title={t('Classify.YourStats.title')}
      linkLabel={loading || !userID || error ? null : t('Classify.YourStats.link')}
      linkProps={loading || !userID || error ? null : linkProps}
    >
      {userID ? (
        <>
          {loading ? (
            <Box height='100%' width='100%' align='center'>
              <Loader />
            </Box>
          ) : error ? (
            <Box height='100%' width='100%' align='center'>
              <span>{error.message}</span>
            </Box>
          ) : data ? (
            <StyledBox
              fill
              align='center'
            >
              <Stat
                label={t('Classify.YourStats.lastSeven')}
                value={data?.sevenDaysStats?.total_count}
              />
              <Stat
                label={t('Classify.YourStats.allTime')}
                value={data?.allTimeStats?.total_count}
              />
            </StyledBox>
          ) : null}
        </>
      ) : (
        <RequireUser />
      )}
    </ContentBox>
  )
}

export default YourProjectStats

YourProjectStats.propTypes = {
  data: shape({
    allTimeStats: shape({
      data: arrayOf(
        shape({
          count: number,
          period: string
        })
      ),
      total_count: number
    }),
    sevenDaysStats: shape({
      data: arrayOf(
        shape({
          count: number,
          period: string
        })
      ),
      total_count: number
    })
  }),
  loading: bool,
  error: object,
  projectID: string,
  userID: string
}
