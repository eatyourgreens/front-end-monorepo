import { render, screen, waitFor } from '@testing-library/react'
import { composeStory } from '@storybook/react'

import Meta, { Default, mockTasks } from './CenteredLayout.stories.js'

describe('Component > Layouts > Centered', function () {
  it('should render a subject and a task', async function () {
    const DefaultStory = composeStory(Default, Meta)
    render(<DefaultStory />)
    
    // Mock the loading state transition
    Default.store.subjectViewer.onSubjectReady()
    
    await waitFor(() => expect(screen.getByTitle('Subject 1')).exists()) // subject viewer title
    await waitFor(() => expect(screen.getByText(mockTasks.init.strings.question)).exists()) // task question paragraph
  })
})
