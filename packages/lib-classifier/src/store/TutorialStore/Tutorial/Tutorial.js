import asyncStates from '@zooniverse/async-states'
import { getRoot, tryReference, types } from 'mobx-state-tree'
import Resource from '@store/Resource'

const Tutorial = types
  .model('Tutorial', {
    display_name: types.optional(types.string, ''),
    kind: types.maybeNull(types.enumeration(['mini-course', 'tutorial'])),
    language: types.maybe(types.string),
    steps: types.array(types.frozen({
      content: types.maybe(types.string),
      media: types.maybe(types.string)
    }))
  })

  .views( self => ({
    get hasNotBeenSeen() {
      const uppStore = getRoot(self).userProjectPreferences
      const upp = tryReference(() => getRoot(self).userProjectPreferences.active)

      /*
        If there's a logged-in user, check their tutorial preferences for this tutorial.
      */
      if (upp) {
        const seenTime = upp.preferences.tutorials_completed_at?.[self.id]
        return !(seenTime)
      }

      /*
        Otherwise, wait for UPP to load, then return true for anonymous users.
      */
      return (uppStore?.loadingState === asyncStates.success)
    },
  }))

  .actions(self => {
    return {
      setSeenTime() {
        const uppStore = getRoot(self).userProjectPreferences
        const upp = tryReference(() => uppStore.active)

        const seen = new Date().toISOString()
        if (self.kind === 'tutorial' || self.kind === null) {
          if (upp) {
            const changes = {
              preferences: {
                tutorials_completed_at: {
                  [self.id]: seen
                }
              }
            }
            uppStore.updateUPP(changes)
          }
        }
      }
    }
  })

export default types.compose('TutorialResource', Resource, Tutorial)
