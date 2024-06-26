import Certificate from './Certificate'

export default {
  title: 'Components/Certificate',
  component: Certificate
}

export const Default = {
  args: {
    creditedName: 'Example T. User',
    displayName: 'ExampleUser',
    hours: 45,
    login: 'testUser',
    projectsCount: 67,
    selectedDateRange: 'AllTime',
    selectedProject: 'AllProjects'
  }
}

export const ProjectSpecific = {
  args: {
    creditedName: 'Example T. User',
    displayName: 'Example User',
    hours: 45,
    login: 'testUser',
    selectedDateRange: 'AllTime',
    selectedProject: 'Galaxy Zoo'
  }
}

export const Last7Days = {
  args: {
    creditedName: 'Example T. User',
    displayName: 'Example User',
    hours: 45,
    login: 'testUser',
    projectsCount: 67,
    selectedDateRange: 'Last7Days',
    selectedProject: 'AllProjects'
  }
}

export const Last30Days = {
  args: {
    creditedName: 'Example T. User',
    displayName: 'Example User',
    hours: 45,
    login: 'testUser',
    projectsCount: 67,
    selectedDateRange: 'Last30Days',
    selectedProject: 'AllProjects'
  }
}
