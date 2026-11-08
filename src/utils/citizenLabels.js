// src/utils/citizenLabels.js
import isoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import arLocale from "i18n-iso-countries/langs/ar.json";

isoCountries.registerLocale(enLocale);
isoCountries.registerLocale(arLocale);

const COUNTRY_ALIASES = {
  "United States": "US",
  "United Kingdom": "GB",
  "Czech Republic": "CZ",
  "Ivory Coast": "CI",
  "Democratic Republic of the Congo": "CD",
  Congo: "CG",
  "North Korea": "KP",
  "South Korea": "KR",
  "North Macedonia": "MK",
  "Timor-Leste": "TL",
  "Vatican City": "VA",
  Turkey: "TR",
  Syria: "SY",
  Iran: "IR",
  Russia: "RU",
  Laos: "LA",
  Brunei: "BN",
  Moldova: "MD",
  Tanzania: "TZ",
  Bolivia: "BO",
  Venezuela: "VE",
  Micronesia: "FM",
  Palestine: "PS",
  Kosovo: "XK",
  Taiwan: "TW",
  Bahamas: "BS",
  Gambia: "GM",
  "Cabo Verde": "CV",
  "Sao Tome and Principe": "ST",
  Eswatini: "SZ",
};

export const GOVERNORATES = [
  "Damascus",
  "Rif Dimashq",
  "Aleppo",
  "Homs",
  "Hama",
  "Latakia",
  "Tartus",
  "Idlib",
  "Deir ez-Zor",
  "Raqqa",
  "Al-Hasakah",
  "Daraa",
  "As-Suwayda",
  "Quneitra",
];

export const RELIGIONS = ["Muslim", "Christian"];

export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

export const GENDERS = ["male", "female"];

export const CITIZENSHIP_TYPES = ["by_birth", "naturalized"];

function resolveCountryCode(countryEnglishName) {
  if (!countryEnglishName) return undefined;
  if (COUNTRY_ALIASES[countryEnglishName]) {
    return COUNTRY_ALIASES[countryEnglishName];
  }
  const code = isoCountries.getAlpha2Code(countryEnglishName, "en");
  return code || undefined;
}

export function getCountryLabel(countryEnglishName, lang = "en") {
  if (!countryEnglishName) return "—";
  const code = resolveCountryCode(countryEnglishName);
  if (!code) return countryEnglishName;
  const translated = isoCountries.getName(code, lang);
  return translated || countryEnglishName;
}

export function getLocationLabel(location, t) {
  if (!location) return "—";
  const key = `citizens.governorates.${location}`;
  const translated = t(key);
  return translated === key ? location : translated;
}

export function getReligionLabel(religion, t) {
  if (religion === "Muslim") return t("citizens.religionMuslim");
  if (religion === "Christian") return t("citizens.religionChristian");
  return "—";
}

export function getGenderLabel(gender, t) {
  if (gender === "male") return t("citizens.genderMale");
  if (gender === "female") return t("citizens.genderFemale");
  return "—";
}

export function getMaritalStatusLabel(status, gender, t) {
  const isFemale = gender === "female";
  switch (status) {
    case "Single":
      return t(
        isFemale
          ? "citizens.maritalSingleFemale"
          : "citizens.maritalSingleMale",
      );
    case "Married":
      return t(
        isFemale
          ? "citizens.maritalMarriedFemale"
          : "citizens.maritalMarriedMale",
      );
    case "Divorced":
      return t(
        isFemale
          ? "citizens.maritalDivorcedFemale"
          : "citizens.maritalDivorcedMale",
      );
    case "Widowed":
      return t(
        isFemale
          ? "citizens.maritalWidowedFemale"
          : "citizens.maritalWidowedMale",
      );
    default:
      return "—";
  }
}

export function getCitizenshipTypeLabel(type, t) {
  if (type === "by_birth") return t("citizens.citizenshipByBirth");
  if (type === "naturalized") return t("citizens.citizenshipNaturalized");
  return "—";
}

export function getNationalityLabel(nationality, gender, t) {
  if (!nationality) return "—";
  if (nationality === "Syria") {
    return gender === "female"
      ? t("citizens.nationalitySyrianFemale")
      : t("citizens.nationalitySyrianMale");
  }
  return nationality;
}
