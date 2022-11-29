import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next} from 'react-i18next';
// source for translation: https://youtu.be/baLjPx_wFi4
i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",  
        },
        fallbackLng: "en",
        debug: false,
        ns: ["i18n"],


        interpolation: {
            escapeValue: false,
            formatSeparator: ",",
        },
        react: {
            wait: true,
        },
    });

export default i18n;