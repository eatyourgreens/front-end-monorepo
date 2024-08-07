import { composeStory } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import Meta, { Default } from './TitledStat.stories.js'

describe('components > shared > TitledStat', function () {
  const DefaultStory = composeStory(Default, Meta)

  it('should show the title', function () {
    render(<DefaultStory />)

    expect(screen.getByText('Classifications')).to.be.ok()
  })

  it('should show the value', function () {
    render(<DefaultStory />)

    expect(screen.getByText('1,234')).to.be.ok()
  })
})
