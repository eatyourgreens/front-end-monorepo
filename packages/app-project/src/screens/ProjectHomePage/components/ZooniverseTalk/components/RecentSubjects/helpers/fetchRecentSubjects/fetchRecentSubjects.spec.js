import nock from 'nock'

import fetchRecentSubjects from './fetchRecentSubjects'

const TALK_URL = 'https://talk-staging.zooniverse.org'
const PANOPTES_URL = 'https://panoptes-staging.zooniverse.org/api'

const MOCK_COMMENTS = [
  { focus_id: '1' },
  { focus_id: '3' },
  { focus_id: '2' }
]

const MOCK_SUBJECTS = [
  { id: '1', locations: [] },
  { id: '2', locations: [] },
  { id: '3', locations: [] }
]

describe('Helpers > fetchRecentSubjects', function () {

  it('should exist', function () {
    expect(fetchRecentSubjects).to.be.a('function')
  })

  describe('behaviour with no subjects', function () {
    let mockTalk

    before(function () {
      mockTalk = nock(TALK_URL)
        .get('/comments')
        .query(true)
        .reply(200, { comments: [] })
    })

    it('should return an empty array', async function () {
      const result = await fetchRecentSubjects({ projectId: '1' })
      expect(result).to.deep.equal([])
    })
  })

  describe('behaviour with subjects', function () {
    let mockTalk
    let mockPanoptes

    before(function () {
      mockTalk = nock(TALK_URL)
        .get('/comments')
        .query(true)
        .reply(200, { comments: MOCK_COMMENTS })
      mockPanoptes = nock(PANOPTES_URL)
        .get('/subjects')
        .query(true)
        .reply(200, { subjects: MOCK_SUBJECTS })
    })

    it('should return an array of subjects', async function () {
      const result = await fetchRecentSubjects({ projectId: '2' })
      expect(result).to.deep.equal([
        { id: '1', locations: [] },
        { id: '3', locations: [] },
        { id: '2', locations: [] }
      ])
    })
  })
})
