# react-i18next for Translations

The `/locales` folder contains json dictionary files for translatable strings in app-project. `next-i18next` is an internationalization framework for Next.js, and it uses `react-i18next` under the hood.


## Adding New Dictionary Keys

`/en` contains the primary dictionary for translated strings in this app. Dictionaries in this folder are the only ones that should be edited manually in a local dev environment. An example of how to translate a component can be found below.


## Translating a Component

Import `useTranslation()` hook. Use `.` to indicate nested object keys. Alternatively, [react-i18next docs](https://react.i18next.com/latest/withtranslation-hoc) show how to translate a class component.

```js
import { useTranslation } from 'next-i18next'
const MyComponent = () => {
  const { t } = useTranslation()
  return (
    <p>{t('Path.To.Translation.Key')}</p>
  )
}
```


## Adding a Language

FEM is integrated with [Lokalise](https://app.lokalise.com) for translations management. Any dictionary other than `/en` should be managed through the Lokalise Dashboard. Instructions on how to import and export dictionary files can be found in the how-to-zooniverse [Translations](https://github.com/zooniverse/how-to-zooniverse/tree/master/Translations) folder.

Check that any added language is in the `locales` array in [next-i18next.config.js](/zooniverse/front-end-monorepo/blob/master/packages/app-content-pages/next-i18next.config.js).

```js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    defaultNS: 'components',
    locales: ['en', 'fr', 'test']
  }
}
```
