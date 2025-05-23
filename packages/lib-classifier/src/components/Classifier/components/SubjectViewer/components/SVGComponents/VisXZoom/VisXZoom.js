import { localPoint } from '@visx/event'
import { Zoom } from '@visx/zoom'
import throttle from 'lodash/throttle'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

import { useKeyZoom } from '@hooks'
import ZoomEventLayer from '../ZoomEventLayer'

export const ZOOM_HOT_KEY = 'ctrlKey'

const defaultZoomConfig = {
  direction: 'both',
  minZoom: 1,
  maxZoom: 10,
  onWheelThrottleWait: 0,
  zoomInValue: 1.2,
  zoomOutValue: 0.8
}

const DEFAULT_HANDLER = () => true

/**
 * Decorate a React SVG component with zoom functionality from `@visx/zoom`.
 * https://airbnb.io/visx/docs/zoom
 * ```jsx
 *   <VisXZoom
 *     height={100}
 *     width={100}
 *     left={0}
 *     top={0}
 *     move
 *     zooming
 *     panning
 *     allowsScrolling
 *     zoomConfiguration={{
 *       direction: 'both',
 *       minZoom: 1,
 *       maxZoom: 10,
 *       zoomInValue: 1.2,
 *       zoomOutValue: 0.8
 *     }}
 *     onFirstScroll={onFirstScroll}
 *     onKeyDown={onKeyDown}
 *     setOnPan={setOnPan}
 *     setOnZoom={setOnZoom}
 *   >
 *    {(zoomProps) => <SVGComponent {...zoomProps} />}
 *  </VisXZoom>
 * ```
 */
function VisXZoom({
  allowsScrolling = false,
  children,
  constrain,
  height,
  left = 0,
  move = true,
  onFirstScroll = DEFAULT_HANDLER,
  onKeyDown,
  panning = false,
  setOnPan = DEFAULT_HANDLER,
  setOnZoom = DEFAULT_HANDLER,
  top = 0,
  width,
  zoomConfiguration = defaultZoomConfig,
  zooming = false,
}) {
  const { onKeyZoom } = useKeyZoom()
  const zoomRef = useRef(null)
  const hasScrolledRef = useRef(false)

  useEffect(function setCallbacks() {
    setOnPan(handleToolbarPan)
    setOnZoom(handleToolbarZoom)
  }, [setOnPan, setOnZoom])

  function wheelDelta(event) {
    const zoomValue = (-event.deltaY > 0) ? 1.1 : 0.9
    return { scaleX: zoomValue, scaleY: zoomValue }
  }

  const wheelHandler = zooming ? (e) => zoomRef.current?.handleWheel(e) : DEFAULT_HANDLER
  const throttledWheelHandler = throttle(wheelHandler, zoomConfiguration?.onWheelThrottleWait)
  
  function onWheel(event) {
    /* Default behaviour for subject viewers that don't scroll vertically.
    Cancel the default event (ignored unless the listener explicitly
    sets passive: false) and call the wheel handler with a throttled delay.
    */
    if (!allowsScrolling) {
      /* event.preventDefault() will throw a warning in the browser
      for passive events. To avoid that, use addEventListener with 
      { passive: false }.
      */
      event.preventDefault()
      return throttledWheelHandler(event)
    }

    /* If subject viewer allows scrolling,
    and user is not zooming with hot key, 
    check for first scroll event (hasScrolledRef is false), then
    set hasScrolledRef to true and
    call onFirstScroll callback.
    */
    if (allowsScrolling && !event[ZOOM_HOT_KEY] && !hasScrolledRef.current) {
      hasScrolledRef.current = true
      onFirstScroll()
    }
    
    /* Zoom if the zoom hot key is pressed.
    Passive event listeners, like React's onWheel or default browser wheel events,
    won't prevent the default wheel scroll, so style the document body to stop
    scrolling and remove scrollbars.
    */
    if (event[ZOOM_HOT_KEY]) {
      // Get the scrollbar width, if the container can be scrolled.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      /* Disable scroll in Safari (or for passive wheel events.) */
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth) {
        // Prevent the page from jumping when the scrollbar is removed.
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }

      /* the user is zooming with the hot key, so set hasScrolledRef to true */
      hasScrolledRef.current = true

      /* event.preventDefault() will throw a warning in the browser
      for passive events. To avoid that, use addEventListener with 
      { passive: false }.
      */
      event.preventDefault()
      return throttledWheelHandler(event)
    }
    /* If we aren't zooming, reset body styles to allow scrolling with 
    the mouse wheel */
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }

  function handleToolbarPan(xMultiplier, yMultiplier) {
    onPan(xMultiplier, yMultiplier)
  }

  function handleToolbarZoom(type) {
    const doZoom = {
      zoomin: zoomIn,
      zoomout: zoomOut,
      zoomto: zoomReset
    }

    if (doZoom[type]) {
      doZoom[type]()
    }
  }

  function zoomIn() {
    if (!zooming) return
    const { zoomInValue } = zoomConfiguration
    zoomRef.current.scale({ scaleX: zoomInValue, scaleY: zoomInValue })
  }

  function zoomOut() {
    if (!zooming) return
    const { zoomOutValue } = zoomConfiguration
    zoomRef.current.scale({ scaleX: zoomOutValue, scaleY: zoomOutValue })
  }

  function zoomReset() {
    if (!zooming) return
    zoomRef.current.reset()
  }

  function zoomToPoint(event, zoomDirection) {
    const { zoomInValue, zoomOutValue } = zoomConfiguration
    const zoomValue = (zoomDirection === 'in') ? zoomInValue : zoomOutValue
    const point = localPoint(event)
    zoomRef.current.scale({ scaleX: zoomValue, scaleY: zoomValue, point })
  }

  function onDoubleClick(event) {
    if (zooming) {
      zoomToPoint(event, 'in')
    } else {
      event.preventDefault()
    }
  }

  function onPan(xMultiplier, yMultiplier) {
    const { 
      transformMatrix: {
        translateX,
        translateY
      }
    } = zoomRef.current
    const panDistance = 20
    const newTransformation = {
      translateX: translateX - xMultiplier * panDistance,
      translateY: translateY - yMultiplier * panDistance
    }
    zoomRef.current.setTranslate(newTransformation)
  }

  function onPointerEnter() {
    if (zooming && !allowsScrolling) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = 'hidden'
    }
  }

  function onPointerLeave() {
    if (zooming) {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    if (!zoomRef.current.isDragging && !panning) return
    
    zoomRef.current.dragEnd()
  }

  return (
    <Zoom
      constrain={constrain}
      height={height}
      left={left}
      scaleXMin={zoomConfiguration.minZoom}
      scaleXMax={zoomConfiguration.maxZoom}
      scaleYMin={zoomConfiguration.minZoom}
      scaleYMax={zoomConfiguration.maxZoom}
      top={top}
      width={width}
      wheelDelta={wheelDelta}
    >
      {_zoom => {
        zoomRef.current = _zoom
        return (
          <ZoomEventLayer
            disabled={!zooming || !move}
            focusable
            height={height}
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown || onKeyZoom}
            onPointerEnter={onPointerEnter}
            onPointerDown={panning ? _zoom.dragStart : DEFAULT_HANDLER}
            onPointerMove={panning ? _zoom.dragMove : DEFAULT_HANDLER}
            onPointerUp={panning ? _zoom.dragEnd : DEFAULT_HANDLER}
            onPointerLeave={onPointerLeave}
            onWheel={onWheel}
            panning={panning}
            tabIndex={0}
            width={width}
          >
            {children({
              initialTransformMatrix: _zoom.initialTransformMatrix,
              transformMatrix: _zoom.transformMatrix,
              transform: _zoom.toString(),
              move
            })}
          </ZoomEventLayer>
        )
      }}
    </Zoom>
  )
}

VisXZoom.propTypes = {
  /** Allow window scrolling with the mouse wheel. */
  allowsScrolling: PropTypes.bool,
  /** 
   * Custom constraints on the SVG transformation matrix.
   * https://airbnb.io/visx/docs/zoom#Zoom_constrain
  */
  constrain: PropTypes.func,
  /** Height in SVG viewport. */
  height: PropTypes.number.isRequired,
  /** Left coordinate in SVG viewport. */
  left: PropTypes.number,
  /** True if pan and zoom is enabled in the subject toolbar. */
  move: PropTypes.bool,
  /** Custom callback for keydown events. */
  onKeyDown: PropTypes.func,
  /** Callback for first scroll event when allowsScrolling is true */
  onFirstScroll: PropTypes.func,
  /** Enable panning. Ignored if zooming is false. */
  panning: PropTypes.bool,
  /** Set the subject toolbar's onPan callback in the classifier store. */
  setOnPan: PropTypes.func,
  /** Set the subject toolbar's onZoom callback in the classifier store. */
  setOnZoom: PropTypes.func,
  /** Top coordinate in SVG viewport. */
  top: PropTypes.number,
  /** Width in SVG viewport. */
  width: PropTypes.number.isRequired,
  /** Zoom configuration for the subject or workflow. */
  zoomConfiguration: PropTypes.shape({
    /** Allowed directions for zoom. */
    direction: PropTypes.oneOf(['both', 'x', 'y']),
    /** Minimum zoom scale. */
    minZoom: PropTypes.number,
    /** Maximum zoom scale. */
    maxZoom: PropTypes.number,
    /** Zoom in scale step. */
    zoomInValue: PropTypes.number,
    /** Zoom out scale step. */
    zoomOutValue: PropTypes.number
  }),
  /** Enable zooming. true by default. */
  zooming: PropTypes.bool,
  /** A child render function that injects the following props into the zoomed component.
   * 
   * - `initialTransformMatrix`: the initial transformation matrix.
   * - `transformMatrix`: the current transformation matrix.
   * - `transform`: a string representation of the matrix transform.
   * 
   * It must render SVG, **not** HTML.
   * ```jsx
   * {(zoomProps) => <SVGComponent {...zoomProps} />}
   * ```
  */
  children: PropTypes.func.isRequired
}

export default observer(VisXZoom)
