import { expect } from 'chai'
import { composeStory } from '@storybook/testing-react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Meta, { Default, NoFilters } from './SurveyTask.stories'

describe('SurveyTask with user keystrokes', function () {
  // this turns off Mocha's time limit for slow tests
  this.timeout(0)

  const DefaultStory = composeStory(Default, Meta)
  const NoFiltersStory = composeStory(NoFilters, Meta)

  describe('without filters', function() {
    let user, choiceButton, choiceButtons

    beforeEach(async function () {
      user = userEvent.setup({ delay: null })
      render(<NoFiltersStory />)
      choiceButton = screen.getByText('Fire')
      await user.click(choiceButton)
      const identifyButton = screen.getByText('SurveyTask.Choice.identify')
      // identify choice (Fire) and close choice (Fire) component
      await user.click(identifyButton)
      // confirm choices showing
      choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
    })

    it('should remove a previously identified choice with delete key', async function () {
      expect(choiceButtons.length).to.equal(6)
    
      // confirm choice Fire selected
      choiceButton = Array.from(choiceButtons).find(choiceButton => choiceButton.textContent === 'Fire')
      expect(choiceButton.getAttribute('aria-checked')).to.equal('true')
    
      // confirm choice Fire active element
      expect(choiceButton).to.equal(document.activeElement)
    
      // press delete key to remove choice (Fire)
      await user.keyboard('[Delete]')
      choiceButton = Array.from(choiceButtons).find(choiceButton => choiceButton.textContent === 'Fire')
      // confirm choice Fire not selected
      expect(choiceButton.getAttribute('aria-checked')).to.equal('false')
    })

    it('should remove a previously identified choice with backspace key', async function () {
      expect(choiceButtons.length).to.equal(6)
    
      // confirm choice Fire selected
      choiceButton = Array.from(choiceButtons).find(choiceButton => choiceButton.textContent === 'Fire')
      expect(choiceButton.getAttribute('aria-checked')).to.equal('true')
    
      // confirm choice Fire active element
      expect(choiceButton).to.equal(document.activeElement)
    
      // press backspace key to remove choice (Fire)
      await user.keyboard('[Backspace]')
      choiceButton = Array.from(choiceButtons).find(choiceButton => choiceButton.textContent === 'Fire')
      // confirm choice Fire not selected
      expect(choiceButton.getAttribute('aria-checked')).to.equal('false')
    })
  })

  describe('when the Filter button is keyed with Enter', function () {
    let user, filterButton

    beforeEach(async function () {
      user = userEvent.setup({ delay: null })
      render(<DefaultStory />)
      filterButton = screen.getByLabelText('SurveyTask.CharacteristicsFilter.filter')
      // tabbing to and opening the Filter button
      await user.keyboard('[Tab][Enter]')
    })

    it('should show characteristic filter sections', async function () {
      // the filterSections are the characteristic filter sections, i.e. the sections for "Like", "Pattern", and "Color" for the mock task
      const characteristicsSection = screen.getByTestId('characteristics')
      const filterSections = within(characteristicsSection).getAllByRole('radiogroup')
      expect(filterSections.length).to.equal(3)
    })

    describe.skip('when filters are keyed', function () {
      it('should show the filter button with a remove filter button', async function () {
        // the solidFilterButton is the button to filter choices by "solid". Solid is a specific value of the "Pattern" characteristic
        const solidFilterButton = screen.getByTestId('filter-PTTRN-SLD')
        expect(solidFilterButton).to.be.ok()

        // the solidFilterRemoveButton is the small x button that appears over a filter to remove the filter, after it is selected. The presence of this button indicates that the filter is selected. The absence of this button indicates that the filter is not selected
        let characteristicsSection = screen.queryByTestId('characteristics')
        let solidFilterRemoveButton = within(characteristicsSection).queryByTestId('remove-filter-PTTRN-SLD')
        expect(solidFilterRemoveButton).to.be.null()
        
        // tabbing to the pattern section that contains the solid filter and selecting the solid filter with space key
        await user.keyboard('[Tab][Tab][Space]')
        characteristicsSection = screen.queryByTestId('characteristics')
        solidFilterRemoveButton = within(characteristicsSection).getByTestId('remove-filter-PTTRN-SLD')
        expect(solidFilterRemoveButton).to.be.ok()
      })

      it('should show the choices that match the filter', async function () {
        // tabbing to the pattern section that contains the solid filter and selecting the solid filter with space key
        await user.keyboard('[Tab][Tab][Space]')
        // close the filters
        await user.click(filterButton)
        // confirming that the choices are filtered by the solid filter
        const choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
        expect(choiceButtons.length).to.equal(3)
        expect(choiceButtons[0]).to.have.text('Aardvark')
        expect(choiceButtons[1]).to.have.text('Elephant')
        expect(choiceButtons[2]).to.have.text('Kudu')
      })

      it('should remove the filter on remove filter button keypress (within Characteristics)', async function () {
        // tabbing to the pattern section that contains the solid filter and selecting the solid filter with space key
        await user.keyboard('[Tab][Tab][Space]')
        // confirm the solid filter is selected with existence of the related remove filter button
        let characteristicsSection = screen.queryByTestId('characteristics')
        let solidFilterRemoveButton = within(characteristicsSection).getByTestId('remove-filter-PTTRN-SLD')
        expect(solidFilterRemoveButton).to.be.ok()

        // remove the solid filter with the "Remove solid filter" small x button
        await user.keyboard('[Tab][Tab][Space]')
        // confirm the solid filter is no longer selected with absence of the related remove filter button
        solidFilterRemoveButton = screen.queryByTestId('remove-filter-PTTRN-SLD')
        expect(solidFilterRemoveButton).to.be.null()
        
        // close the filters
        await user.click(filterButton)
        // confirm the choices are the total 6 choices, not filtered by the solid filter
        const choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
        expect(choiceButtons.length).to.equal(6)
      })

      it('should remove the filter on remove filter button keypress (within FilterStatus)', async function () {
        // tabbing to the pattern section that contains the solid filter and selecting the solid filter with space key
        await user.keyboard('[Tab][Tab][Space]')
        // confirm the solid filter is selected with existence of the related remove filter button
        let filterStatusSection = screen.getByTestId('filter-status')
        let solidFilterRemoveButton = within(filterStatusSection).getByTestId('remove-filter-PTTRN-SLD')
        expect(solidFilterRemoveButton).to.be.ok()

        // close the filters
        await user.click(filterButton)
        // confirm the solid filter is applied, of the total 6 choices only 1 choice (Kudu) matches the solid filter
        let choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
        expect(choiceButtons.length).to.equal(3)

        // remove the solid filter with the "Remove solid filter" small x button in the Filter Status component
        await user.keyboard('[Tab][Space]')
        // confirm the choices are the total 6 choices, not filtered by the solid filter
        choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
        expect(choiceButtons.length).to.equal(6)
      })
    })
  })

  describe('when a choice is selected with Enter', function () {
    let user

    beforeEach(async function () {
      user = userEvent.setup({ delay: null })
      render(<NoFiltersStory />)
      // tabbing to the first choice (Aardvark)
      await user.keyboard('[Tab]')
    })

    it('should show the choice description', async function () {
      // pressing Enter to open the choice (Aardvark)
      await user.keyboard('[Enter]')
      const choiceDescription = screen.getByText('Not as awesome as a pangolin, but surprisingly big.')
      expect(choiceDescription).to.be.ok()
    })

    it('should show choice images', async function () {
      // tabbing to the first choice (Aardvark) and pressing Enter to open the choice (Aardvark)
      await user.keyboard('[Enter]')
      const choiceImages = screen.getByTestId('choice-images')
      
      expect(choiceImages).to.be.ok()
    })

    it('should show choices with recent choice as active choice when Not This button keyed with Enter', async function () {
      // arrowing up to the last choice (Nothing here), and pressing Enter to open the choice (Nothing here)
      await user.keyboard('[ArrowUp]')
      await user.keyboard('[Enter]')
      let choiceDescription = screen.getByText('Don\'t tell the plant biologists we called vegetation \"nothing here\"!')
      expect(choiceDescription).to.be.ok()
      // tabbing to the "Not this" button
      await user.keyboard('[Tab][Tab]')
      const notThisButton = screen.getByRole('button', { name: 'SurveyTask.Choice.notThis' })
      expect(notThisButton).to.equal(document.activeElement)
      // pressing Enter to close the choice (Nothing here)
      await user.keyboard('[Enter]')
      // confirm choice (Nothing here) description, and therefore choice, is not shown
      choiceDescription = screen.queryByText('Don\'t tell the plant biologists we called vegetation \"nothing here\"!')
      expect(choiceDescription).to.be.null()
      // confirm choices are shown
      const choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
      expect(choiceButtons.length).to.equal(6)
    })

    it('should show choices with identified choice as active choice when Identify keyed with Enter', async function () {
      // arrowing up to the last choice (Nothing here), and pressing Enter to open the choice (Nothing here)
      await user.keyboard('[ArrowUp]')
      await user.keyboard('[Enter]')
      let choiceDescription = screen.getByText('Don\'t tell the plant biologists we called vegetation \"nothing here\"!')
      expect(choiceDescription).to.be.ok()
      // tabbing to the "Identify" button
      await user.keyboard('[Tab][Tab][Tab]')
      const identifyButton = screen.getByRole('button', { name: 'SurveyTask.Choice.identify' })
      expect(identifyButton).to.equal(document.activeElement)
      // pressing Enter to identify and close the choice (Nothing here)
      await user.keyboard('[Enter]')
      // confirm choice (Nothing here) description, and therefore choice, is not shown
      choiceDescription = screen.queryByText('Don\'t tell the plant biologists we called vegetation \"nothing here\"!')
      expect(choiceDescription).to.be.null()
      // confirm choices are shown
      const choiceButtons = document.querySelector('[role=menu]').querySelectorAll('[role=menuitemcheckbox]')
      expect(choiceButtons.length).to.equal(6)
      // confirm the identified choice (Nothing here) is the active choice
      const nothingHereChoiceButton = Array.from(choiceButtons).find(choiceButton => choiceButton.textContent === 'Nothing here')
      expect(nothingHereChoiceButton).to.equal(document.activeElement)
    })

    it('should disable the Identify button until required questions are answered', async function () {
      // pressing Enter to open the choice (Aardvark)
      await user.keyboard('[Enter]')
      let identifyButton = screen.getByTestId('choice-identify-button')
      // confirm the Identify button is disabled, pending required questions answered
      expect(identifyButton.disabled).to.be.true()
      // the required questions for Aardvark are "How many?" and "What behavior do you see?"
      // the following answers "How many?" with "1" and "What behavior do you see?" with "Resting"
      
      // tabbing (x3) to the "How many?" question, selecting the "1" answer with space key, tabbing (x1) to the "What behavior do you see?" question, selecting the "Resting" answer with space key
      await user.keyboard('[Tab][Tab][Tab][Space][Tab][Space]')
      // confirm the Identify button is enabled, now that required questions are answered
      identifyButton = screen.getByTestId('choice-identify-button')
      // confirm the Identify button is enabled, now that required questions answered
      expect(identifyButton.disabled).to.be.false()
    })
  })
})