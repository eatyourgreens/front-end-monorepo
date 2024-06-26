import { Box } from 'grommet'

import SlideTutorial from './SlideTutorial'
import { TutorialMediumFactory } from '@test/factories'

const media = [
  TutorialMediumFactory.build({
    src: 'https://panoptes-uploads-staging.zooniverse.org/project_attached_image/79f23ef0-f07f-42cf-b250-841c6c557d2a.jpeg'
  }),
  TutorialMediumFactory.build({
    src: 'https://panoptes-uploads-staging.zooniverse.org/project_attached_image/cb1b4745-a2df-40c6-ab16-381d109f20c8.jpeg'
  })
]

const steps = [
  {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    medium: media[0].id
  },
  {
    content:
      'Phasellus augue diam, dignissim sit amet nulla id, congue elementum sapien. Quisque consectetur mi sed ex euismod, in rutrum eros tincidunt. Proin at massa erat. Fusce bibendum, mauris sed lacinia cursus, turpis risus dapibus eros, eu pharetra mauris turpis ut sem. Curabitur hendrerit quam id odio eleifend maximus. Morbi imperdiet fringilla nibh nec ullamcorper. Mauris consequat arcu vitae tristique venenatis. Donec purus nulla, aliquet non commodo vestibulum, fermentum non quam. Aliquam tristique nibh orci, id sagittis odio feugiat eget. ',
    medium: media[1].id
  }
]

const strings = {
  display_name: 'A slide tutorial',
  'steps.0.content': steps[0].content,
  'steps.1.content': steps[1].content
}

function stepWithMedium(index) {
  const medium = media[index]
  const step = steps[index]
  return { medium, step }
}

export default {
  title: 'Other / SlideTutorial',
  component: SlideTutorial,
  argTypes: {
    onClick: {
      action: 'clicked'
    }
  },
  args: {
    height: '100%',
    projectDisplayName: 'Snapshot Guinea Pig',
    steps,
    stepWithMedium,
    width: '40vw'
  }
}

export function Default({
  height,
  onClick,
  projectDisplayName,
  steps,
  stepWithMedium,
  width
}) {
  return (
    <Box height='medium' width={width}>
      <SlideTutorial
        height={height}
        onClick={onClick}
        projectDisplayName={projectDisplayName}
        steps={steps}
        stepWithMedium={stepWithMedium}
        strings={strings}
        width={width}
      />
    </Box>
  )
}

export function Tablet({ onClick, projectDisplayName, steps, stepWithMedium }) {
  return (
    <Box height='medium' width='large'>
      <SlideTutorial
        height='100%'
        onClick={onClick}
        projectDisplayName={projectDisplayName}
        steps={steps}
        stepWithMedium={stepWithMedium}
        width='100%'
      />
    </Box>
  )
}
Tablet.parameters = {
  viewport: {
    defaultViewport: 'ipad'
  }
}
