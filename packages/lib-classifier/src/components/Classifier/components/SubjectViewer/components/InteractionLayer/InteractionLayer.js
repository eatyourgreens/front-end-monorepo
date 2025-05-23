import cuid from 'cuid'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react';
import styled, { css } from 'styled-components'

import { convertEvent } from '@plugins/drawingTools/components/draggable/draggable'
import DrawingToolMarks from './components/DrawingToolMarks'
import TranscribedLines from './components/TranscribedLines'
import SubTaskPopup from './components/SubTaskPopup'
import { isInBounds } from './helpers/isInBounds'
import getFixedNumber from '../../helpers/getFixedNumber'

const DrawingCanvas = styled('rect')`
  ${(props) =>
    props.disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: crosshair;
        `}
`

function cancelEvent(event) {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Render a drawing canvas for the current drawing task, including:
 * - a canvas that handles pointer events while creating a new mark.
 * - previously transcribed lines if the current task is a transcription task.
 * - popups for any subtasks of the current task's tools.
 * - editable marks created by the current drawing task.
 */
function InteractionLayer({
  activeMark,
  activeTool,
  activeToolIndex = 0,
  annotation,
  disabled = false,
  frame = 0,
  height,
  marks = [],
  move,
  multiImageCloneMarkers = false,
  setActiveMark = () => { },
  width,
  played,
  duration
}) {
  const [creating, setCreating] = useState(false)
  const canvasRef = useRef(null)

  if (creating && !activeMark) {
    setCreating(false)
  }

  if (activeMark?.finished && !activeMark.isValid) {
    activeTool.deleteMark(activeMark)
    setActiveMark(undefined)
  }

  function createMark(event) {
    const timeStamp = getFixedNumber(played, 5)
    const mark = activeTool.createMark({
      id: cuid(),
      // GH Issue 5493 decided multiImageCloneMarkers force new mark frames to 0
      frame: (multiImageCloneMarkers) ? 0 : frame,
      toolIndex: activeToolIndex
    })

    mark.initialPosition(convertEvent(event, canvasRef.current))
    setActiveMark(mark)
    setCreating(true)
    mark.setSubTaskVisibility(false)
    // Add a time value for tools that care about time. For most tools, this value is ignored.
    mark.setVideoTime(timeStamp, duration)
    const markIDs = annotation.value?.map((mark) => mark.id)
    annotation.update([...markIDs, mark.id])
  }

  function onPointerDown(event) {
    if (!disabled) {
      cancelEvent(event)
    }
    if (disabled || move) {
      return true
    }
    const { target, pointerId } = event
    target.setPointerCapture(pointerId)

    if (!activeTool.type) {
      return false
    }

    if (creating) {
      activeTool?.handlePointerDown?.(convertEvent(event, canvasRef.current), activeMark)
      if (activeMark.finished) onFinish(event)
      return true
    }

    createMark(event)
    return false
  }

  function onPointerMove(event) {
    cancelEvent(event)
    if (creating) {
      activeTool?.handlePointerMove?.(convertEvent(event, canvasRef.current), activeMark)
    }
  }

  function onFinish(event) {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    setCreating(false)
    if (activeMark.element && !isInBounds(activeMark.element, canvasRef.current)) {
      activeTool.deleteMark(activeMark)
      setActiveMark(undefined)
    }
  }

  function onPointerUp(event) {
    cancelEvent(event)
    if (creating) {
      activeTool?.handlePointerUp?.(convertEvent(event, canvasRef.current), activeMark)
      if (activeMark.finished) onFinish(event)
    }
  }

  function onSelectMark(mark) {
    setActiveMark(mark)
  }

  function inactivateMark() {
    setActiveMark(undefined)
  }

  return (
    <>
      <DrawingCanvas
        ref={canvasRef}
        disabled={disabled || move}
        pointerEvents={move ? 'none' : 'all'}
        width={width}
        height={height}
        fill='transparent'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <TranscribedLines />
      <SubTaskPopup
        activeMark={activeMark}
        onDelete={inactivateMark}
      />
      <DrawingToolMarks
        activeMark={activeMark}
        marks={marks}
        onDelete={inactivateMark}
        onDeselectMark={inactivateMark}
        onFinish={onFinish}
        onSelectMark={onSelectMark}
        onMove={(mark, difference) => mark.move(difference)}
        pointerEvents={creating ? 'none' : 'painted'}
        played={played}
      />
    </>
  )
}

InteractionLayer.propTypes = {
  /** The active, or selected, mark. */
  activeMark: PropTypes.object,
  /** The selected drawing tool. */
  activeTool: PropTypes.object.isRequired,
  activeToolIndex: PropTypes.number,
  /** Annotation for the current drawing task. */
  annotation: PropTypes.shape({
    task: PropTypes.string,
    taskType: PropTypes.string,
    value: PropTypes.array
  }).isRequired,
  /** Disable creating new marks. */
  disabled: PropTypes.bool,
  /** Index of the Frame. Initially inherits from parent Viewer or overwritten in Viewer with SubjectViewerStore */
  frame: PropTypes.number,
  /** Height of the canvas in SVG coordinates. */
  height: PropTypes.number.isRequired,
  /** Array of marks for the current drawing task. */
  marks: PropTypes.array,
  multiImageCloneMarkers: PropTypes.bool,
  setActiveMark: PropTypes.func,
  /** Width of the canvas in SVG coordinates. */
  width: PropTypes.number.isRequired
}

export default InteractionLayer
export { DrawingCanvas }
