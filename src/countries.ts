export const pills: { [key: string]: string } = {
  universalHealthcare: 'Universal Healthcare',
  selfID: 'Self ID',
  hrtMtfCovered: 'HRT MTF covered',
  hrtFtmCovered: 'HRT FTM covered',
  endoUpTo6Months: 'Waiting time for endo up to 6 months',
  endoUpTo1_5Year: 'Waiting time for endo up to 1-1,5 year',
  endoOver1_5Year: 'Waiting time for endo over 1,5 year',
  positiveEnvironment: 'Generally positive environment towards LGBTQIA+',
  legalTransitionPossible: 'Legal transition possible',
  legalTransitionUnmarried: 'Legal transition only for unmarried people',
  legalRecognitionNonBinary: 'Legal recognition of non-binary people',
  topSurgeryCoveredFtm: 'Top Surgery Covered FTM',
  topSurgeryCoveredMtf: 'Top Surgery Covered MTF',
  bottomSurgeryCoveredFtm: 'Bottom Surgery Covered FTM',
  bottomSurgeryCoveredMtf: 'Bottom Surgery Covered MTF',
  ffsCovered: 'FFS Covered',
  homosexualActs: 'Homosexual acts illegal',
  transitionIllegal: 'Transition illegal',
  notFriendlyEnvironment: 'Not friendly environment towards LGBTQIA+',
  openlyHostileEnvironment: 'Openly hostile environment towards LGBTQIA+',
};

export type Pill = keyof typeof pills;

export type Country = {
  name: string;
  region: string;
  notes?: string[];
  links?: string[];
  pills: {
    [pill in Pill]?: boolean;
  };
};

export const countries: Country[] = [
  {
    name: 'Germany 🇩🇪',
    region: 'Europe / European Union 🇪🇺 / Western Europe',
    pills: {
      universalHealthcare: true,
      selfID: true,
      hrtMtfCovered: true,
      hrtFtmCovered: true,
      endoUpTo6Months: true,
      legalTransitionPossible: true,
      legalRecognitionNonBinary: true,
      bottomSurgeryCoveredFtm: true,
      bottomSurgeryCoveredMtf: true,
    },
    notes: ['It is not easy to get FFS covered'],
    links: ['https://www.reddit.com/r/germantrans/', 'https://transdb.de/'],
  },
];
