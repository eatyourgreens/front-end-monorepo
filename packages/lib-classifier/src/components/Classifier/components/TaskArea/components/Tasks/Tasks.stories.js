import asyncStates from '@zooniverse/async-states'
import { MockTask } from '@stories/components'
import Tasks from './Tasks'

export default {
  title: 'Tasks / General',
  component: Tasks,
  args: {
    isThereTaskHelp: true,
    required: false,
    subjectReadyState: asyncStates.success
  },
  argTypes: {
    loadingState: {
      control: {
        type: 'select',
        options: asyncStates
      }
    },
    subjectReadyState: {
      control: {
        type: 'select',
        options: asyncStates
      }
    }
  }
}

export function Loading() {
  return (
    <MockTask
      loadingState={asyncStates.loading}
    />
  )
}

export function Error() {
  return (
    <MockTask
      loadingState={asyncStates.error}
    />
  )
}

export function MultipleTasks({ isThereTaskHelp, required, subjectReadyState }) {
  const tasks = {
    init: {
      answers: [{ label: 'yes' }, { label: 'no' }],
      required,
      strings: {
        help: isThereTaskHelp ? 'Choose an answer from the choices given, then press Done.' : '',
        question: 'Is there a cat?',
        'answers.0.label': 'yes',
        'answers.1.label': 'no'
      },
      taskKey: 'init',
      type: 'single'
    },
    T1: {
      answers: [{ label: 'sleeping' }, { label: 'playing' }, { label: 'looking indifferent' }],
      required,
      strings: {
        help: isThereTaskHelp ? 'Pick as many answers as apply, then press Done.' : '',
        question: 'What is it doing?',
        'answers.0.label': 'sleeping',
        'answers.1.label': 'playing',
        'answers.2.label': 'looking indifferent'
      },
      taskKey: 'T1',
      type: 'multiple'
    }
  }
  return (
    <MockTask
      isThereTaskHelp={isThereTaskHelp}
      subjectReadyState={subjectReadyState}
      tasks={tasks}
    />
  )
}
