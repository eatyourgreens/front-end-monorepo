import { Provider } from 'mobx-react'
import { Box } from 'grommet'
import mockStore from '@test/mockStore'
import mockWorkflow from './mocks/mockWorkflow'

import TaskNavButtons from './TaskNavButtons'

function ComponentDecorator(Story) {
  return (
    <Box
      background={{ light: 'white', dark: 'dark-1' }}
      pad='small'
      width='25rem'
    >
      <Story />
    </Box>
  )
}

export default {
  title: 'Tasks / Nav Buttons',
  component: TaskNavButtons,
  decorators: [ComponentDecorator]
}


const defaultStore = mockStore()

export const Default = () => {
  return (
    <Provider classifierStore={defaultStore}>
      <TaskNavButtons />
    </Provider>
  )
}


/* 
  TaskNavButtons are disabled when the subject is still loading, or when the active 
  task !isComplete (see TasksConnector). Those cases are tested in Tasks, not in this componnent.
*/
export const Disabled = () => {
  return (
    <Provider classifierStore={defaultStore}>
      <TaskNavButtons disabled />
    </Provider>
  )
}


/* Only the NextButton appears  */
const nextButtonStore = mockStore({ workflow: mockWorkflow })
// Select the first choice in a single answer question
nextButtonStore.classifications.active.annotation({ taskKey: 'T0' }).update(0)

export const Next = () => {
  return (
    <Provider classifierStore={nextButtonStore}>
      <TaskNavButtons />
    </Provider>
  )
}

/* There is a next required step, so the NextButton and BackButton appear */
const nextOrBackStore = mockStore({ workflow: mockWorkflow })
// Select the first choice in a single answer question
nextOrBackStore.classifications.active.annotation({ taskKey: 'T0' }).update(0)
// Advance to the next step
nextOrBackStore.subjects.active.stepHistory.next()
// Select two answers in the multiple choice question
nextOrBackStore.classifications.active.annotation({ taskKey: 'T1' }).update([1, 2])

export const NextOrBack = () => {
  return (
    <Provider classifierStore={nextOrBackStore}>
      <TaskNavButtons />
    </Provider>
  )
}


/* All tasks are complete and this is the last step so BackButton, DoneButton, and DoneAndTalk appear */
const backOrDoneStore = mockStore({ workflow: mockWorkflow })
// Select the first choice in a single answer question
backOrDoneStore.classifications.active.annotation({ taskKey: 'T0' }).update(0)
// Advance to the next step
backOrDoneStore.subjects.active.stepHistory.next()
// Select two answers in the multiple choice question
backOrDoneStore.classifications.active.annotation({ taskKey: 'T1' }).update([1, 2])
// Advance to the last step in the workflow
backOrDoneStore.subjects.active.stepHistory.next()
// Select the first choice in the last single answer question
backOrDoneStore.classifications.active.annotation({ taskKey: 'T2' }).update(0)

export const BackOrDone = () => {
  return (
    <Provider classifierStore={backOrDoneStore}>
      <TaskNavButtons />
    </Provider>
  )
}
