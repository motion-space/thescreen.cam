import type { Locale } from "./i18n";

/** Copy for the store buttons: the Microsoft Store (beta) next to the App Store. */
export type StoreCopy = {
  /** short label, used in the header */
  microsoftStore: string;
  /** full button label, used in the hero and footer */
  microsoftStoreButton: string;
  beta: string;
  /** shown on hover: the Windows version is not released yet */
  betaTooltip: string;
};

const storeCopy: Record<Locale, StoreCopy> = {
  en: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "View on Microsoft Store",
    beta: "Beta",
    betaTooltip: "Not officially released yet. The Windows version is in beta testing.",
  },
  "zh-Hans": {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "在 Microsoft Store 查看",
    beta: "Beta",
    betaTooltip: "尚未正式发布，Windows 版目前处于内测阶段。",
  },
  "zh-Hant": {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "在 Microsoft Store 檢視",
    beta: "Beta",
    betaTooltip: "尚未正式發布，Windows 版目前處於內測階段。",
  },
  de: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Im Microsoft Store ansehen",
    beta: "Beta",
    betaTooltip: "Noch nicht offiziell veröffentlicht. Die Windows-Version befindet sich im Betatest.",
  },
  ja: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Microsoft Store で見る",
    beta: "Beta",
    betaTooltip: "正式リリース前です。Windows 版は現在ベータテスト中です。",
  },
  ko: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Microsoft Store에서 보기",
    beta: "Beta",
    betaTooltip: "아직 정식 출시 전입니다. Windows 버전은 현재 베타 테스트 중입니다.",
  },
  es: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Ver en Microsoft Store",
    beta: "Beta",
    betaTooltip: "Aún no se ha lanzado oficialmente. La versión para Windows está en fase beta.",
  },
  fr: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Voir sur Microsoft Store",
    beta: "Bêta",
    betaTooltip: "Pas encore officiellement disponible. La version Windows est en phase de bêta.",
  },
  "pt-BR": {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Ver na Microsoft Store",
    beta: "Beta",
    betaTooltip: "Ainda não lançado oficialmente. A versão para Windows está em fase beta.",
  },
  it: {
    microsoftStore: "Microsoft Store",
    microsoftStoreButton: "Visualizza su Microsoft Store",
    beta: "Beta",
    betaTooltip: "Non ancora rilasciata ufficialmente. La versione per Windows è in fase beta.",
  },
};

export function getStoreCopy(locale: Locale): StoreCopy {
  return storeCopy[locale] ?? storeCopy.en;
}
