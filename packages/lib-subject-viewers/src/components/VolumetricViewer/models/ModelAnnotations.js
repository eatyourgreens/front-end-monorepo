import { SortedSet, SortedSetUnion } from './../helpers/SortedSet.js'

const THRESHOLD_DEFAULT = 30
let ANNOTATION_COUNT = 0

// Creates the base object for an Annotation
export const AnnotationBase = ({ point }) => {
  return {
    label: `Annotation ${++ANNOTATION_COUNT}`,
    threshold: THRESHOLD_DEFAULT,
    points: {
      active: [point], // each individual point
      connected: [], // SortedSet of points from each active point
      all: SortedSet({ data: [] }) // SortedSet of all connected points
    }
  }
}

// Manages History at a Global level
const History = {
  state: [],
  stateRedo: [], // only used for redo operations
  add: (action) => {
    History.state.push(action)
  },
  undo: ({ historyItem }) => {
    // TRAVDO: Still to implement
    console.log('History.undo() historyItem', historyItem)

    if (historyItem.action === 'annotation.add') {
      // console.log('TODO')
    } else if (historyItem.action === 'annotation.remove') {
      // console.log('TODO')
    } else if (historyItem.action === 'point.add') {
      // console.log('TODO')
    }
  },
  redo: ({ historyItem }) => {
    // TRAVDO: Still to implement
    console.log('History.redo() historyItem', historyItem)

    if (historyItem.action === 'annotation.add') {
      // console.log('TODO')
    } else if (historyItem.action === 'annotation.remove') {
      // console.log('TODO')
    } else if (historyItem.action === 'point.add') {
      // console.log('TODO')
    }
  }
}

export const ModelAnnotations = () => {
  const annotationModel = {
    annotations: [],
    config: {
      activeAnnotation: null, // index of annotation that is currently active
      algorithm: null,
      viewer: false
    },
    initialize: (config) => {
      annotationModel.config = {
        ...annotationModel.config,
        ...config
      }
    },
    actions: {
      annotation: {
        add: ({ point }) => {
          const annotationIndex = annotationModel.annotations.length
          const annotation = AnnotationBase({
            point
          })

          // if algorithm, get connected points
          if (annotationModel.config.algorithm) {
            annotation.points.all = annotationModel.config.algorithm({
              annotation,
              point,
              viewer: annotationModel.config.viewer
            })

            annotation.points.connected[0] = annotation.points.all.data
          } else {
            annotation.points.connected[0] = []
          }

          // Update the Annotation Data
          annotationModel.annotations.push(annotation)
          annotationModel.config.activeAnnotation = annotationIndex

          // Update the Viewer Annotation Data
          annotationModel.config.viewer.setPointsAnnotationIndex({
            points: annotation.points.connected[0],
            index: annotationIndex
          })

          // Create the history object
          History.add({
            action: 'annotation.add',
            data: annotation
          })

          // Publish the change
          annotationModel.publish('add:annotation', {
            annotation,
            annotationIndex,
            annotations: annotationModel.annotations
          })
        },
        active: ({ index }) => {
          // Update the Annotation Data
          annotationModel.config.activeAnnotation = index

          // Publish the change
          annotationModel.publish('active:annotation', {
            annotationIndex: index,
            annotations: annotationModel.annotations
          })
        },
        remove: ({ index }) => {
          const annotation = annotationModel.annotations[index]
          annotation.annotationIndex = index

          // Update the Annotation Data
          if (annotationModel.config.activeAnnotation === index) {
            annotationModel.config.activeAnnotation = null
          } else if (annotationModel.config.activeAnnotation > index) {
            // we're removing an annotation that's earlier in the array
            annotationModel.config.activeAnnotation =
              annotationModel.config.activeAnnotation - 1
          }

          // Update the Viewer Annotation Data
          annotationModel.config.viewer.setPointsAnnotationIndex({
            points: annotation.points.all.data,
            index: -1
          })

          // Create the history object
          History.add({
            action: 'annotation.remove',
            data: annotation
          })

          // Add to the AnnotationsModel
          annotationModel.annotations.splice(index, 1)

          // Publish the change
          annotationModel.publish('remove:annotation', {
            annotation,
            annotationIndex: index,
            annotations: annotationModel.annotations
          })
        }
      },
      point: {
        add: ({ annotationIndex = null, point }) => {
          // check if we have an active annotation
          if (
            annotationIndex === null &&
            annotationModel.config.activeAnnotation === null
          ) {
            annotationModel.actions.annotation.add({ point })
          } else {
            const _index = annotationIndex || annotationModel.config.activeAnnotation
            const annotation = annotationModel.annotations[_index]
            const pointIndex = annotation.points.active.length

            // if algorithm, get connected points
            const connectedPoints = annotationModel.config.algorithm
              ? annotationModel.config.algorithm({
                annotation,
                point,
                viewer: annotationModel.config.viewer
              })
              : SortedSet({ data: [] })

            // Update the Annotation Data
            annotation.points.active[pointIndex] = point
            annotation.points.connected[pointIndex] = connectedPoints.data
            annotation.points.all = SortedSetUnion({
              sets: [annotation.points.all, connectedPoints]
            })

            // Update the Viewer Annotation Data
            annotationModel.config.viewer.setPointsAnnotationIndex({
              points: annotation.points.connected[pointIndex],
              index: _index
            })

            // Create the history object
            History.add({
              action: 'point.add',
              data: {
                annotationIndex: _index,
                points: {
                  active: point,
                  connected: connectedPoints.data
                }
              }
            })

            // Publish the change
            annotationModel.publish('update:annotation', {
              annotation,
              annotationIndex: _index,
              annotations: annotationModel.annotations
            })
          }
        }
      }
    },
    export: () => {
      return annotationModel.annotations.map(annotation => {
        return {
          label: annotation.label,
          points: {
            active: [...annotation.points.active],
            connected: [...annotation.points.connected]
          },
          threshold: annotation.threshold
        }
      })
    },
    // Listeners
    _listeners: [],
    publish: (eventName, data) => {
      annotationModel._listeners.forEach((listener) => {
        if (listener.eventName === eventName) listener.cb(data)
      })
    },
    on: (eventName, cb) => {
      annotationModel._listeners.push({ eventName, cb })
    },
    off: (eventName, cb) => {
      const index = annotationModel._listeners.findIndex(
        (listener) => listener.eventName === eventName && listener.cb === cb
      )
      if (index > -1) annotationModel._listeners.splice(index, 1)
    }
  }

  return annotationModel
}
