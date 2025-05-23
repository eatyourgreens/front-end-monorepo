import { SpacedText } from '@zooniverse/react-components'
import { Box, Button, Collapsible } from 'grommet'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { forwardRef } from 'react'

import { useTranslation } from '@translations/i18n'

import FilterIcon from './FilterIcon'
import FilterLabel from '../components/FilterLabel'
import Characteristics from '../Characteristics'
import ClearFilters from '../ClearFilters'

const StyledButton = styled(Button)`
  border: none;
  border-radius: 32px;
  height: 40px;
  padding: 8px 10px;

  &:focus {
    text-decoration: underline;
  }

  &:enabled:hover {
    color: ${props => props.theme.dark ?
      props.theme.global.colors.brand
      : props.theme.global.colors['neutral-1']};
    text-decoration: underline;
  }

  ${props => props.$filterOpen && css`
    background-color: ${props => props.theme.global.colors['neutral-1']};
    color: ${props => props.theme.global.colors['neutral-6']};
    text-decoration: none;

    &:enabled:hover {
      color: ${props => props.theme.global.colors['neutral-6']};
      text-decoration: underline;
    }
  `}
`

const StyledLabel = styled(SpacedText)`
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
`

const DEFAULT_HANDLER = () => true

const FilterStatus = forwardRef(({
  disabled = false,
  filterOpen = false,
  filters = {},
  handleFilter = DEFAULT_HANDLER,
  handleFilterOpen = DEFAULT_HANDLER,
  showingChoices = 0,
  task
}, ref) => {
  const {
    characteristics,
    characteristicsOrder,
    choices,
    images,
    strings
  } = task

  const { t } = useTranslation('plugins')

  const selectedCharacteristicIds = Object.keys(filters)

  return (
    <Box
      margin={{
        bottom: 'xxsmall'
      }}
    >
      <Box
        align='start'
        data-testid='filter-status'
        direction='row'
        gap='xxsmall'
        wrap={true}
      >
        <StyledButton
          ref={ref}
          a11yTitle={t('SurveyTask.CharacteristicsFilter.filter')}
          aria-controls='characteristics-collapsible'
          aria-expanded={filterOpen}
          disabled={disabled}
          $filterOpen={filterOpen}
          gap='xsmall'
          icon={<FilterIcon size='16px' />}
          label={
            <StyledLabel>
              {t('SurveyTask.CharacteristicsFilter.filter')}
            </StyledLabel>
          }
          onClick={handleFilterOpen}
        />
        {selectedCharacteristicIds.map(characteristicId => {
          const characteristic = characteristics?.get(characteristicId) || {}
          const selectedValueId = filters?.[characteristicId] || ''
          const value = characteristic.values?.get(selectedValueId) || {}
          const valueImageSrc = images?.get(value.image) || ''
          const label = strings.get(`characteristics.${characteristicId}.values.${selectedValueId}.label`)
          function clearSelection() {
            handleFilter(characteristicId)
          }

          return (
            <Button
              key={`${characteristicId}-${selectedValueId}`}
              a11yTitle={t('SurveyTask.CharacteristicsFilter.removeFilter', { valueLabel: label })}
              label={
                <FilterLabel
                  characteristicId={characteristicId}
                  selected={true}
                  valueId={selectedValueId}
                  valueImageSrc={valueImageSrc}
                  valueLabel={label}
                />
              }
              margin={{
                bottom: 'xxsmall',
                left: 'xxsmall'
              }}
              onClick={clearSelection}
              plain
            />
          )
        })}
      </Box>
      {(selectedCharacteristicIds.length && !filterOpen) ? (
        <ClearFilters
          onClick={() => handleFilter()}
          showingChoices={showingChoices}
          totalChoices={choices.size}
        />
      ) : null}
      <Collapsible
        id='characteristics-collapsible'
        open={filterOpen}
      >
        <Characteristics
          characteristics={characteristics}
          characteristicsOrder={characteristicsOrder}
          filters={filters}
          handleFilterOpen={handleFilterOpen}
          images={images}
          onFilter={handleFilter}
          strings={strings}
        />
      </Collapsible>
    </Box>
  )
})

FilterStatus.propTypes = {
  disabled: PropTypes.bool,
  filterOpen: PropTypes.bool,
  filters: PropTypes.objectOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleFilterOpen: PropTypes.func,
  showingChoices: PropTypes.number,
  task: PropTypes.shape({
    help: PropTypes.string,
    required: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    taskKey: PropTypes.string,
    type: PropTypes.string
  }).isRequired
}

FilterStatus.displayName = 'FilterStatus'

export default FilterStatus
