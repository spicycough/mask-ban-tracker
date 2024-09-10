import { stat } from "node:fs";

type Note =
  | string
  | {
      description: string;
      link: string;
    };

type Penality =
  | string
  | {
      link?: string;
      prison?: string;
      fine?: string;
      classification?: string;
    };

type Ban = {
  status: "Active" | "Proposed";
  type?: "General ban in public space" | "General ban with exemptions";
  link: string;
  description: string;
  enactedDate?: string;
  proposedDate?: string;
  effectiveDate?: string;
  penalty?: Penality;
  note?: Note | Note[];
};

type Data = {
  laws: Ban[];
  note?: Note | Note[];
};

type BD = Record<string, Data>;

const banData: BD = {
  "Federal Government": {
    laws: [
      {
        link: "https://www.congress.gov/bill/118th-congress/house-bill/8248?q=%7B%22search%22%3A%228248%22%7D&amp;s=2&amp;r=1",
        proposedDate: "May 2024",
        description:
          "Called 'Unmasking Antifa,' this bill reintroduces a bill that previously died in Congress in 2018. It would make it illegal to wear a 'disguise, including while wearing a mask, to 'injure, oppress, threaten, or intimidate' another person.",
        penalty: {
          prison: "Up to 15 years",
        },
        additionalPenalty: {
          description:
            "The bill also criminalizes destroying buildings or property in disguise.",
          prison: "Up to two years",
        },
      },
    ],
  },
  Alabama: {
    laws: [
      {
        status: "Active",
        type: "General ban in public space",
        enactedDate: "1949",
        description:
          "This is part of a law against loitering; the law makes it illegal for someone to be 'masked, loiter, remain, or congregate in a public place, with exemptions for masquerade parties, public parades, and theater characterizations.",
        link: "https://casetext.com/statute/code-of-alabama/title-13a-criminal-code/chapter-11-offenses-against-public-order-and-safety/article-1-offenses-against-public-order-and-decency/section-13a-11-9-loitering#:~:text=Section%2013A%2D11%2D9%20%2D%20Loitering%20(a)%20A,for%20the%20purpose%20of%20gambling",
        penalty: {
          link: "https://alabamareflector.com/2023/04/20/house-approves-bill-increasing-penalties-for-loitering-begging-on-public-highways/",
          prison: "Up to three months in jail",
          fine: "Up to $500",
        },
      },
      {
        status: "Active",
        link: "https://www.al.com/news/2020/04/alabama-authorities-urge-people-to-ignore-kkk-era-anti-masking-law.html",
        description:
          "Authorities urged to disregard the law by the Attorney General, apply 'common sense.'",
      },
    ],
    note: {
      description: "The law was enforced during demonstrations in 2017-2018.",
      link: "https://www.al.com/news/2020/04/alabama-authorities-urge-people-to-ignore-kkk-era-anti-masking-law.html",
    },
  },
  Alaska: {
    laws: [],
  },
  Arizona: {
    laws: [
      {
        status: "Active",
        link: "https://www.azleg.gov/ars/13/00701.htm",
        enactedDate: "2018",
        description:
          "This law enhances penalties if a 'mask or other disguise' is worn 'during or immediately following the commission' of a felony crime, amending previous guidelines from 2007.",
        note: "These enhanced penalties were passed after state Republicans failed to pass two bills in 2017 to heighten penalties for people wearing masks during an 'unlawful assembly or a riot.'",
      },
    ],
  },
  Arkansas: {
    laws: [],
  },
  California: {
    laws: [
      {
        status: "Active",
        link: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=185.&amp;lawCode=PEN",
        enactedDate: "1873",
        description:
          "This law makes it illegal to wear a 'mask, false whiskers, or any personal disguise (whether complete or partial)' when 'evading or escaping discovery, recognition, or identification in the commission of any public offense' or to conceal when charged, arrested, or convicted of a crime.",
        penalty: {
          link: "https://iecriminaldefense.com/penal-code-185-wearing-a-mask-or-disguise-to-evade-police-laws-in-california/#:~:text=Penalties,days%20in%20a%20County%20Jail.",
          prison: "Up to 180 days in jail",
        },
      },
    ],
  },
  Colorado: {
    laws: [],
  },
  Connecticut: {
    laws: [
      {
        status: "Active",
        link: "https://law.justia.com/codes/connecticut/title-53/chapter-939/section-53-37a/#:~:text=Title%2053%20%2D%20Crimes-,Chapter%20939%20%2D%20Offenses%20Against%20the%20Person,or%20hood%3A%20Class%20D%20felony.",
        enactedDate: "1949",
        description:
          "This law makes it illegal to wear a mask 'with the intent' to deprive another of 'any rights, privileges or immunities' on account of race, sex, gender identity, disability, etc.",
        penalty: {
          link: "https://angottalaw.com/felony-charges-in-connecticut/#:~:text=Class%20D%20Felony,felony%20is%20threatening%201st%20degree.",
          prison: "One to five years",
          fine: "Up to $5,000",
        },
      },
    ],
  },
  Delaware: {
    laws: [
      {
        status: "Active",
        link: "https://delcode.delaware.gov/title11/c005/sc07/index.html",
        enactedDate: "1953",
        description:
          "Part of a disorderly conduct law, this provision makes it illegal to wear masks or face coverings 'while congregating with other persons in a public place' and depriving others of 'any rights, privileges, or immunities.'",
        penalty: {
          link: "https://delcode.delaware.gov/title11/c005/sc07/index.html",
          prison: "Up to 30 days",
          fine: "Up to $575",
        },
      },
      {
        status: "Active",
        link: "https://delcode.delaware.gov/title11/c005/sc06/index.html",
        enactedDate: "1996",
        description:
          "This law makes it illegal to wear a mask 'or other disguise during the commission of any felony.' Guilty even if lesser crime. Can be guilty even if the person is found guilty of a lower charge than the original felony.",
        penalty: {
          link: "https://ootenlawfirm.com/blog/what-is-a-class-e-felony/#:~:text=Class%20E%20felonies%20can%20result,by%20a%20court%20of%20law.",
          prison: "Up to one year",
          fine: "Up to $3,000",
        },
      },
    ],
  },
  "District of Columbia": {
    laws: [
      {
        status: "Active",
        link: "https://code.dccouncil.gov/us/dc/council/acts/25-410",
        enactedDate: "2024",
        description:
          "As part of a sweeping anti-crime law called 'Secure D.C.,' this provision makes it illegal for anyone over 16 years of age to wear a mask or face covering 'to avoid identification' while committing a dangerous or violent crime, theft, or 'threats to do bodily harm.'",
        note: "D.C. had a pre-COVID law, enacted in 1983, which was similar. It was repealed in 2020.",
      },
    ],
  },
  Florida: {
    laws: [
      {
        status: "Active",
        link: "https://www.flsenate.gov/Laws/Statutes/2011/Chapter876",
        enactedDate: "1951",
        description:
          "These laws make it illegal for anyone over 16 years of age to wear a mask or face covering in public outdoors, in public buildings, and on someone else’s private property.",
      },
      {
        status: "Active",
        link: "https://www.flsenate.gov/Laws/Statutes/2011/0876.20",
        description:
          "This law makes it illegal to wear masks while 'placing exhibit to intimidate' — another ban on masking that seems to relate to KKK actions.",
      },
      {
        status: "Active",
        link: "https://www.flsenate.gov/Laws/Statutes/2021/0775.0845",
        description:
          "This law enhances sentencing, classifying a crime one degree higher if wearing a mask or face covering during commission of a crime.",
      },
      {
        status: "Active",
        link: "https://criminaldefenseattorneytampa.com/practice-areas/face-mask/",
        description:
          "Several local Florida ordinances are also shared on this website.",
      },
    ],
  },
  Georgia: {
    laws: [
      {
        status: "Active",
        link: "https://law.justia.com/codes/georgia/2022/title-16/chapter-11/article-2/section-16-11-38/#:~:text=A%20person%20is%20guilty%20of,way%20or%20public%20property%3B%20or",
        enactedDate: "1953",
        description:
          "This law makes it illegal to wear a mask or face covering over 16 years of age in public settings or on the private property of another. With exemptions for holidays, trade, theater, gas masks.",
        penalty: {
          link: "https://law.justia.com/codes/georgia/2022/title-17/chapter-10/article-1/section-17-10-3/#:~:text=Except%20as%20otherwise%20provided%20by%20law%2C%20every,a%20total%20term%20of%2012%20months;%20or.",
          prison: "Up to a year",
          fine: "Up to $1,000",
        },
        note: [
          {
            description:
              "The KKK sued to overturn Georgia’s law in 1989. A lower court ruled in its favor, but the decision was overturned by the state Supreme Court. However, the court’s decision required that police prove an 'intent' to hide one’s identity, which is a precedent that may play out when it comes to COVID-19.",
            link: "https://www.nytimes.com/1990/12/06/us/georgia-supreme-court-reinstates-ban-on-wearing-of-klan-masks.html",
          },
          {
            description:
              "Atlanta City Council failed to pass a ski mask ban in December 2023.",
            link: "https://www.fox5atlanta.com/news/atlantas-proposed-ski-mask-ban-loses-support-opposition",
          },
        ],
      },
    ],
  },
  Hawaii: {
    laws: [],
  },
  Idaho: {
    laws: [],
  },
  Illinois: {
    laws: [],
    note: {
      description:
        "Failed bills in 2017-2018 to ban masks during protests. Failed 2017 bill to criminalize masking in order to conceal identity from police.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Indiana: {
    laws: [],
    note: [
      {
        description:
          "Failed bill in 2019 to increase penalties for commission of a 'public order offense' crime while masking. Failed bill in 2021 to increase penalties for rioting while in a mask.",
        link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
      },
      {
        description:
          "The city of Goshen had a 1998 anti-mask ordinance that was successfully challenged in court by the KKK and overturned.",
        link: "https://www.splcenter.org/fighting-hate/intelligence-report/1999/unmasking-klan",
      },
    ],
  },
  Iowa: {
    laws: [],
  },
  Kansas: {
    laws: [],
    note: "Bill in 2018 died in committee, which would have made it illegal to conceal one’s identity during a public demonstration.",
  },
  Kentucky: {
    laws: [],
    note: {
      description:
        "Failed bill in 2017 to make it a felony to mask at a public protest when committing a crime, even a misdemeanor. Failed bill in 2018 to prohibit face coverings (and weapons, shields, or armor) within 500 feet of a protest (with laws shielding liability for drivers who injure or kill protestors).",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Louisiana: {
    laws: [
      {
        status: "Active",
        link: "https://www.legis.la.gov/legis/law.aspx?d=78402",
        enactedDate: "1924",
        description:
          "This law bans masks, face coverings, or facial disguises in public places, with exceptions for Mardi Gras and similar, Halloween, performances, religious coverings, helmets, and 'medical purposes or reasons.' (Exemptions don’t apply to sex offenders.)",
        penalty: {
          prison: "From six months to three years",
        },
      },
    ],
  },
  Maine: {
    laws: [],
  },
  Maryland: {
    laws: [],
  },
  Massachusetts: {
    laws: [
      {
        status: "Active",
        link: "https://malegislature.gov/Laws/GeneralLaws/PartIV/TitleI/Chapter268/Section34",
        description:
          "This law is often missed on lists of mask bans because it doesn’t mention masks. It does make it illegal to 'disguise' with 'intent to obstruct the due execution of the law, or to intimidate, hinder or interrupt an officer or other person in the lawful performance of his duty, or in the exercise of his rights under the constitution or laws of the commonwealth, whether such intent is effected or not.'",
        penalty: {
          prison: "Up to one year",
          fine: "Up to $500",
        },
        note: {
          description:
            "Failed bill in 2019 to criminalize an assembly of five or more people in masks or disguises, calling it a 'riot or unlawful assembly' if they won’t disperse.",
          link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
        },
      },
    ],
  },
  Michigan: {
    laws: [
      {
        status: "Active",
        link: "https://www.legislature.mi.gov/Laws/MCL?objectName=MCL-750-396",
        enactedDate: "1931",
        description:
          "This law makes it illegal to wear a mask or face covering 'for the purpose of facilitating the commission of a crime.'",
        penalty: {
          fine: "Up to $500",
          prison: "Up to 93 days",
        },
      },
    ],
  },
  Minnesota: {
    laws: [
      {
        status: "Active",
        link: "https://www.revisor.mn.gov/statutes/cite/609.735",
        enactedDate: "1963",
        description:
          "This law makes it illegal to conceal identity with a mask or disguise in a public place, with exemptions for religious beliefs, entertainment, protection from weather, or 'medical treatment.'",
        penalty: {
          link: "https://gallagherdefense.com/crimes/minnesota-offense-level/misdemeanor-mn/#:~:text=A%20Minnesota%20Misdemeanor%20is%20a,3.",
          prison: "Up to 90 days",
          fine: "Up to $1,000",
        },
        note: {
          description:
            "Governor Tim Walz (who is currently running for Vice President) passed an executive order mandating masks as part of a public health emergency. It was challenged in court in part based on the state’s existing mask law. A judge ruled that the law required an intent to disguise, which isn’t why people mask to protect themselves from COVID-19.",
          link: "https://reason.com/volokh/2020/10/03/minnesota-anti-mask-law-doesnt-ban-the-wearing-of-masks-for-public-health-reasons/",
        },
      },
    ],
  },
  Mississippi: {
    laws: [],
  },
  Missouri: {
    laws: [],
    note: {
      description:
        "Failed bill in 2017 to criminalize concealing identity during 'unlawful assembly,' with exemptions for religion, safety, or medical needs.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Montana: {
    laws: [],
    note: {
      description:
        "Failed bill in 2017 to make it a felony to mask while committing an offense against public order (e.g. disorderly conduct, nuisance, etc.).",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Nebraska: {
    laws: [],
  },
  Nevada: {
    laws: [],
  },
  "New Hampshire": {
    laws: [],
  },
  "New Jersey": {
    laws: [],
  },
  "New Mexico": {
    laws: [
      {
        enactedDate: "1953",
        description:
          "Illegal to conceal identity or disguise oneself with intent to obstruct law execution or intimidate/hinder public officers.",
        condition: "While obstructing police",
        penalty: {
          prison: "Up to six months",
          fine: "Up to $500",
        },
      },
    ],
  },
  "New York": {
    laws: [
      {
        region: "Nassau County",
        enactedDate: "August 2024",
        description:
          "Illegal to wear masks or facial coverings with intent to conceal identity, with exemptions for health, safety, religion, and celebrations.",
        condition: "General ban with medical and other exemptions",
        penalty: {
          prison: "Up to one year",
          fine: "Up to $1,000",
        },
      },
      {
        type: "Democratic state-level bill",
        status: "Proposed",
        introduced: "May",
        description:
          "Bans masks if involved in lawful assembly, unlawful assembly, or riot, with exemptions for religious attire and personal protective equipment during declared public health emergencies.",
        condition: "While protesting",
      },
      {
        type: "Republican state-level bill",
        status: "Proposed",
        introducedDate: "May",
        description:
          "Makes it illegal to mask or be disguised while engaging in a protest or public assembly with other masked people, or to knowingly aid such people.",
        condition: "While protesting or helping protesters",
        penalty: {
          prison: "Up to 90 days",
        },
      },
    ],
    pre_covid_law: {
      enacted: 1845,
      repealed: 2020,
      description:
        "Illegal to be masked or disguised in a public place while congregating with others similarly disguised, with exemptions for masquerade parties and government permission.",
    },
  },
  "North Carolina": {
    laws: [
      {
        enactedDate: "June 2024",
        effectiveDate: "October",
        description:
          "Five state laws make it illegal to mask in various public and private settings, with exemptions for holidays, theater, trades, motorcycles, and medical devices for preventing contagious disease spread.",
        condition: "General ban with exemptions",
      },
    ],
  },
  "North Dakota": {
    laws: [
      {
        enactedDate: "2017",
        description:
          "Illegal to mask during a criminal offense with intent to intimidate, threaten, abuse, harass, evade discovery/identification, or conceal after arrest/charge/conviction.",
        condition: "While in commission of a crime",
        penalty: {
          classification: "Class A misdemeanor",
          prison: "Up to one year",
          fine: "Up to $3,000",
        },
      },
    ],
  },
  Ohio: {
    laws: [
      {
        enactedDate: "1953",
        description:
          "Illegal to unite with two or more others to commit a misdemeanor while wearing white caps, masks, or other disguise.",
        condition: "While in commission of a misdemeanor with others so masked",
        penalty: {
          classification: "Fourth degree felony",
          prison: "Six to 18 months",
          fine: "Up to $5,000",
        },
      },
    ],
  },
  Oklahoma: {
    laws: [
      {
        status: "Active",
        enactedDate: "1923",
        description:
          "Illegal to wear a mask or face covering during the commission of a crime or for coercion, intimidation or harassment, with exemptions for childhood pranks, masquerades, theater.",
        link: "https://law.justia.com/codes/oklahoma/title-21/section-21-1301/",
        condition: "While in commission of a crime or to harass",
        penalty: {
          prison: "Up to one year",
          fine: "$50 to $500",
        },
      },
      {
        status: "Active",
        description:
          "Illegal to wear a mask while demanding admission to another's property to harass, injure, etc.",
        link: "https://law.justia.com/codes/oklahoma/title-21/section-21-1302/#:~:text=Any%20person%2C%20masked%20or%20in,for%20admission%20shall%20be%20prima",
        condition:
          "while demanding admission to another’s property to harass, injure, etc.",
        penalty: {
          prison: "Up to one year",
          fine: "$50 to $500",
        },
      },
      {
        status: "Active",
        description:
          "Illegal to wear a mask while committing assault with a dangerous weapon",
        condition: "while committing assault with a dangerous weapon",
        link: "https://law.justia.com/codes/oklahoma/title-21/section-21-1303/",
        penalty: {
          classification: "Felony",
          prison: "5 to 20 years",
          fine: "$100 to $500",
        },
      },
    ],
  },
  Oregon: {
    laws: [],
  },
  Pennsylvania: {
    laws: [],
    note: "Philadelphia passed a ban on ski masks in 2024",
  },
  "Rhode Island": {
    laws: [],
  },
  "South Carolina": {
    laws: [
      {
        enactedDate: "1951",
        description:
          "Illegal for anyone over 16 to wear a mask or face coverings in a public space or while demanding entrance to a private space, with exemptions for holiday, trade, theater, gas mask.",
        condition: "General ban with exemptions",
        penalty: {
          prison: "Up to one year",
          fine: "Up to $500",
        },
      },
    ],
  },
  "South Dakota": {
    laws: [],
  },
  Tennessee: {
    laws: [
      {
        enactedDate: "1868",
        description:
          "Illegal to wear a mask while committing the offense of intimidating others from exercising civil rights.",
        condition: "While intimidating others from exercising rights",
        penalty: {
          classification: "Class A misdemeanor",
          prison: "Up to one year",
          fine: "Up to $2,500",
        },
      },
      {
        region: "Knoxville",
        description:
          "Illegal to wear a mask or disguise in a public place or on someone else's property under certain conditions.",
      },
    ],
  },
  Texas: {
    laws: [],
    note: "Past mask ban from 1925 was repealed in 1974",
  },
  Utah: {
    laws: [],
  },
  Vermont: {
    laws: [],
  },
  Virginia: {
    laws: [
      {
        enactedDate: "1950",
        description:
          "Illegal for anyone over 16 years of age to wear a mask or face covering with exemptions for trades, theater, or bona fide medical reasons with documentation.",
        condition: "General ban with medical exemption requiring documentation",
        penalty: {
          classification: "Class 6 felony",
          prison: "One to five years",
          alternativePenalty: {
            prison: "Up to one year",
            fine: "Up to $2,500",
          },
        },
      },
    ],
  },
  Washington: {
    laws: [],
  },
  "West Virginia": {
    laws: [
      {
        enactedDate: "1988",
        description:
          "Illegal for anyone over 16 years of age to wear masks or face coverings, with exemptions for holiday costumes, trade, theater, masquerades, civil defense drills, or protection from the elements or winter sports.",
        condition: "General ban with exemptions",
        penalty: {
          prison: "Up to one year",
          fine: "Up to $500",
        },
      },
    ],
  },
  Wisconsin: {
    laws: [],
  },
  Wyoming: {
    laws: [],
  },
} as const;

type BanData = typeof banData;

export default banData;
