import i18n from 'i18next'
import {
  initReactI18next,
  useTranslation as useBaseTranslation
} from 'react-i18next'

const namespaces = ['components', 'plugins']

/** supportedLngs array matches app-project's next-i18next.config.js */
const supportedLngs = [
  'ar',
  'cs',
  'de',
  'en',
  'es',
  'fr',
  'he',
  'hi',
  'hr',
  'id',
  'it',
  'ja',
  'nl',
  'pl',
  'pt',
  'ru',
  'sv',
  'test',
  'tr',
  'ur',
  'zh-CN',
  'zh-TW'
]

const classifierI18n = i18n.createInstance()
classifierI18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },
  react: {
    useSuspense: false
  }
})

supportedLngs.forEach((lang) => {
  namespaces.forEach((n) => {
    classifierI18n.addResourceBundle(
      lang,
      n,
      require(`./${lang}/${n}.json`)
    )
  })
})

export function useTranslation(ns) {
  return useBaseTranslation(ns, { i18n: classifierI18n })
}

export function withTranslation(ns) {
  return (Component) => {
    return function TranslatedComponent(props) {
      const { t } = useTranslation(ns)
      return <Component i18n={classifierI18n} t={t} {...props} />}
  }
}

export default classifierI18n
