// Shown until you save your own version from /admin
export default {
  // Colours and fonts for the whole site (edit in /admin > Theme)
  theme: {
    bg: '#FCF4D2', ink: '#6B1E2A', accent: '#8B2332', accent2: '#B5532F', band: '#F3E3B8', band2: '#6F7F52',
    scriptFont: 'Great Vibes', displayFont: 'Cormorant Garamond', bodyFont: 'DM Sans',
  },
  // Decoration images (upload in /admin > Decor). Empty = not shown.
  decor: {
    coverImage: '/defaults/cover.jpg',
    headerImage: '/defaults/gate.jpg',
    footerImage: '/defaults/couple.jpg',
    dividerImage: '',
    cornerImage: '',
    patternImage: '',
    welcomeText: 'Welcome!',
    inviteText: 'We invite you to the wedding of',
  },
  couple: {
    names: 'Kayes & Khatija',
    date: '2027-02-05T17:00:00',
    tagline: 'Together with our families, we invite you to celebrate our wedding.',
    venue: 'The Garden Pavilion',
    city: 'Dhaka, Bangladesh',
  },
  story: [
    { year: '2023', title: 'We met', text: 'A rainy afternoon, one shared umbrella, and a conversation that never really ended.' },
    { year: '2024', title: 'The first trip together', text: 'Mountains, bad maps, and the moment we both knew.' },
    { year: '2026', title: 'The proposal', text: 'On a rooftop at sunset, with a very surprised cat watching.' },
  ],
  celebration: [
    { title: 'Holud', time: 'Feb 03, 6:00 PM', place: 'Family home', text: 'Turmeric, music, and a lot of yellow.' },
    { title: 'Wedding Ceremony', time: 'Feb 05, 5:00 PM', place: 'The Garden Pavilion', text: 'Vows under the lanterns.' },
    { title: 'Reception', time: 'Feb 06, 8:00 PM', place: 'The Garden Pavilion', text: 'Dinner, dancing, and cake.' },
  ],
  theDay: [
    { time: '4:30 PM', title: 'Guests arrive' },
    { time: '5:00 PM', title: 'Ceremony begins' },
    { time: '6:30 PM', title: 'Photos and welcome drinks' },
    { time: '8:00 PM', title: 'Dinner and dancing' },
  ],
  dressCode: { text: 'Festive and colourful. Saris, panjabis, or formal wear in jewel tones.', colors: ['#E8574B', '#F2A93B', '#1F8A8A', '#C2335A'] },
  stay: [
    { name: 'Lakeview Hotel', distance: '5 minutes from the venue', note: 'Mention the wedding for a group rate.', link: 'https://example.com' },
    { name: 'City Guest House', distance: '12 minutes from the venue', note: 'Budget friendly, breakfast included.', link: 'https://example.com' },
  ],
  gifts: {
    text: 'Your presence is the gift. If you would like to give something, here are some ideas.',
    items: [{ label: 'Bkash', detail: '01XXXXXXXXX' }, { label: 'Bank transfer', detail: 'Account details on request' }],
  },
  footer: 'With love, Khatija & Kayes',
}
