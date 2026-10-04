export type Destination = {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'ICT Building',
    code: 'BLDG. 9',
    category: 'Academic',
    description:
      'Information and Communication Technology Building for ICT-related classes and activities.',
    latitude: 8.486270,
    longitude: 124.657167,
  },

  {
    id: '2',
    name: 'Learning Resource Center',
    code: 'BLDG. 23',
    category: 'Academic',
    description:
      'Learning Resource Center. The Main Library is located on the 3rd floor.',
    latitude: 8.4548,
    longitude: 124.6325,
  },

  {
    id: '3',
    name: 'Cafeteria',
    code: 'BLDG. 20',
    category: 'Food',
    description:
      'Cafeteria where students can buy food and drinks.',
    latitude: 8.4537,
    longitude: 124.6322,
  },

  {
    id: '4',
    name: 'Administration Building',
    code: 'BLDG. 10',
    category: 'Office',
    description:
      'New Administration Building for university administrative services.',
    latitude: 8.4550,
    longitude: 124.6314,
  },

  {
    id: '5',
    name: 'Student Center',
    code: 'BLDG. 36',
    category: 'Student Services',
    description:
      'Student Center for student activities and services.',
    latitude: 8.4535,
    longitude: 124.6313,
  },

  {
    id: '6',
    name: 'Science Complex',
    code: 'BLDG. 41',
    category: 'Academic',
    description:
      'Science Complex for science-related classes, laboratories, and activities.',
    latitude: 8.4540,
    longitude: 124.6320,
  },

  {
    id: '7',
    name: 'Engineering Complex I',
    code: 'BLDG. 42',
    category: 'Academic',
    description:
      'Engineering Complex I for engineering classes, laboratories, and activities.',
    latitude: 8.4541,
    longitude: 124.6321,
  },

  {
    id: '8',
    name: 'Engineering Complex II',
    code: 'BLDG. 43',
    category: 'Academic',
    description:
      'Engineering Complex II for engineering classes, laboratories, and activities.',
    latitude: 8.4543,
    longitude: 124.6323,
  },

  {
    id: '9',
    name: 'Gymnasium',
    code: 'BLDG. 16',
    category: 'Sports',
    description:
      'Gymnasium for sports, physical activities, and university events.',
    latitude: 8.4545,
    longitude: 124.6324,
  },

  {
    id: '10',
    name: 'University Health Center',
    code: 'BLDG. 27',
    category: 'Health',
    description:
      'University Health Center that provides health-related services for the campus community.',
    latitude: 8.4547,
    longitude: 124.6326,
  },
];