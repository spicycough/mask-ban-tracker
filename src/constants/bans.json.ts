import type { NewBan } from "@/db/schema";

type Description = string | { text: string; link: string };
type Note = string | { text: string; link: string };

type NotableDate = number | { month: number; year: number };

type Penalty =
  | string
  | {
      link?: string;
      prison?: number | { min: number; max: number };
      fine?: number | { min: number; max: number };
      classification?: string;
    };

type BanCommon = Description & {
  condition: string;
  penalty?: Penalty | Penalty[];
  note?: Note | Note[];
  region?: { name: string; type: "city" | "county" };
};

type BanActive = BanCommon & {
  status: "Active";
  statusDate?: NotableDate;
  effectiveDate?: NotableDate;
};

type BanProposed = BanCommon & {
  status: "Proposed";
  proposedDate?: NotableDate;
  who: string;
};

type BanRepealed = BanCommon & {
  status: "Repealed";
  statusDate?: NotableDate;
  repealedDate?: NotableDate;
  repealedDescription?: Description;
};

// type Ban = BanActive | BanProposed | BanRepealed;

type Data = {
  laws: Omit<NewBan, "locationId">[];
  note?: Note | Note[];
};

const banData: Record<string, Data> = {
  "Federal Government": {
    laws: [
      {
        status: "Proposed",
        who: "all",
        link: "https://www.congress.gov/bill/118th-congress/house-bill/8248?q=%7B%22search%22%3A%228248%22%7D&amp;s=2&amp;r=1",
        proposedDate: {
          month: 5, // May
          year: 2024,
        },
        condition: "to injure or intimidate",
        description:
          "Called 'Unmasking Antifa,' this bill reintroduces a bill that previously died in Congress in 2018. It would make it illegal to wear a 'disguise, including while wearing a mask, to 'injure, oppress, threaten, or intimidate' another person.",
        penalty: {
          prison: 180, // 15 years
        },
      },
      {
        status: "Proposed",
        who: "all",
        link: "https://www.congress.gov/bill/118th-congress/house-bill/8248?q=%7B%22search%22%3A%228248%22%7D&amp;s=2&amp;r=1",
        proposedDate: {
          month: 5, // May
          year: 2024,
        },
        condition: "to injure or intimidate",
        description:
          "The bill also criminalizes destroying buildings or property in disguise.",
        penalty: {
          prison: 24, // "Up to two years",
        },
      },
    ],
  },
  Alabama: {
    laws: [
      {
        status: "Active",
        condition: "general ban in public space",
        statusDate: 1949,
        description:
          "This is part of a law against loitering; the law makes it illegal for someone to be 'masked, loiter, remain, or congregate in a public place, with exemptions for masquerade parties, public parades, and theater characterizations.",
        link: "https://casetext.com/statute/code-of-alabama/title-13a-criminal-code/chapter-11-offenses-against-public-order-and-safety/article-1-offenses-against-public-order-and-decency/section-13a-11-9-loitering#:~:text=Section%2013A%2D11%2D9%20%2D%20Loitering%20(a)%20A,for%20the%20purpose%20of%20gambling",
        penalty: {
          link: "https://alabamareflector.com/2023/04/20/house-approves-bill-increasing-penalties-for-loitering-begging-on-public-highways/",
          prison: 3,
          fine: 500,
        },
        note: [
          {
            text: "Authorities urged to disregard the law by the Attorney General, apply 'common sense.'",
            link: "https://www.al.com/news/2020/04/alabama-authorities-urge-people-to-ignore-kkk-era-anti-masking-law.html",
          },
          {
            text: "The law was enforced during demonstrations in 2017-2018.",
            link: "https://www.al.com/news/2020/04/alabama-authorities-urge-people-to-ignore-kkk-era-anti-masking-law.html",
          },
        ],
      },
    ],
  },
  Alaska: {
    laws: [],
  },
  Arizona: {
    laws: [
      {
        status: "Active",
        link: "https://www.azleg.gov/ars/13/00701.htm",
        statusDate: 2018,
        condition: "in commission of a crime",
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
        statusDate: 1873,
        condition: "in commission of a crime",
        description:
          "This law makes it illegal to wear a 'mask, false whiskers, or any personal disguise (whether complete or partial)' when 'evading or escaping discovery, recognition, or identification in the commission of any public offense' or to conceal when charged, arrested, or convicted of a crime.",
        penalty: {
          classification: "misdemeanor",
          prison: 3, // 180 days
          link: "https://iecriminaldefense.com/penal-code-185-wearing-a-mask-or-disguise-to-evade-police-laws-in-california/#:~:text=Penalties,days%20in%20a%20County%20Jail.",
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
        statusDate: 1949,
        description:
          "This law makes it illegal to wear a mask 'with the intent' to deprive another of 'any rights, privileges or immunities' on account of race, sex, gender identity, disability, etc.",
        condition: "while depriving another of their rights",
        penalty: {
          link: "https://angottalaw.com/felony-charges-in-connecticut/#:~:text=Class%20D%20Felony,felony%20is%20threatening%201st%20degree.",
          classification: "class D felony",
          prison: {
            min: 12, // 1 year
            max: 60, // 5 years
          },
          fine: 5_000,
        },
      },
    ],
  },
  Delaware: {
    laws: [
      {
        status: "Active",
        link: "https://delcode.delaware.gov/title11/c005/sc07/index.html",
        statusDate: 1953,
        condition:
          "while congregating in public and depriving another of rights",
        description:
          "Part of a disorderly conduct law, this provision makes it illegal to wear masks or face coverings 'while congregating with other persons in a public place' and depriving others of 'any rights, privileges, or immunities.'",
        penalty: {
          classification: "misdemeanor",
          prison: 1, // 30 days
          fine: 575, // up to $575
          link: "https://delcode.delaware.gov/title11/c005/sc07/index.html",
        },
      },
      {
        status: "Active",
        link: "https://delcode.delaware.gov/title11/c005/sc06/index.html",
        statusDate: 1996,
        condition: "while in commission of a felony",
        description:
          "This law makes it illegal to wear a mask 'or other disguise during the commission of any felony.' Guilty even if lesser crime. Can be guilty even if the person is found guilty of a lower charge than the original felony.",
        penalty: {
          link: "https://ootenlawfirm.com/blog/what-is-a-class-e-felony/#:~:text=Class%20E%20felonies%20can%20result,by%20a%20court%20of%20law.",
          classification: "class E felony",
          prison: 12, // Up to one year
          fine: 3_000, // "Up to $3,000",
        },
      },
    ],
  },
  "District of Columbia": {
    laws: [
      {
        status: "Active",
        link: "https://code.dccouncil.gov/us/dc/council/acts/25-410",
        condition: "while in commission of a crime",
        statusDate: 2024,
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
        condition: "general mask bans",
        statusDate: 1951,
        description:
          "These laws make it illegal for anyone over 16 years of age to wear a mask or face covering in public outdoors, in public buildings, and on someone else’s private property.",
      },
      {
        status: "Active",
        link: "https://www.flsenate.gov/Laws/Statutes/2011/0876.20",
        condition: "while intimidating others",
        description:
          "This law makes it illegal to wear masks while 'placing exhibit to intimidate' — another ban on masking that seems to relate to KKK actions.",
      },
      {
        status: "Active",
        link: "https://www.flsenate.gov/Laws/Statutes/2021/0775.0845",
        condition: "while in commission of a crime",
        description:
          "This law enhances sentencing, classifying a crime one degree higher if wearing a mask or face covering during commission of a crime.",
      },
    ],
    note: {
      link: "https://criminaldefenseattorneytampa.com/practice-areas/face-mask/",
      text: "Several local Florida ordinances are also shared on this website.",
    },
  },
  Georgia: {
    laws: [
      {
        status: "Active",
        link: "https://law.justia.com/codes/georgia/2022/title-16/chapter-11/article-2/section-16-11-38/#:~:text=A%20person%20is%20guilty%20of,way%20or%20public%20property%3B%20or",
        statusDate: 1953,
        condition: "general mask ban",
        description:
          "This law makes it illegal to wear a mask or face covering over 16 years of age in public settings or on the private property of another. With exemptions for holidays, trade, theater, gas masks.",
        penalty: {
          link: "https://law.justia.com/codes/georgia/2022/title-17/chapter-10/article-1/section-17-10-3/#:~:text=Except%20as%20otherwise%20provided%20by%20law%2C%20every,a%20total%20term%20of%2012%20months;%20or.",
          prison: 12, // "Up to a year",
          fine: 1_000, // "Up to $1,000",
        },
        note: [
          {
            text: "The KKK sued to overturn Georgia’s law in 1989. A lower court ruled in its favor, but the decision was overturned by the state Supreme Court. However, the court’s decision required that police prove an 'intent' to hide one’s identity, which is a precedent that may play out when it comes to COVID-19.",
            link: "https://www.nytimes.com/1990/12/06/us/georgia-supreme-court-reinstates-ban-on-wearing-of-klan-masks.html",
          },
          {
            text: "Atlanta City Council failed to pass a ski mask ban in December 2023.",
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
      text: "Failed bills in 2017-2018 to ban masks during protests. Failed 2017 bill to criminalize masking in order to conceal identity from police.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Indiana: {
    laws: [],
    note: [
      {
        text: "Failed bill in 2019 to increase penalties for commission of a 'public order offense' crime while masking. Failed bill in 2021 to increase penalties for rioting while in a mask.",
        link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
      },
      {
        text: "The city of Goshen had a 1998 anti-mask ordinance that was successfully challenged in court by the KKK and overturned.",
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
      text: "Failed bill in 2017 to make it a felony to mask at a public protest when committing a crime, even a misdemeanor. Failed bill in 2018 to prohibit face coverings (and weapons, shields, or armor) within 500 feet of a protest (with laws shielding liability for drivers who injure or kill protestors).",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Louisiana: {
    laws: [
      {
        status: "Active",
        link: "https://www.legis.la.gov/legis/law.aspx?d=78402",
        condition: "general ban with medical and other exemptions",
        statusDate: 1924,
        description:
          "This law bans masks, face coverings, or facial disguises in public places, with exceptions for Mardi Gras and similar, Halloween, performances, religious coverings, helmets, and 'medical purposes or reasons.' (Exemptions don’t apply to sex offenders.)",
        penalty: {
          prison: {
            min: 6, // 6 months
            max: 18, // 3 years
          },
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
        condition: "while obstructing police",
        description:
          "This law makes it illegal to 'disguise' with 'intent to obstruct the due execution of the law, or to intimidate, hinder or interrupt an officer or other person in the lawful performance of his duty, or in the exercise of his rights under the constitution or laws of the commonwealth, whether such intent is effected or not.'",
        penalty: {
          prison: 12, // "Up to one year",
          fine: 500, // "Up to $500",
        },
        note: "often missed on lists of mask bans because it doesn't mention masks, it mentions disguises.",
      },
    ],
    note: {
      text: "Failed bill in 2019 to criminalize an assembly of five or more people in masks or disguises, calling it a 'riot or unlawful assembly' if they won’t disperse.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Michigan: {
    laws: [
      {
        status: "Active",
        link: "https://www.legislature.mi.gov/Laws/MCL?objectName=MCL-750-396",
        statusDate: 1931,
        condition: "in commission of a crime",
        description:
          "This law makes it illegal to wear a mask or face covering 'for the purpose of facilitating the commission of a crime.'",
        penalty: {
          prison: 3.1, // "Up to 93 days",
          fine: 500, // "Up to $500",
        },
      },
    ],
  },
  Minnesota: {
    laws: [
      {
        status: "Active",
        link: "https://www.revisor.mn.gov/statutes/cite/609.735",
        condition: "general ban with medical and other exemptions",
        statusDate: 1963,
        description:
          "This law makes it illegal to conceal identity with a mask or disguise in a public place, with exemptions for religious beliefs, entertainment, protection from weather, or 'medical treatment.'",
        penalty: {
          link: "https://gallagherdefense.com/crimes/minnesota-offense-level/misdemeanor-mn/#:~:text=A%20Minnesota%20Misdemeanor%20is%20a,3.",
          prison: 3, // "Up to 90 days",
          fine: 1_000, // "Up to $1,000",
        },
      },
    ],
    note: {
      text: "Governor Tim Walz (who is currently running for Vice President) passed an executive order mandating masks as part of a public health emergency. It was challenged in court in part based on the state’s existing mask law. A judge ruled that the law required an intent to disguise, which isn’t why people mask to protect themselves from COVID-19.",
      link: "https://reason.com/volokh/2020/10/03/minnesota-anti-mask-law-doesnt-ban-the-wearing-of-masks-for-public-health-reasons/",
    },
  },
  Mississippi: {
    laws: [],
  },
  Missouri: {
    laws: [],
    note: {
      text: "Failed bill in 2017 to criminalize concealing identity during 'unlawful assembly,' with exemptions for religion, safety, or medical needs.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&amp;status=&amp;issue=5&amp;date=&amp;type=",
    },
  },
  Montana: {
    laws: [],
    note: {
      text: "Failed bill in 2017 to make it a felony to mask while committing an offense against public order (e.g. disorderly conduct, nuisance, etc.).",
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
        status: "Active",
        statusDate: 1953,
        link: "https://law.justia.com/codes/new-mexico/2011/chapter30/article22/section30-22-3/",
        description:
          "Illegal to conceal identity or disguise oneself with intent to obstruct law execution or intimidate/hinder public officers.",
        condition: "while obstructing police",
        penalty: {
          classification: "petty misdemeanor",
          prison: 6, // "Up to six months",
          fine: 500, // "Up to $500",
          link: "https://law.justia.com/codes/new-mexico/2011/chapter30/article22/section30-22-3/",
        },
      },
    ],
  },
  "New York": {
    laws: [
      {
        region: {
          name: "Nassau",
          type: "county",
        },
        status: "Active",
        link: "https://x.com/luckytran/status/1820609352648065312",
        statusDate: { month: 8, year: 2024 }, // August 2024
        description:
          "Illegal to wear masks or facial coverings with intent to conceal identity, with exemptions for health, safety, religion, and celebrations.",
        condition: "General ban with medical and other exemptions",
        penalty: {
          prison: 12, // "Up to one year",
          fine: 1_000, // "Up to $1,000",
        },
      },
      {
        status: "Proposed",
        statusDate: { month: 5, year: 2024 }, // May 2024
        who: "Democratic",
        condition: "while protesting",
        description:
          "Bans masks if involved in lawful assembly, unlawful assembly, or riot, with exemptions for religious attire and personal protective equipment during declared public health emergencies.",
        link: "https://assembly.state.ny.us/leg/?default_fld=&leg_video=&bn=A10057&term=&Summary=Y&Actions=Y&Text=Y",
      },
      {
        status: "Proposed",
        statusDate: { month: 5, year: 2024 }, // May 2024
        who: "Republican",
        link: "https://www.nysenate.gov/legislation/bills/2023/S9194",
        description:
          "Makes it illegal to mask or be disguised while engaging in a protest or public assembly with other masked people, or to knowingly aid such people.",
        condition: "While protesting or helping protesters",
        penalty: {
          prison: 3, // "Up to 90 days",
        },
        note: "The bill includes an additional crime of “aggravated deceptive wearing of a mask,” if property damage or injuries occur while in a public assembly, with exemptions for religious purposes and permitted celebrations.",
      },
      {
        status: "Repealed",
        condition: "while congregating in public",
        statusDate: 2020,
        description:
          "Illegal to be masked or disguised in a public place while congregating with others similarly disguised, with exemptions for masquerade parties and government permission. The 1845 law was repealed by the state legislature in 2020. The pre-COVID law was used against Occupy Wall Street protestors in 2011 and even trans people who were considered to be “masquerading” in disguise.",
        link: "https://www.nysenate.gov/legislation/laws/PEN/240.35",
      },
    ],
    note: {
      text: "Note: Governor Kathy Hochul and New York City Mayor Eric Adams have both made statements indicating their interest in banning masks — for Hochul, on subways (and not protests) and for Adams, in general.",
      link: "https://www.cityandstateny.com/politics/2024/06/democratic-lawmakers-and-civil-rights-groups-push-mask-ban/397727/#:~:text=Hochul%20has%20previously%20said%20that,unrelated%20press%20conference%20last%20week",
    },
  },
  "North Carolina": {
    laws: [
      {
        status: "Active",
        statusDate: 2024, // Enacted June 2024, Effective October 2024
        condition: "General ban with exemptions",
        link: "https://www.ncleg.gov/Sessions/2023/Bills/House/PDF/H237v6.pdf",
        description:
          "Five state laws make it illegal to mask in various public and private settings, with the current law offering exemptions for holidays, theater, trades, motorcycles, and “any person wearing a medical or surgical device for the purpose of preventing the spread of contagious disease.” The law requires removal of a mask if ordered by law enforcement under any circumstances and by “owner or occupant” of a “public or private property.”",
        note: "The pre-COVID law had a stronger medical exemption: “for the purpose of ensuring the physical health or safety of the wearer or others.” And it only permitted police to request mask removal at a traffic stop or when they believed a crime was taking place.",
      },
    ],
  },
  "North Dakota": {
    laws: [
      {
        status: "Active",
        statusDate: 2017,
        description:
          "Illegal to mask during a criminal offense with intent to intimidate, threaten, abuse, harass, evade discovery/identification, or conceal after arrest/charge/conviction.",
        condition: "While in commission of a crime",
        link: "https://ndlegis.gov/cencode/t12-1c31.pdf",
        penalty: {
          link: "https://www.bolinskelawfirm.com/criminal-defense/misdemeanors/#:~:text=North%20Dakota%20Misdemeanors&text=Class%20A%20misdemeanors%20are%20more,a%20fine%20up%20to%20%243%2C000.",
          classification: "class a misdemeanor",
          prison: 12, // "Up to one year",
          fine: 3_000, // "Up to $3,000",
        },
      },
    ],
  },
  Ohio: {
    laws: [
      {
        status: "Active",
        statusDate: 1953,
        description:
          "Illegal to unite with two or more others to commit a misdemeanor while wearing white caps, masks, or other disguise.",
        condition: "While in commission of a misdemeanor with others so masked",
        link: "https://codes.ohio.gov/ohio-revised-code/section-3761.12",
        penalty: {
          classification: "Fourth degree felony",
          prison: {
            min: 6, // 6 months
            max: 18, // 3 years
          }, // "Six to 18 months",
          fine: 5_000, // "Up to $5,000",
        },
        note: {
          description:
            "The Ohio Attorney General threatened to use the law in 2024 against college protestors. There was also a failed bill in 2019 to criminalize masking during protests.",
          link: "https://www.latimes.com/world-nation/story/2024-05-08/masked-student-protesters-could-face-felony-charges-under-anti-kkk-law-ohio-attorney-general-warns",
        },
      },
    ],
  },
  Oklahoma: {
    laws: [
      {
        status: "Active",
        statusDate: 1923,
        description:
          "Illegal to wear a mask or face covering during the commission of a crime or for coercion, intimidation or harassment, with exemptions for childhood pranks, masquerades, theater.",
        link: "https://law.justia.com/codes/oklahoma/title-21/section-21-1301/",
        condition: "while in commission of a crime or to harass",
        penalty: {
          prison: 12, // "Up to one year",
          fine: {
            min: 50,
            max: 500,
          }, // "$50 to $500",
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
          prison: 12, // "Up to one year",
          fine: {
            min: 50,
            max: 500,
          }, // "$50 to $500",
        },
      },
      {
        status: "Active",
        description:
          "Illegal to wear a mask while committing assault with a dangerous weapon",
        condition: "while committing assault with a dangerous weapon",
        link: "https://law.justia.com/codes/oklahoma/title-21/section-21-1303/",
        penalty: {
          classification: "felony",
          prison: {
            min: 60, // 5 years
            max: 240, // 20 years
          },
          fine: {
            min: 100,
            max: 500,
          }, // $100 to $500
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
        status: "Active",
        statusDate: 1951,
        link: "https://www.scstatehouse.gov/code/t16c007.php#:~:text=No%20person%20over%20sixteen%20years,device%20which%20conceals%20his%20identity.",
        description:
          "Illegal for anyone over 16 to wear a mask or face coverings in a public space or while demanding entrance to a private space, with exemptions for holiday, trade, theater, gas mask.",
        condition: "general ban with exemptions",
        penalty: {
          prison: 12, // "Up to one year",
          fine: 500, //  "Up to $500",
        },
      },
    ],
    note: {
      text: "Failed attempts to amend the state law in 2022-2023 allowing for a health exemption but only during a “lawfully declared” public emergency.",
      link: "https://www.scstatehouse.gov/sess125_2023-2024/bills/292.htm",
    },
  },
  "South Dakota": {
    laws: [],
  },
  Tennessee: {
    laws: [
      {
        status: "Active",
        statusDate: 1868,
        link: "https://law.justia.com/codes/tennessee/title-39/chapter-17/part-3/section-39-17-309/",
        description:
          "Illegal to wear a mask while committing the offense of intimidating others from exercising civil rights.",
        condition: "While intimidating others from exercising rights",
        penalty: {
          classification: "Class A misdemeanor",
          prison: 12, // "Up to one year",
          fine: 2_500, // "Up to $2,500",
          link: "https://law.justia.com/codes/tennessee/2021/title-40/chapter-35/part-1/section-40-35-111/#:~:text=A%20sentence%20for%20a%20misdemeanor,unless%20otherwise%20provided%20by%20statute.",
        },
      },
      {
        status: "Active",
        region: {
          name: "Knoxville",
          type: "city",
        },
        link: "https://library.municode.com/tn/knoxville/codes/code_of_ordinances?nodeId=PTIICOOR_CH19OF_ARTIINGE",
        condition: "while in a public place or on someone else’s property",
        description:
          "makes it illegal to wear a mask or disguise in a public place or on someone else’s property either: to commit a public offense; intimidate, threaten, abuse, or harass another person; where it is “probable” that a “reasonable” person will fear for their safety; to evade identification during or after committing a crime; to obstruct police.",
      },
    ],
    note: {
      text: "Failed bill in January 2020 for masking during protest.",
      link: "https://www.icnl.org/usprotestlawtracker/?location=&status=&issue=5&date=&type=",
    },
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
        status: "Active",
        statusDate: 1950,
        description:
          "Illegal for anyone over 16 years of age to wear a mask or face covering with exemptions for trades, theater, or bona fide medical reasons with documentation.",
        condition: "General ban with medical exemption requiring documentation",
        link: "https://law.justia.com/codes/virginia/2006/toc1802000/18.2-422.html",
        penalty: [
          {
            classification: "class 6 felony",
            prison: {
              min: 12, // 1 year
              max: 60, // 5 years
            },
            link: "https://law.lis.virginia.gov/vacode/title18.2/chapter1/section18.2-10/",
          },
          {
            classification: "class 6 felony",
            prison: 12, // "Up to one year",
            fine: 2_500, // "Up to $2,500",
            link: "https://law.lis.virginia.gov/vacode/title18.2/chapter1/section18.2-10/",
          },
        ],
      },
    ],
    note: {
      text: "The City of Alexandria tried to ban ski masks in housing developments in November 2023, but the police and public pushed back.",
      link: "https://www.nbcwashington.com/news/local/northern-virginia/alexandria-sent-out-warning-about-ski-mask-ban-but-it-only-went-to-residents-in-public-housing/3483923/",
    },
  },
  Washington: {
    laws: [],
  },
  "West Virginia": {
    laws: [
      {
        status: "Active",
        statusDate: 1988,
        description:
          "Makes it illegal for anyone over 16 years of age to wear masks or face coverings, with exemptions for holiday costumes, trade, theater, masquerades, “civil defense drills,” or “for the sole purpose of protection from the elements or while participating in a winter sport.”",
        condition: "General ban with exemptions",
        link: "https://code.wvlegislature.gov/61-6-22/",
        penalty: {
          prison: 12, // "Up to one year",
          fine: 500, //"Up to $500",
        },
      },
    ],
  },
  Wisconsin: {
    laws: [],
    note: {
      link: "https://www.icnl.org/usprotestlawtracker/?location=&status=&issue=5&date=&type=",
      text: "failed bill criminalizing masking in public space in 2019.",
    },
  },
  Wyoming: {
    laws: [],
  },
} as const;

export type BanData = typeof banData;

export default banData;
