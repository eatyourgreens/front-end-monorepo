import { render, screen } from '@testing-library/react'
import { Grommet } from 'grommet'
import { zooTheme } from '@zooniverse/grommet-theme'
import { composeStory } from '@storybook/react'
import Meta, { Plain, ContentWithTitle, ContentWithTitleAndALink } from './ContentBox.stories.js'
import { ContentBoxMock } from './ContentBox.mock'

describe('Component > ContentBox', function () {
  describe('content only', function () {
    beforeEach(function () {
      const PlainStory = composeStory(Plain, Meta)
      render(<Grommet theme={zooTheme}><PlainStory /></Grommet>)
    })

    it('should render the content', async function () {
      expect(screen.getByText(ContentBoxMock.contentText)).to.exist()
    })

    it('should not render the title', async function () {
      expect(screen.queryByText(ContentBoxMock.title)).to.be.null()
    })
    
    it('should not render the link', function () {
      expect(screen.queryByRole('link')).to.be.null()
    })
  })

  describe('content with title', function () {
    beforeEach(function () {
      const ContentWithTitleStory = composeStory(ContentWithTitle, Meta)
      render(<Grommet theme={zooTheme}><ContentWithTitleStory /></Grommet>)
    })

    it('should render the content', async function () {
      expect(screen.getByText(ContentBoxMock.contentText)).to.exist()
    })

    it('should render the title', async function () {
      expect(screen.getByText(ContentBoxMock.title)).to.exist()
    })
    
    it('should not render the link', function () {
      expect(screen.queryByRole('link')).to.be.null()
    })
  })

  describe('content with title and link', function () {
    beforeEach(function () {
      const ContentWithTitleAndALinkStory = composeStory(ContentWithTitleAndALink, Meta)
      render(<Grommet theme={zooTheme}><ContentWithTitleAndALinkStory /></Grommet>)
    })

    it('should render the content', async function () {
      expect(screen.getByText(ContentBoxMock.contentText)).to.exist()
    })

    it('should render the title', async function () {
      expect(screen.getByText(ContentBoxMock.title)).to.exist()
    })
    
    it('should render the link', function () {
      expect(screen.getByRole('link')).to.have.property('href')
        .to.equal(ContentBoxMock.linkProps.href)

      expect(screen.getByRole('link')).to.have.property('text')
        .to.equal(ContentBoxMock.linkLabel)
    })
  })
})
