export const shippingCountries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
] as const;

export type ShippingCountryCode = typeof shippingCountries[number]['code'];

export const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

export const ukCounties = [
  "Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire",
  "Cheshire", "Cornwall", "County Durham", "Cumbria", "Derbyshire",
  "Devon", "Dorset", "East Sussex", "Essex", "Gloucestershire",
  "Greater London", "Greater Manchester", "Hampshire", "Herefordshire",
  "Hertfordshire", "Isle of Wight", "Kent", "Lancashire", "Leicestershire",
  "Lincolnshire", "Merseyside", "Norfolk", "North Yorkshire",
  "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire",
  "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire",
  "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands",
  "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire",
  "Edinburgh", "Glasgow", "Belfast", "Cardiff",
];

export const getRegions = (countryCode: ShippingCountryCode) => {
  return countryCode === 'US' ? usStates : ukCounties;
};

export const getRegionLabel = (countryCode: ShippingCountryCode) => {
  return countryCode === 'US' ? 'State' : 'County';
};

export const getPostalCodeLabel = (countryCode: ShippingCountryCode) => {
  return countryCode === 'US' ? 'ZIP Code' : 'Postcode';
};

export const getPhonePlaceholder = (countryCode: ShippingCountryCode) => {
  return countryCode === 'US' ? '+1 (555) 123-4567' : '+44 7700 900000';
};
