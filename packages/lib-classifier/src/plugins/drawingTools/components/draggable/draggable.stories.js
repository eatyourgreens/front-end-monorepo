import SVGContext from '@plugins/drawingTools/shared/SVGContext'
import { cloneElement, createRef, Component, forwardRef } from 'react'
import draggable from './draggable'

const TestComponent = forwardRef(({ x, y }, ref) => {
  return <circle ref={ref} fill='blue' r={50} cx={x} cy={y} />
})

const DraggableCircle = draggable(TestComponent)

class DraggableStory extends Component {
  constructor() {
    super()
    this.svgRef = createRef()
    this.dragMove = this.dragMove.bind(this)
    this.state = {
      x: 50,
      y: 100
    }
  }

  dragMove(e, d) {
    const { x, y } = this.state
    x += d.x
    y += d.y
    this.setState({ x, y })
  }

  render() {
    const { children } = this.props
    const { x, y } = this.state
    const { dragMove } = this
    const svg = this.svgRef.current
    const getScreenCTM = () => svg.getScreenCTM()
    return (
      <SVGContext.Provider value={{ svg, getScreenCTM }}>
        <svg viewBox='0 0 300 400' height={300} width={400} ref={this.svgRef}>
          {cloneElement(children, { dragMove, x, y })}
        </svg>
      </SVGContext.Provider>
    )
  }
}

export default {
  title: 'Drawing Tools / draggable'
}

export const Default = function () {
  return (
    <DraggableStory>
      <DraggableCircle />
    </DraggableStory>
  )
}
