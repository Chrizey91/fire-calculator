/**
 * i18n.js — Internationalisation strings for the FIRE Calculator UI.
 *
 * Supported locales: en, de, fr, es
 *
 * Each locale object follows the same key schema. Keys are grouped by area:
 *   header        – app-wide chrome
 *   form          – input labels, section titles, placeholders
 *   tooltips      – info-badge hover text for each input and the graph
 *   graph         – chart axis / toggle labels
 *   stats         – summary strip labels and notes
 *   slider        – retirement-age slider UI
 *   advanced      – advanced-settings section
 *   footer        – footer disclaimer
 *   misc          – shared short strings
 */

export const translations = {
  en: {
    header: {
      title: 'FIRE Calculator',
      shareTitle: 'Copy share link',
      toggleTheme: 'Toggle theme',
      switchToDark: 'Switch to Dark Mode',
      switchToLight: 'Switch to Light Mode',
      languageLabel: 'Language',
    },
    form: {
      planSettings: 'Plan Settings',
      personalSettings: 'Personal Settings',
      accumulationPhase: 'Accumulation Phase',
      retirementTarget: 'Retirement Target',
      advancedSettings: 'Advanced Settings',

      currentAge: 'Current Age',
      currentPortfolioValue: 'Current Portfolio Value',
      monthlySavings: 'Monthly Savings',
      savingsGrowthRate: 'Savings Growth Rate (%)',
      roi: 'Annual ROI (%)',
      targetNetMonthlyIncome: 'Target Net Monthly Income (Today\'s Value)',
      deductionRate: 'Deduction Rate (%)',
      inflationRate: 'Expected Inflation Rate (%)',
      additionalRetirementIncome: 'Additional Retirement Income (Net/Month)',
      currency: 'Currency',
    },
    tooltips: {
      currentAge:
        'Your age today in whole years. This is the starting point of the simulation — all projections begin here.',
      currentPortfolioValue:
        'The total current value of your invested assets. This amount begins earning your configured ROI from the very first simulation year.',
      monthlySavings:
        'How much you contribute to your portfolio each month, expressed in today\'s money. It is multiplied by 12 for each annual simulation step.',
      savingsGrowthRate:
        'Annual percentage by which your monthly savings amount increases each year (e.g. due to salary growth). Applied every year during the Accumulation Phase.',
      roi:
        'The annual percentage return on your portfolio. Applied uniformly throughout both the Accumulation Phase and the Drawout Phase.',
      targetNetMonthlyIncome:
        'The amount you want to receive per month in retirement, in today\'s purchasing power and after any deductions. The calculator converts this to the required gross withdrawal internally.',
      deductionRate:
        'The percentage deducted from each gross portfolio withdrawal — for example capital gains tax or wealth tax. Used to calculate how much must be withdrawn to deliver your net target income.',
      inflationRate:
        'The expected annual increase in prices. Used to convert between nominal (future-money) and real (today\'s-money) values throughout the simulation.',
      additionalRetirementIncome:
        'A fixed monthly amount you expect to receive from external sources after retirement (e.g. state pension, part-time work). Enter this as a net (after-tax) figure. Reduces the amount that must be drawn from your portfolio.',
      graph:
        'Shows how your portfolio value evolves over time. The solid blue line is the Accumulation Phase; the dashed green line is the Drawout Phase. The amber dashed line marks your FIRE Number — the portfolio value required to sustain retirement.',
      slider:
        'Drag to change the age at which you plan to retire (the Drawout Date). Everything to the left is the Accumulation Phase; everything to the right is the Drawout Phase.',
    },
    graph: {
      title: 'Simulation Curve',
      inflationAdjusted: 'Inflation Adjusted',
      gross: 'Gross',
      portfolioValue: 'Portfolio Value',
      monthlyWithdrawal: 'Monthly Withdrawal (Secondary Axis)',
      fireTarget: 'FIRE Target',
      showTakeOut: 'Show Withdrawal',
      yAxisPortfolio: (view, currency) => `Portfolio Value (${view}, ${currency})`,
      yAxisWithdrawal: (view, currency) => `Monthly Withdrawal (${view}, ${currency})`,
    },
    stats: {
      fireNumber: 'FIRE Number',
      fireNumberNote: 'Portfolio needed at retirement',
      projectedFireAge: 'Projected FIRE Age',
      projectedFireAgeNote: 'When portfolio crosses FIRE Number',
      portfolioAtRetirement: 'Portfolio at Retirement',
      portfolioAtRetirementNote: 'Actual value at drawout date',
      runway: 'Runway',
      runwayNote: 'Years until portfolio depletes',
      notReached: 'Not reached',
      sustainableTo100: 'Sustainable to 100',
      years: (n) => `${n} yr${n !== 1 ? 's' : ''}`,
    },
    slider: {
      label: 'Retirement Age (Drawout Date)',
      yearsOld: 'years old',
    },
    footer: {
      disclaimer:
        'This calculator is for educational purposes only and does not constitute financial advice.',
    },
    misc: {
      copyShareLink: 'Copy share link',
      copied: 'Copied!',
    },
  },

  de: {
    header: {
      title: 'FIRE-Rechner',
      shareTitle: 'Link kopieren',
      toggleTheme: 'Design wechseln',
      switchToDark: 'Zum Dark Mode wechseln',
      switchToLight: 'Zum Light Mode wechseln',
      languageLabel: 'Sprache',
    },
    form: {
      planSettings: 'Planeinstellungen',
      personalSettings: 'Persönliche Einstellungen',
      accumulationPhase: 'Ansparphase',
      retirementTarget: 'Rentenziel',
      advancedSettings: 'Erweiterte Einstellungen',

      currentAge: 'Aktuelles Alter',
      currentPortfolioValue: 'Aktueller Portfoliowert',
      monthlySavings: 'Monatliche Sparrate',
      savingsGrowthRate: 'Sparratenwachstum (%)',
      roi: 'Jährliche Rendite (%)',
      targetNetMonthlyIncome: 'Ziel-Nettoeinkommen pro Monat (heutiger Wert)',
      deductionRate: 'Abzugsquote (%)',
      inflationRate: 'Erwartete Inflationsrate (%)',
      additionalRetirementIncome: 'Zusätzliches Renteneinkommen (Netto/Monat)',
      currency: 'Währung',
    },
    tooltips: {
      currentAge:
        'Dein heutiges Alter in ganzen Jahren. Dies ist der Ausgangspunkt der Simulation — alle Projektionen beginnen hier.',
      currentPortfolioValue:
        'Der aktuelle Gesamtwert deiner investierten Vermögenswerte. Dieser Betrag erzielt ab dem ersten Simulationsjahr deine konfigurierte Rendite.',
      monthlySavings:
        'Wie viel du monatlich in dein Portfolio einzahlst, in heutigem Geldwert. Wird für jeden jährlichen Simulationsschritt mit 12 multipliziert.',
      savingsGrowthRate:
        'Jährlicher Prozentsatz, um den deine monatliche Sparrate steigt (z. B. durch Gehaltswachstum). Wird jedes Jahr während der Ansparphase angewendet.',
      roi:
        'Die jährliche prozentuale Rendite deines Portfolios. Gilt gleichmäßig sowohl in der Ansparphase als auch in der Entnahmephase.',
      targetNetMonthlyIncome:
        'Der Betrag, den du monatlich im Ruhestand erhalten möchtest — in heutiger Kaufkraft und nach Abzügen. Der Rechner ermittelt intern die erforderliche Bruttoentnahme.',
      deductionRate:
        'Der Prozentsatz, der von jeder Bruttoentnahme abgezogen wird — z. B. Kapitalertragsteuer. Dient zur Berechnung der notwendigen Entnahme, um dein Nettoziel zu erreichen.',
      inflationRate:
        'Der erwartete jährliche Preisanstieg. Wird verwendet, um in der Simulation zwischen nominalen (zukünftigen) und realen (heutigen) Werten umzurechnen.',
      additionalRetirementIncome:
        'Ein fester monatlicher Betrag aus externen Quellen nach dem Renteneintritt (z. B. gesetzliche Rente, Nebeneinkommen). Als Nettobetrag eingeben. Reduziert den erforderlichen Portfolioentnahmebedarf.',
      graph:
        'Zeigt, wie sich dein Portfoliowert im Laufe der Zeit entwickelt. Die durchgezogene blaue Linie ist die Ansparphase; die gestrichelte grüne Linie ist die Entnahmephase. Die gelbe gestrichelte Linie markiert deine FIRE-Zahl — den Portfoliowert, der für den Ruhestand benötigt wird.',
      slider:
        'Ziehe, um das Rentenalter (Entnahmedatum) zu ändern. Alles links davon ist die Ansparphase; alles rechts ist die Entnahmephase.',
    },
    graph: {
      title: 'Simulationskurve',
      inflationAdjusted: 'Inflationsbereinigt',
      gross: 'Brutto',
      portfolioValue: 'Portfoliowert',
      monthlyWithdrawal: 'Monatliche Entnahme (Sekundärachse)',
      fireTarget: 'FIRE-Ziel',
      showTakeOut: 'Entnahme zeigen',
      yAxisPortfolio: (view, currency) => `Portfoliowert (${view}, ${currency})`,
      yAxisWithdrawal: (view, currency) => `Monatliche Entnahme (${view}, ${currency})`,
    },
    stats: {
      fireNumber: 'FIRE-Zahl',
      fireNumberNote: 'Benötigtes Portfolio bei Rentenbeginn',
      projectedFireAge: 'Voraussichtliches FIRE-Alter',
      projectedFireAgeNote: 'Wenn Portfolio die FIRE-Zahl erreicht',
      portfolioAtRetirement: 'Portfolio bei Rentenbeginn',
      portfolioAtRetirementNote: 'Tatsächlicher Wert zum Entnahmedatum',
      runway: 'Laufzeit',
      runwayNote: 'Jahre bis zum Aufbrauchen des Portfolios',
      notReached: 'Nicht erreicht',
      sustainableTo100: 'Bis 100 nachhaltig',
      years: (n) => `${n} J.`,
    },
    slider: {
      label: 'Rentenalter (Entnahmedatum)',
      yearsOld: 'Jahre alt',
    },
    footer: {
      disclaimer:
        'Dieser Rechner dient nur zu Bildungszwecken und stellt keine Finanzberatung dar.',
    },
    misc: {
      copyShareLink: 'Link kopieren',
      copied: 'Kopiert!',
    },
  },

  fr: {
    header: {
      title: 'Calculateur FIRE',
      shareTitle: 'Copier le lien',
      toggleTheme: 'Changer de thème',
      switchToDark: 'Passer en mode sombre',
      switchToLight: 'Passer en mode clair',
      languageLabel: 'Langue',
    },
    form: {
      planSettings: 'Paramètres du plan',
      personalSettings: 'Paramètres personnels',
      accumulationPhase: 'Phase d\'accumulation',
      retirementTarget: 'Objectif de retraite',
      advancedSettings: 'Paramètres avancés',

      currentAge: 'Âge actuel',
      currentPortfolioValue: 'Valeur actuelle du portefeuille',
      monthlySavings: 'Épargne mensuelle',
      savingsGrowthRate: 'Croissance de l\'épargne (%)',
      roi: 'ROI annuel (%)',
      targetNetMonthlyIncome: 'Revenu mensuel net cible (valeur actuelle)',
      deductionRate: 'Taux de déduction (%)',
      inflationRate: 'Taux d\'inflation prévu (%)',
      additionalRetirementIncome: 'Revenu de retraite supplémentaire (net/mois)',
      currency: 'Devise',
    },
    tooltips: {
      currentAge:
        'Votre âge aujourd\'hui en années entières. C\'est le point de départ de la simulation — toutes les projections commencent ici.',
      currentPortfolioValue:
        'La valeur totale actuelle de vos actifs investis. Ce montant génère votre ROI configuré dès la première année de simulation.',
      monthlySavings:
        'Le montant que vous épargnez chaque mois, exprimé en valeur d\'aujourd\'hui. Il est multiplié par 12 pour chaque étape annuelle de simulation.',
      savingsGrowthRate:
        'Pourcentage annuel d\'augmentation de votre épargne mensuelle (ex. : croissance salariale). Appliqué chaque année pendant la Phase d\'accumulation.',
      roi:
        'Le rendement annuel en pourcentage de votre portefeuille. Appliqué uniformément pendant la Phase d\'accumulation et la Phase de retrait.',
      targetNetMonthlyIncome:
        'Le montant que vous souhaitez recevoir par mois à la retraite, en pouvoir d\'achat actuel et après déductions. Le calculateur détermine en interne le retrait brut nécessaire.',
      deductionRate:
        'Le pourcentage déduit de chaque retrait brut — par exemple l\'impôt sur les plus-values. Utilisé pour calculer le montant à retirer afin d\'atteindre votre revenu net cible.',
      inflationRate:
        'L\'augmentation annuelle attendue des prix. Utilisée pour convertir entre les valeurs nominales (monnaie future) et réelles (monnaie actuelle) tout au long de la simulation.',
      additionalRetirementIncome:
        'Un montant mensuel fixe provenant de sources externes après la retraite (ex. : pension d\'État, travail à temps partiel). À saisir en net (après impôts). Réduit le montant à prélever sur votre portefeuille.',
      graph:
        'Montre l\'évolution de la valeur de votre portefeuille dans le temps. La ligne bleue continue est la Phase d\'accumulation ; la ligne verte en pointillés est la Phase de retrait. La ligne ambre en pointillés indique votre Nombre FIRE — la valeur de portefeuille nécessaire pour soutenir la retraite.',
      slider:
        'Faites glisser pour modifier l\'âge auquel vous prévoyez de prendre votre retraite (Date de retrait). Tout à gauche est la Phase d\'accumulation ; tout à droite est la Phase de retrait.',
    },
    graph: {
      title: 'Courbe de simulation',
      inflationAdjusted: 'Ajusté à l\'inflation',
      gross: 'Brut',
      portfolioValue: 'Valeur du portefeuille',
      monthlyWithdrawal: 'Retrait mensuel (axe secondaire)',
      fireTarget: 'Objectif FIRE',
      showTakeOut: 'Afficher les retraits',
      yAxisPortfolio: (view, currency) => `Valeur du portefeuille (${view}, ${currency})`,
      yAxisWithdrawal: (view, currency) => `Retrait mensuel (${view}, ${currency})`,
    },
    stats: {
      fireNumber: 'Nombre FIRE',
      fireNumberNote: 'Portefeuille nécessaire à la retraite',
      projectedFireAge: 'Âge FIRE prévu',
      projectedFireAgeNote: 'Quand le portefeuille atteint le Nombre FIRE',
      portfolioAtRetirement: 'Portefeuille à la retraite',
      portfolioAtRetirementNote: 'Valeur réelle à la date de retrait',
      runway: 'Durée de vie',
      runwayNote: 'Années avant épuisement du portefeuille',
      notReached: 'Non atteint',
      sustainableTo100: 'Viable jusqu\'à 100 ans',
      years: (n) => `${n} an${n !== 1 ? 's' : ''}`,
    },
    slider: {
      label: 'Âge de retraite (date de retrait)',
      yearsOld: 'ans',
    },
    footer: {
      disclaimer:
        'Ce calculateur est fourni à titre éducatif uniquement et ne constitue pas un conseil financier.',
    },
    misc: {
      copyShareLink: 'Copier le lien',
      copied: 'Copié !',
    },
  },

  es: {
    header: {
      title: 'Calculadora FIRE',
      shareTitle: 'Copiar enlace',
      toggleTheme: 'Cambiar tema',
      switchToDark: 'Cambiar a modo oscuro',
      switchToLight: 'Cambiar a modo claro',
      languageLabel: 'Idioma',
    },
    form: {
      planSettings: 'Configuración del plan',
      personalSettings: 'Configuración personal',
      accumulationPhase: 'Fase de acumulación',
      retirementTarget: 'Objetivo de jubilación',
      advancedSettings: 'Configuración avanzada',

      currentAge: 'Edad actual',
      currentPortfolioValue: 'Valor actual del portafolio',
      monthlySavings: 'Ahorro mensual',
      savingsGrowthRate: 'Crecimiento del ahorro (%)',
      roi: 'ROI anual (%)',
      targetNetMonthlyIncome: 'Ingreso neto mensual objetivo (valor actual)',
      deductionRate: 'Tasa de deducción (%)',
      inflationRate: 'Tasa de inflación esperada (%)',
      additionalRetirementIncome: 'Ingreso adicional de jubilación (neto/mes)',
      currency: 'Moneda',
    },
    tooltips: {
      currentAge:
        'Tu edad actual en años completos. Este es el punto de partida de la simulación — todas las proyecciones comienzan aquí.',
      currentPortfolioValue:
        'El valor total actual de tus activos invertidos. Este monto genera el ROI configurado desde el primer año de simulación.',
      monthlySavings:
        'Cuánto aportas a tu portafolio cada mes, expresado en valor de hoy. Se multiplica por 12 en cada paso anual de la simulación.',
      savingsGrowthRate:
        'Porcentaje anual en que aumenta tu ahorro mensual (p. ej., por crecimiento salarial). Se aplica cada año durante la Fase de acumulación.',
      roi:
        'El rendimiento anual porcentual de tu portafolio. Se aplica uniformemente tanto en la Fase de acumulación como en la Fase de retiro.',
      targetNetMonthlyIncome:
        'El monto que deseas recibir por mes en la jubilación, en poder adquisitivo actual y después de deducciones. El calculador determina internamente el retiro bruto necesario.',
      deductionRate:
        'El porcentaje deducido de cada retiro bruto — por ejemplo, impuesto sobre ganancias de capital. Se usa para calcular cuánto retirar para alcanzar tu ingreso neto objetivo.',
      inflationRate:
        'El aumento anual esperado en los precios. Se usa para convertir entre valores nominales (dinero futuro) y reales (dinero de hoy) a lo largo de la simulación.',
      additionalRetirementIncome:
        'Un monto mensual fijo que recibirás de fuentes externas tras la jubilación (p. ej., pensión estatal, trabajo a tiempo parcial). Ingrésalo como cifra neta (después de impuestos). Reduce el monto que debe retirarse del portafolio.',
      graph:
        'Muestra cómo evoluciona el valor de tu portafolio con el tiempo. La línea azul sólida es la Fase de acumulación; la línea verde discontinua es la Fase de retiro. La línea ámbar discontinua marca tu Número FIRE — el valor del portafolio necesario para sostener la jubilación.',
      slider:
        'Arrastra para cambiar la edad a la que planeas jubilarte (Fecha de retiro). Todo a la izquierda es la Fase de acumulación; todo a la derecha es la Fase de retiro.',
    },
    graph: {
      title: 'Curva de simulación',
      inflationAdjusted: 'Ajustado por inflación',
      gross: 'Bruto',
      portfolioValue: 'Valor del portafolio',
      monthlyWithdrawal: 'Retiro mensual (eje secundario)',
      fireTarget: 'Objetivo FIRE',
      showTakeOut: 'Mostrar retiradas',
      yAxisPortfolio: (view, currency) => `Valor del portafolio (${view}, ${currency})`,
      yAxisWithdrawal: (view, currency) => `Retiro mensual (${view}, ${currency})`,
    },
    stats: {
      fireNumber: 'Número FIRE',
      fireNumberNote: 'Portafolio necesario al jubilarse',
      projectedFireAge: 'Edad FIRE proyectada',
      projectedFireAgeNote: 'Cuando el portafolio supera el Número FIRE',
      portfolioAtRetirement: 'Portafolio al jubilarse',
      portfolioAtRetirementNote: 'Valor real en la fecha de retiro',
      runway: 'Duración',
      runwayNote: 'Años hasta agotar el portafolio',
      notReached: 'No alcanzado',
      sustainableTo100: 'Sostenible hasta los 100',
      years: (n) => `${n} año${n !== 1 ? 's' : ''}`,
    },
    slider: {
      label: 'Edad de jubilación (fecha de retiro)',
      yearsOld: 'años',
    },
    footer: {
      disclaimer:
        'Esta calculadora es solo para fines educativos y no constituye asesoramiento financiero.',
    },
    misc: {
      copyShareLink: 'Copiar enlace',
      copied: '¡Copiado!',
    },
  },
};

/** Currently active locale key */
let currentLocale = 'en';

/** Return the translation object for the active locale. */
export function t() {
  return translations[currentLocale] ?? translations.en;
}

/** Change the active locale and persist it. */
export function setLocale(locale) {
  if (!translations[locale]) return;
  currentLocale = locale;
  try {
    localStorage.setItem('fire-calculator-locale', locale);
  } catch (_) {}
}

/** Load locale from localStorage (falls back to 'en'). */
export function loadLocale() {
  try {
    const saved = localStorage.getItem('fire-calculator-locale');
    if (saved && translations[saved]) {
      currentLocale = saved;
    }
  } catch (_) {}
  return currentLocale;
}

/** Return the current locale key. */
export function getLocale() {
  return currentLocale;
}
