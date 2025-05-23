# Zooniverse Front End - Project

A [Next.js](https://github.com/zeit/next.js) app for handling the project routes, including classification.

## Ops

- [Jenkins](https://jenkins.zooniverse.org/job/Zooniverse%20GitHub/job/front-end-monorepo/)
- [New Relic](https://rpm.newrelic.com/accounts/23619/applications/319037531)

## Getting started

This package should be cloned as part of the [front-end-monorepo](https://github.com/zooniverse/front-end-monorepo).

## Running in development

Starts a development server on port 3000 and a Storybook server on port 9001 by default. In addition, you must have the local sub-domain [setup](https://stackoverflow.com/c/zooniverse/questions/109) to get past CORS errors when authenticating with Panoptes in your hosts file.

Once you have the hosts file configured, you'll be able to use one of those subdomains to do local development for projects on and be able to authenticate with Panoptes, i.e. at `https://local.zooniverse.org:3000/projects/brooke/i-fancy-cats` or `https://localhost.zooniverse.org:3000/projects/brooke/i-fancy-cats`.

### Docker

```sh
# run a development build using the top-level Dockerfile
docker compose build
# run a dev server on port 3000 (with HTTPS, but no authentication) and a storybook on port 9001.
# eg. https://localhost:3000/projects/nora-dot-eisner/planet-hunters-tess
# http://localhost:9001
docker compose up -d
# stop the local services when you're finished
docker compose down
# run the tests
docker compose run --rm project test
```

### Node
```sh
yarn dev
yarn storybook
```

If you want to run the app using a node inspect mode, run `yarn dev:inspect`. Then you can [connect your preferred debugger](https://nextjs.org/docs/advanced-features/debugging#step-2-connect-to-the-debugger) to be able to see the server logs and debug.

## Running in production

Next.js [treats the build and serve tasks as separate steps](https://github.com/zeit/next.js/#production-deployment) when running in production.

The production server is started on port 3000 by default.

### Docker

- `docker-compose run --rm project start` to run a webpack production build on http://localhost:3000. The `--build` flag can be used to build the container. This builds and runs a local image which matches the Jenkins build except for running behind a proxy.

### Node
```sh
yarn build
yarn start
```

### Tests

See [Testing](#testing) for more details.

#### Docker
Run the whole test suite in the container and exit
```
# run the tests in the docker container
docker-compose run --rm dev test
```
Interactively run the test suite from a bash shell in the container
```
# launch an interactive bash shell in the dev app
docker-compose run --rm --entrypoint="/bin/bash" dev

# change directory to the desired app (app-project)
cd packages/app-project/

# run the tests for this app
yarn test
```

#### Node/yarn
```sh
yarn test
```

## <a name="testing"></a> Testing

  Testing is done by

  - [Mocha](https://mochajs.org/) - test runner
  - [Chai](https://www.chaijs.com/) - BDD/TDD assertion library
  - [Sinon](https://sinonjs.org) - test spies, mocks, and stubs
  - [Enzyme](https://airbnb.io/enzyme/) - testing utility for React

## Technologies

  - @zooniverse/panoptes-js - Panoptes API javascript client
  - @zooniverse/classifier - Zooniverse's classifier
  - @zooniverse/react-components - Zooniverse common React components
  - @zooniverse/grommet-theme - Zooniverse brand Grommet theme
  - [Grommet](https://v2.grommet.io/components) - React UI component library
  - [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree/) - App state built on MobX
  - [mobx-react](https://github.com/mobxjs/mobx-react) - Mobx React bindings
  - [next.js](https://nextjs.org/) - Server-side rendering and routing framework
  - [React.js](https://reactjs.org/)  - Component, virtual DOM based javascript library
  - [styled-components](https://www.styled-components.com/) - CSS in JS styling library.
