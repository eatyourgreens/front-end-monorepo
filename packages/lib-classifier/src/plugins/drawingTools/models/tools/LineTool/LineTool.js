import { types } from 'mobx-state-tree'
import Tool from '../Tool'
import { Line } from '../../marks'

const LineTool = types
  .model('Line', {
    marks: types.map(Line),
    type: types.literal('line')
  })
  .actions((self) => ({
    createMark(mark) {
      const newMark = Line.create(
        Object.assign({}, mark, { toolType: self.type })
      )
      self.marks.put(newMark)
      return newMark
    },

    handlePointerMove(event, mark) {
      mark.initialDrag(event)
    },

    handlePointerUp(event, mark) {
      mark.finish()
    },
  }))

export default types.compose('LineTool', Tool, LineTool)
