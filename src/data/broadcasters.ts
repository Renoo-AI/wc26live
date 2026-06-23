import { CountryBroadcaster } from './types';

// Manually maintained mapping of country → official free broadcaster
// Only includes FREE or free-tier options, not paid cable/satellite
export const broadcasters: CountryBroadcaster[] = [
  // Europe
  {
    countryCode: 'GB', countryName: 'United Kingdom', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    broadcasters: [
      { name: 'BBC iPlayer', url: 'https://www.bbc.co.uk/iplayer', type: 'free', note: 'Free account required. UK only.' },
      { name: 'ITVX', url: 'https://www.itv.com/watch/itvx', type: 'free', note: 'Free with ads. UK only.' },
    ],
  },
  {
    countryCode: 'FR', countryName: 'France', flag: '🇫🇷',
    broadcasters: [
      { name: 'TF1+ (myTF1)', url: 'https://www.mytf1.fr', type: 'free', note: 'Free with ads. France only.' },
    ],
  },
  {
    countryCode: 'DE', countryName: 'Germany', flag: '🇩🇪',
    broadcasters: [
      { name: 'ARD Mediathek', url: 'https://www.ardmediathek.de', type: 'free', note: 'Free. Germany only.' },
      { name: 'ZDFmediathek', url: 'https://www.zdf.de', type: 'free', note: 'Free. Germany only.' },
    ],
  },
  {
    countryCode: 'ES', countryName: 'Spain', flag: '🇪🇸',
    broadcasters: [
      { name: 'RTVE Play', url: 'https://www.rtve.es/play', type: 'free', note: 'Free. Spain only.' },
    ],
  },
  {
    countryCode: 'IT', countryName: 'Italy', flag: '🇮🇹',
    broadcasters: [
      { name: 'RAI Play', url: 'https://www.raiplay.it', type: 'free', note: 'Free. Italy only.' },
    ],
  },
  {
    countryCode: 'PT', countryName: 'Portugal', flag: '🇵🇹',
    broadcasters: [
      { name: 'RTP Play', url: 'https://www.rtp.pt/play', type: 'free', note: 'Free. Portugal only.' },
    ],
  },
  {
    countryCode: 'NL', countryName: 'Netherlands', flag: '🇳🇱',
    broadcasters: [
      { name: 'NPO Start', url: 'https://www.npostart.nl', type: 'free', note: 'Free. Netherlands only.' },
    ],
  },
  {
    countryCode: 'BE', countryName: 'Belgium', flag: '🇧🇪',
    broadcasters: [
      { name: 'RTBF Auvio', url: 'https://www.rtbf.be/auvio', type: 'free', note: 'Free. French-speaking Belgium.' },
      { name: 'VRT MAX', url: 'https://www.vrt.be/vrtnu', type: 'free', note: 'Free. Flemish Belgium.' },
    ],
  },
  {
    countryCode: 'CH', countryName: 'Switzerland', flag: '🇨🇭',
    broadcasters: [
      { name: 'SRF Play', url: 'https://www.srf.ch/play', type: 'free', note: 'Free. Switzerland only.' },
    ],
  },
  {
    countryCode: 'DK', countryName: 'Denmark', flag: '🇩🇰',
    broadcasters: [
      { name: 'DR TV', url: 'https://www.dr.dk/drtv', type: 'free', note: 'Free. Denmark only.' },
    ],
  },
  {
    countryCode: 'NO', countryName: 'Norway', flag: '🇳🇴',
    broadcasters: [
      { name: 'NRK TV', url: 'https://tv.nrk.no', type: 'free', note: 'Free. Norway only.' },
    ],
  },
  {
    countryCode: 'SE', countryName: 'Sweden', flag: '🇸🇪',
    broadcasters: [
      { name: 'SVT Play', url: 'https://www.svtplay.se', type: 'free', note: 'Free. Sweden only.' },
    ],
  },
  {
    countryCode: 'PL', countryName: 'Poland', flag: '🇵🇱',
    broadcasters: [
      { name: 'TVP Stream', url: 'https://tvpstream.vod.tvp.pl', type: 'free', note: 'Free. Poland only.' },
    ],
  },
  {
    countryCode: 'AT', countryName: 'Austria', flag: '🇦🇹',
    broadcasters: [
      { name: 'ORF TVthek', url: 'https://tvthek.orf.at', type: 'free', note: 'Free. Austria only.' },
    ],
  },
  {
    countryCode: 'HR', countryName: 'Croatia', flag: '🇭🇷',
    broadcasters: [
      { name: 'HRTi', url: 'https://hrti.hrt.hr', type: 'free', note: 'Free. Croatia only.' },
    ],
  },
  {
    countryCode: 'RS', countryName: 'Serbia', flag: '🇷🇸',
    broadcasters: [
      { name: 'RTS Play', url: 'https://www.rts.rs', type: 'free', note: 'Free. Serbia only.' },
    ],
  },
  {
    countryCode: 'CZ', countryName: 'Czech Republic', flag: '🇨🇿',
    broadcasters: [
      { name: 'ČT iVysílání', url: 'https://www.ceskatelevize.cz/ivysilani', type: 'free', note: 'Free. Czech Republic only.' },
    ],
  },
  {
    countryCode: 'RO', countryName: 'Romania', flag: '🇷🇴',
    broadcasters: [
      { name: 'TVR Play', url: 'https://tvrplus.ro', type: 'free', note: 'Free. Romania only.' },
    ],
  },
  {
    countryCode: 'HU', countryName: 'Hungary', flag: '🇭🇺',
    broadcasters: [
      { name: 'MTVA', url: 'https://www.mediaklikk.hu', type: 'free', note: 'Free. Hungary only.' },
    ],
  },
  {
    countryCode: 'GR', countryName: 'Greece', flag: '🇬🇷',
    broadcasters: [
      { name: 'ERTFlix', url: 'https://www.ertflix.gr', type: 'free', note: 'Free. Greece only.' },
    ],
  },
  {
    countryCode: 'UA', countryName: 'Ukraine', flag: '🇺🇦',
    broadcasters: [
      { name: 'Suspilne', url: 'https://suspilne.media', type: 'free', note: 'Free. Ukraine only.' },
    ],
  },
  {
    countryCode: 'TR', countryName: 'Turkey', flag: '🇹🇷',
    broadcasters: [
      { name: 'TRT Play', url: 'https://www.trt.net.tr', type: 'free', note: 'Free. Turkey only.' },
    ],
  },

  // Americas
  {
    countryCode: 'US', countryName: 'United States', flag: '🇺🇸',
    broadcasters: [
      { name: 'FOX Sports (Free Tier)', url: 'https://www.foxsports.com', type: 'cable', note: 'Select matches free on FOX. Most require cable login.' },
      { name: 'Telemundo Deportes', url: 'https://www.telemundo.com/deportes', type: 'cable', note: 'Spanish coverage. Cable login may be required.' },
    ],
  },
  {
    countryCode: 'CA', countryName: 'Canada', flag: '🇨🇦',
    broadcasters: [
      { name: 'CBC Gem', url: 'https://gem.cbc.ca', type: 'free', note: 'Free. Canada only. All matches.' },
    ],
  },
  {
    countryCode: 'MX', countryName: 'Mexico', flag: '🇲🇽',
    broadcasters: [
      { name: 'Canal de las Estrellas', url: 'https://www.lasestrellas.tv', type: 'free', note: 'Free over-the-air. Mexico only.' },
      { name: 'TUDN', url: 'https://www.tudn.com', type: 'cable', note: 'Cable required for full coverage.' },
    ],
  },
  {
    countryCode: 'BR', countryName: 'Brazil', flag: '🇧🇷',
    broadcasters: [
      { name: 'TV Globo (Globoplay)', url: 'https://globoplay.globo.com', type: 'free', note: 'Free tier available. Brazil only.' },
    ],
  },
  {
    countryCode: 'AR', countryName: 'Argentina', flag: '🇦🇷',
    broadcasters: [
      { name: 'TyC Sports Play', url: 'https://www.tycsports.com', type: 'free', note: 'Free. Argentina only.' },
      { name: 'Public TV (TVP)', url: 'https://www.tvpublica.com.ar', type: 'free', note: 'Free over-the-air. Argentina only.' },
    ],
  },
  {
    countryCode: 'CO', countryName: 'Colombia', flag: '🇨🇴',
    broadcasters: [
      { name: 'Caracol Play', url: 'https://www.caracoltv.com', type: 'free', note: 'Free tier available. Colombia only.' },
    ],
  },
  {
    countryCode: 'CL', countryName: 'Chile', flag: '🇨🇱',
    broadcasters: [
      { name: 'TVN', url: 'https://www.tvn.cl', type: 'free', note: 'Free. Chile only.' },
    ],
  },
  {
    countryCode: 'PE', countryName: 'Peru', flag: '🇵🇪',
    broadcasters: [
      { name: 'América TV', url: 'https://www.americatv.com.pe', type: 'free', note: 'Free. Peru only.' },
    ],
  },
  {
    countryCode: 'UY', countryName: 'Uruguay', flag: '🇺🇾',
    broadcasters: [
      { name: 'Antel TV', url: 'https://www.antel.com.uy', type: 'free', note: 'Free. Uruguay only.' },
    ],
  },
  {
    countryCode: 'EC', countryName: 'Ecuador', flag: '🇪🇨',
    broadcasters: [
      { name: 'Ecuavisa', url: 'https://www.ecuavisa.com', type: 'free', note: 'Free. Ecuador only.' },
    ],
  },

  // Asia-Pacific
  {
    countryCode: 'AU', countryName: 'Australia', flag: '🇦🇺',
    broadcasters: [
      { name: 'SBS On Demand', url: 'https://www.sbs.com.au/ondemand', type: 'free', note: 'Free. Australia only. All matches.' },
    ],
  },
  {
    countryCode: 'NZ', countryName: 'New Zealand', flag: '🇳🇿',
    broadcasters: [
      { name: 'TVNZ+', url: 'https://www.tvnz.co.nz', type: 'free', note: 'Free. New Zealand only.' },
    ],
  },
  {
    countryCode: 'JP', countryName: 'Japan', flag: '🇯🇵',
    broadcasters: [
      { name: 'TVer', url: 'https://tver.jp', type: 'free', note: 'Free. Japan only. Some matches.' },
      { name: 'AbemaTV', url: 'https://abema.tv', type: 'free', note: 'Free tier. Japan only.' },
    ],
  },
  {
    countryCode: 'KR', countryName: 'South Korea', flag: '🇰🇷',
    broadcasters: [
      { name: 'KBS', url: 'https://www.kbs.co.kr', type: 'free', note: 'Free. South Korea only.' },
      { name: 'SBS', url: 'https://www.sbs.co.kr', type: 'free', note: 'Free. South Korea only.' },
    ],
  },
  {
    countryCode: 'IN', countryName: 'India', flag: '🇮🇳',
    broadcasters: [
      { name: 'JioCinema', url: 'https://www.jiocinema.com', type: 'free', note: 'Free. India only. All matches live.' },
      { name: 'Sports18 (JioCinema)', url: 'https://www.jiocinema.com/sports', type: 'free', note: 'Free. India only.' },
    ],
  },
  {
    countryCode: 'CN', countryName: 'China', flag: '🇨🇳',
    broadcasters: [
      { name: 'CCTV 5', url: 'https://tv.cctv.com/live/cctv5', type: 'free', note: 'Free. China only.' },
      { name: 'Migu Video', url: 'https://www.miguvideo.com', type: 'free', note: 'Free tier. China only.' },
    ],
  },
  {
    countryCode: 'ID', countryName: 'Indonesia', flag: '🇮🇩',
    broadcasters: [
      { name: 'RCTI+', url: 'https://www.rctiplus.com', type: 'free', note: 'Free tier. Indonesia only.' },
    ],
  },
  {
    countryCode: 'TH', countryName: 'Thailand', flag: '🇹🇭',
    broadcasters: [
      { name: 'AIS Play', url: 'https://www.aisplay.com', type: 'free', note: 'Free tier. Thailand only.' },
    ],
  },
  {
    countryCode: 'SA', countryName: 'Saudi Arabia', flag: '🇸🇦',
    broadcasters: [
      { name: 'SSC', url: 'https://www.ssc-sports.com', type: 'free', note: 'Free tier. Saudi Arabia only.' },
    ],
  },
  {
    countryCode: 'AE', countryName: 'UAE', flag: '🇦🇪',
    broadcasters: [
      { name: 'ADMC Sports', url: 'https://www.admc.com', type: 'cable', note: 'Cable may be required.' },
    ],
  },
  {
    countryCode: 'QA', countryName: 'Qatar', flag: '🇶🇦',
    broadcasters: [
      { name: 'beIN Sports Connect', url: 'https://www.bein.com', type: 'cable', note: 'Subscription required.' },
    ],
  },
  {
    countryCode: 'IR', countryName: 'Iran', flag: '🇮🇷',
    broadcasters: [
      { name: 'IRIB', url: 'https://www.irib.ir', type: 'free', note: 'Free. Iran only.' },
    ],
  },

  // Africa
  {
    countryCode: 'ZA', countryName: 'South Africa', flag: '🇿🇦',
    broadcasters: [
      { name: 'SABC', url: 'https://www.sabc.co.za', type: 'free', note: 'Free over-the-air. South Africa only.' },
      { name: 'e.tv', url: 'https://www.etv.co.za', type: 'free', note: 'Free. South Africa only.' },
    ],
  },
  {
    countryCode: 'NG', countryName: 'Nigeria', flag: '🇳🇬',
    broadcasters: [
      { name: 'DAAR Communications', url: 'https://daartv.com', type: 'free', note: 'Free over-the-air. Nigeria only.' },
    ],
  },
  {
    countryCode: 'EG', countryName: 'Egypt', flag: '🇪🇬',
    broadcasters: [
      { name: 'ON Time Sports', url: 'https://ontimesports.com', type: 'cable', note: 'Cable required.' },
    ],
  },
  {
    countryCode: 'MA', countryName: 'Morocco', flag: '🇲🇦',
    broadcasters: [
      { name: 'SNRT', url: 'https://www.snrtlive.com', type: 'free', note: 'Free. Morocco only.' },
    ],
  },
  {
    countryCode: 'SN', countryName: 'Senegal', flag: '🇸🇳',
    broadcasters: [
      { name: 'RTS', url: 'https://www.rts.sn', type: 'free', note: 'Free. Senegal only.' },
    ],
  },
  {
    countryCode: 'KE', countryName: 'Kenya', flag: '🇰🇪',
    broadcasters: [
      { name: 'KBC', url: 'https://www.kbc.co.ke', type: 'free', note: 'Free. Kenya only.' },
    ],
  },
  {
    countryCode: 'GH', countryName: 'Ghana', flag: '🇬🇭',
    broadcasters: [
      { name: 'GBC', url: 'https://www.gbcghanaonline.com', type: 'free', note: 'Free. Ghana only.' },
    ],
  },
  {
    countryCode: 'TN', countryName: 'Tunisia', flag: '🇹🇳',
    broadcasters: [
      { name: 'Watania 1', url: 'https://www.watania.tn', type: 'free', note: 'Free. Tunisia only.' },
    ],
  },
  {
    countryCode: 'CD', countryName: 'DR Congo', flag: '🇨🇩',
    broadcasters: [
      { name: 'RTNC', url: 'https://www.rtnc.cd', type: 'free', note: 'Free. DR Congo only.' },
    ],
  },

  // Other
  {
    countryCode: 'IE', countryName: 'Ireland', flag: '🇮🇪',
    broadcasters: [
      { name: 'RTÉ Player', url: 'https://www.rte.ie/player', type: 'free', note: 'Free. Ireland only.' },
    ],
  },
  {
    countryCode: 'FI', countryName: 'Finland', flag: '🇫🇮',
    broadcasters: [
      { name: 'Yle Areena', url: 'https://areena.yle.fi', type: 'free', note: 'Free. Finland only.' },
    ],
  },
];

export function getBroadcasterForCountry(countryCode: string): CountryBroadcaster | undefined {
  return broadcasters.find((b) => b.countryCode === countryCode);
}

export function getAllCountries(): CountryBroadcaster[] {
  return broadcasters;
}

// Fallback for countries not in the list
export const defaultBroadcaster: CountryBroadcaster = {
  countryCode: 'XX',
  countryName: 'Other',
  flag: '🌍',
  broadcasters: [
    {
      name: 'FIFA+',
      url: 'https://www.fifa.com/fifaplus/',
      type: 'free',
      note: 'Limited free coverage. Check locally for full coverage.',
    },
  ],
};