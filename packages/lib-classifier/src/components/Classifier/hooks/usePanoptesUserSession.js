import {
  usePanoptesUser,
  useProjectPreferences,
  useProjectRoles
} from '@hooks'

export default function usePanoptesUserSession({ authClient, projectID }) {
  const { data: user, isLoading: userLoading } = usePanoptesUser(authClient)
  const userID = userLoading ? undefined : (user?.id || null)
  const { data: upp } = useProjectPreferences({ authClient, projectID, userID })
  const { data: projectRoles } = useProjectRoles({ authClient, projectID, userID })
  const userHasLoaded = userID ?
    // logged-in user is loaded once we have user, preferences and roles.
    !!userID && !!upp && !!projectRoles :
    // anonymous users are always falsy but ready once all API checks have resolved to null.
    !userLoading && upp === null && projectRoles == null

  return { user, upp, projectRoles, userHasLoaded }
}