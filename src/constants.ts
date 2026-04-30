export interface Festival {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  description: string;
  link: string;
  coordinates: [number, number]; // [lat, lng]
}

export const FESTIVALS: Festival[] = [
  {
    id: 'ivrea',
    name: 'Battle of the Oranges',
    location: 'Ivrea',
    country: 'Italy',
    date: 'February (Carnival)',
    description: 'The largest food fight in Italy where teams of "aranceri" (orange throwers) on foot throw oranges at teams in horse-drawn carts.',
    link: 'https://www.storicocarnevaleivrea.it/',
    coordinates: [45.4667, 7.8833], // ✅ already good
  },
  {
    id: 'holi',
    name: 'Holi Festival',
    location: 'Mathura (common epicenter)',
    country: 'India',
    date: 'March (Phalguna month)',
    description: 'The festival of colors, representing the arrival of spring and the triumph of good over evil with colored powders and water.',
    link: 'https://en.wikipedia.org/wiki/Holi',
    coordinates: [27.4924, 77.6737], // ✅ Mathura (more accurate than center of India)
  },
  {
    id: 'tomatina',
    name: 'La Tomatina',
    location: 'Buñol',
    country: 'Spain',
    date: 'Last Wednesday of August',
    description: 'Participants throw tomatoes and get involved in this tomato-throwing fight purely for entertainment purposes.',
    link: 'https://latomatina.info/',
    coordinates: [39.9, -0.791], // ✅ already good
  },
  {
    id: 'songkran',
    name: 'Songkran',
    location: 'Bangkok',
    country: 'Thailand',
    date: 'April 13-15',
    description: 'The Thai New Year festival, famously celebrated with massive, friendly water fights across the streets of major cities.',
    link: 'https://en.wikipedia.org/wiki/Songkran_(Thailand)',
    coordinates: [13.7563, 100.5018], // ✅ Bangkok instead of country center
  },
  {
    id: 'boryeong',
    name: 'Boryeong Mud Festival',
    location: 'Boryeong',
    country: 'South Korea',
    date: 'July',
    description: 'An annual festival where visitors enjoy mud wrestling, mud sliding, and swimming in a giant mud tub.',
    link: 'https://www.mudfestival.or.kr/',
    coordinates: [36.3236, 126.612], // ✅ slightly more precise
  },
  {
    id: 'galaxidi',
    name: 'Galaxidi Flour War',
    location: 'Galaxidi',
    country: 'Greece',
    date: 'Clean Monday (start of Lent)',
    description: 'Participants throw colored flour at each other in a chaotic and vibrant celebration marking the beginning of Lent.',
    link: 'https://en.wikipedia.org/wiki/Galaxidi_Flour_War',
    coordinates: [38.3797, 22.3842],
  },
  {
    id: 'enfarinats',
    name: 'Els Enfarinats',
    location: 'Ibi',
    country: 'Spain',
    date: 'December 28 (Day of the Innocents)',
    description: 'A mock coup takes place where participants dressed in military outfits throw flour, eggs, and firecrackers in a playful battle.',
    link: 'https://en.wikipedia.org/wiki/Els_Enfarinats',
    coordinates: [38.3, -0.5714],
  }
];

export const STATUE_POINTS = [
  {
    position: [0, 2.72, 0.085],
    title: 'The Phrygian Cap',
    description: 'The Phrygian Cap: A red headdress, a historic symbol of freedom and revolution (a French legacy), worn to show support for the uprising and to symbolically protect oneself during battle.',
    image: '/frigio.jpg'
  },
  {
    position: [0, 2.295, 0.17],
    title: 'Faseuj grass',
    description: 'Faseuj grass: a hearty soup made with Saluggia or borlotti beans, pork rind, and salami, slowly simmered in large pots, evoking the ancient medieval tradition of charity. Fagiolate festivals are held in various neighborhoods to celebrate the local culinary tradition',
    image: '/fagioli.jpg'
  },
  {
    position: [0, 1.36, 0.255],
    title: 'Oranges',
    description: 'Oranges: These come mainly from Calabria and Sicily. They are citrus fruits unsuitable for human consumption (production waste) that, after harvesting, are collected and converted into biogas and compost.',
    image: '/arance.jpg'
  },
  {
    position: [0, 0.17, 0.51],
    title: 'The teams',
    description: 'The teams: Nine teams of orange-throwers on foot from the Historic Carnival of Ivrea represent the people rising up against the “carri da getto” (the tyrant\'s henchmen) in the famous Battle of the Oranges. The historic teams are Asso di Picche, Aranceri della Morte, Tuchini del Borghetto, Scacchi, Scorpioni d\'Arduino, Pantera Nera, Mercenari, Diavoli, and Credendari.',
    image: '/squadre-aranceri.jpg'
  }
];
