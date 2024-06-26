import { composeStory } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import { USERS } from '../../../../../test/mocks/panoptes'

import Meta, { Default } from './TopContributors.stories.js'

describe('components > GroupStats > TopContributors', function () {
  const DefaultStory = composeStory(Default, Meta)

  it('should show the top contributors', function () {
    render(<DefaultStory />)
    const topContributors = screen.getAllByRole('listitem')
    expect(topContributors).to.have.length(USERS.length)
  })

  it('should show the user\'s avatar', function () {
    render(<DefaultStory />)
    const avatar = screen.getByAltText(`${USERS[0].login} avatar`)
    expect(avatar).to.be.ok()
  })

  it('should show the user\'s display name', function () {
    render(<DefaultStory />)
    const displayName = screen.getByText(USERS[0].display_name)
    expect(displayName).to.be.ok()
  })

  it('should show the user\'s classifications', function () {
    render(<DefaultStory />)
    const classifications = screen.getByText('123 Classifications')
    expect(classifications).to.be.ok()
  })
})
