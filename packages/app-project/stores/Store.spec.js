import { expect } from 'chai'
import asyncStates from '@zooniverse/async-states'
import Store from './Store'
import placeholderEnv from './helpers/placeholderEnv'

describe('Stores > Store', function () {
  it('should export an object', function () {
    expect(Store).to.be.an('object')
  })

  it('should contain a project store', function () {
    const store = Store.create({}, placeholderEnv)
    expect(store.project).to.be.ok()
  })

  describe('Views > appLoadingState', function () {
    it('should default to initialized', function () {
      const store = Store.create({}, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.initialized)
    })

    it('should return loading if the project is loading', function () {
      const store = Store.create({ project: { loadingState: asyncStates.loading } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.loading)
    })

    it('should return loading if the user is loading', function () {
      const store = Store.create({ user: { loadingState: asyncStates.loading } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.loading)
    })

    it('should return loading if the user project preferences is loading', function () {
      const store = Store.create({ user: { personalization: { projectPreferences: { loadingState: asyncStates.loading } }}}, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.loading)
    })

    it('should return error if the project has errored', function () {
      const store = Store.create({ project: { loadingState: asyncStates.error } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.error)
    })

    it('should return error if the user has errored', function () {
      const store = Store.create({ user: { loadingState: asyncStates.error } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.error)
    })

    it('should return error if the user project preferences has errored', function () {
      const store = Store.create({ user: { personalization: { projectPreferences: { loadingState: asyncStates.error } } } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.error)
    })

    it('should return success if the project, user, and user project preferences have successfully loaded', function () {
      const store = Store.create({ project: { loadingState: asyncStates.success }, user: { loadingState: asyncStates.success, personalization: { projectPreferences: { loadingState: asyncStates.success } } } }, placeholderEnv)
      expect(store.appLoadingState).to.equal(asyncStates.success)
    })
  })

  describe('when a user signs out', function () {
    it('should reset the user project preferences and sessionCount', function () {
      const store = Store.create({
        user: {
          id: '1',
          loadingState: asyncStates.success,
          login: 'zootester',
          personalization: {
            projectPreferences: {
              id: '5',
              links: { project: '5678', user: '1' },
              loadingState: asyncStates.success,
              preferences: {
                tutorials_completed_at: {
                  555: "2021-08-02T16:09:00.468Z"
                }
              },
              settings: { workflow_id: '4444' }
            }
          }
        }
      }, placeholderEnv)
      // We call increment so we have a session count
      // session count is volatile state that can't be set by snapshot
      store.user.personalization.incrementSessionCount()
      const signedInUserAndPersonalization = store.user.toJSON()
      expect(store.user.personalization.sessionCount).to.equal(1)
      store.user.clear()
      const signedOutUserAndPersonalization = store.user.toJSON()
      expect(store.user.personalization.sessionCount).to.equal(0)
      expect(signedOutUserAndPersonalization).to.not.deep.equal(signedInUserAndPersonalization)
    })
  })
})
