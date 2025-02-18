import PropTypes from 'prop-types'
import { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components'
import { MobXProviderContext } from 'mobx-react'
import { Tooltip } from '@zooniverse/react-components'
import { useTranslation } from '@translations/i18n'

import TooltipIcon from './components/TooltipIcon'
import TranscriptionLineMark from './components/TranscriptionLineMark'

function storeMapper(stores) {
  return stores.classifierStore.workflows.active?.usesTranscriptionTask || false
}

function TranscriptionLine(props) {
  let transcriptionTaskColors = {}
  const stores = useContext(MobXProviderContext)
  const theme = useContext(ThemeContext)
  const [allowFinish, setAllowFinish] = useState(false)
  const usesTranscriptionTask = storeMapper(stores)
  const { active, color, mark, onFinish, scale, state } = props
  const { t } = useTranslation('plugins')
  if (theme) {
    transcriptionTaskColors = {
      active: theme.global.colors.drawingTools.green,
      default: theme.global.colors.drawingTools.blue,
      transcribed: theme.global.colors.drawingTools.pink,
      complete: theme.global.colors['light-5']
    }
  }

  let lineState = state || 'default'
  if (active) {
    lineState = 'active'
  }
  const colorToRender = (usesTranscriptionTask) ? transcriptionTaskColors[lineState] : color

  function onHandleDrag(coords) {
    mark.setCoordinates(coords)
  }

  function handlePointerDown(event) {
    event.stopPropagation()
    event.preventDefault()
    setAllowFinish(true)
  }

  function handleFinishClick(event) {
    if (allowFinish) {
      mark.finish()
      onFinish(event)
    }
  }

  if (usesTranscriptionTask && lineState === 'active' || lineState === 'default') {
    const tooltipLabel = (lineState === 'active') ? t('TranscriptionLine.editing') : t('TranscriptionLine.created')
    return (
      <Tooltip
        icon={<TooltipIcon fill={colorToRender} />}
        label={tooltipLabel}
      >
        <TranscriptionLineMark
          active={active}
          color={colorToRender}
          handlePointerDown={handlePointerDown}
          handleFinishClick={handleFinishClick}
          mark={mark}
          onHandleDrag={onHandleDrag}
          scale={scale}
        />
      </Tooltip>
    )
  }

  return (
    <TranscriptionLineMark
      active={active}
      color={colorToRender}
      handlePointerDown={handlePointerDown}
      handleFinishClick={handleFinishClick}
      mark={mark}
      onHandleDrag={onHandleDrag}
      scale={scale}
    />
  )
}

TranscriptionLine.propTypes = {
  active: PropTypes.bool,
  color: PropTypes.string,
  mark: PropTypes.object.isRequired,
  onFinish: PropTypes.func,
  scale: PropTypes.number,
  state: PropTypes.string
}

TranscriptionLine.defaultProps = {
  active: false,
  color: '',
  onFinish: () => true,
  scale: 1,
  state: ''
}

export default TranscriptionLine
