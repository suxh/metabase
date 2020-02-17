import { addLocale, useLocale } from "ttag";
import moment from "moment";

// NOTE: loadLocalization not currently used, and we need to be sure to set the
// initial localization before loading any files, so don't load metabase/services
// just in case

// import { I18NApi } from "metabase/services";
//
// export async function loadLocalization(locale) {
//   // load and parse the locale
//   const translationsObject = await I18NApi.locale({ locale });
//   setLocalization(translationsObject);
// }

export function setLocalization(translationsObject) {
  const locale = translationsObject.headers.language;

  addMsgIds(translationsObject);

  // add and set locale with C-3PO
  addLocale(locale, translationsObject);
  useLocale(locale);

  moment.locale(locale);
}

// Format a fixed timestamp in local time to see if the current locale defaults
// to using a 24 hour clock.
export function isLocale24Hour() {
  const formattedTime = moment("2000-01-01T13:00:00").format("LT");
  return /^13:/.test(formattedTime);
}

// we delete msgid property since it's redundant, but have to add it back in to
// make ttag happy
function addMsgIds(translationsObject) {
  const msgs = translationsObject.translations[""];
  for (const msgid in msgs) {
    if (msgs[msgid].msgid === undefined) {
      msgs[msgid].msgid = msgid;
    }
  }
}

// set the initial localization
if (window.MetabaseLocalization) {
  setLocalization(window.MetabaseLocalization);
}
