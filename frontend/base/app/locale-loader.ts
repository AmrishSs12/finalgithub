import { registerLocaleData } from '@angular/common';
// To prevent re-registering
const registeredLocales = new Set<string>();

export async function registerLocaleIfNeeded(locale: string): Promise<void> {
    const shortLocale = locale.substring(0, 2);

  if (registeredLocales.has(shortLocale)) return;

  try {
    const localeModule = await import(
        /* webpackInclude: /(en|de|fr|ru|tr|it|pl|uk|nl|ja|ko|zh|cs|es|no|hu|ro|th|da|pt)\.mjs$/ */
        `../../node_modules/@angular/common/locales/${shortLocale}.mjs`
      );
      registerLocaleData(localeModule.default);
  

    registeredLocales.add(shortLocale);
    console.log(`Registered locale: ${shortLocale}`);
  } catch (err) {
    console.warn(`Failed to load locale "${shortLocale}"`, err);
  }
}