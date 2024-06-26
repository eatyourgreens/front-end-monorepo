import PropTypes from 'prop-types'
import { format } from '@visx/vendor/d3-format'
import { interpolate } from '@visx/vendor/d3-interpolate'
import { select } from 'd3'
import { useEffect, useRef, useState } from 'react'

const initialValue = 0

let prefersReducedMotion
const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function AnimatedNumber({ duration = 1000, value }) {
  const numRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  function animateValue() {
    select(numRef.current)
      .data([value])
      .transition()
      .duration(duration)
      .textTween(() => {
        const interpolator = interpolate(initialValue, value)
        return t => {
          const interpolatedValue = interpolator(t)
          if (interpolatedValue === value) setAnimated(true) // animation complete!
          const niceValue = formatValue(interpolatedValue)
          return niceValue
        }
      })
  }

  function lessAnimation() {
    select(numRef.current)
    .data([value])
    .transition()
    .duration(0)
    .textTween(() => {
      return () => {
        setAnimated(true) // animation complete!
        return formatValue(value)
      }
    })
  }

  function formatValue(num) {
    return format(',d')(num)
  }

  useEffect(() => {
    // If we already animated the number once, don't observe intersection
    // This could happen if the value prop updates, but page did not refresh
    if (animated) return

    const numElement = numRef.current

    const intersectionObserver = new window.IntersectionObserver(entries => {
      // If intersectionRatio is 0, the target is out of view and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) return

      // Once target element is in viewport, animate it then unobserve
      if (!prefersReducedMotion && !animated) {
        animateValue()
        intersectionObserver.unobserve(numElement)
      } else {
        lessAnimation()
        intersectionObserver.unobserve(numElement)
      }
    })

    intersectionObserver.observe(numElement)

    return () => {
      intersectionObserver.disconnect()
    }
  }, [numRef.current, animated])

  return <span ref={numRef}>{!animated ? initialValue : formatValue(value)}</span>
}

AnimatedNumber.propTypes = {
  duration: PropTypes.number,
  value: PropTypes.number.isRequired
}

export default AnimatedNumber
