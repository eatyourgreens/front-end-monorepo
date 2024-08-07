import GroupStatsContainer from './GroupStatsContainer'

export const metadata = {
  title: 'Group Stats',
  description: 'Zooniverse group stats page'
}

export default function GroupPage({ params, searchParams }) {
  return (
    <GroupStatsContainer
      endDate={searchParams.end_date}
      groupId={params.groupId}
      joinToken={searchParams.join_token}
      projectId={searchParams.project_id}
      startDate={searchParams.start_date}
    />
  )
}
