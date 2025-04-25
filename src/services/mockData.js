import dayjs from 'dayjs';

// Sample data structure - Adapt types/fields as needed based on actual Load/LoadDetail types

export const MOCK_LOADS = [
  {
    id: 'DR-4582',
    pickupLocation: 'Chicago, IL',
    dropoffLocation: 'Detroit, MI',
    pickupDate: dayjs().format('YYYY-MM-DD'), // Today
    pickupTime: '10:00 AM',
    dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'), // Tomorrow
    dropoffTime: '2:30 PM',
    status: 'In Progress', // Example: Active load
    currentStage: 'In Transit',
  },
  {
    id: 'DR-4585',
    pickupLocation: 'Seattle, WA',
    dropoffLocation: 'Portland, OR',
    pickupDate: dayjs().format('YYYY-MM-DD'), // Today
    pickupTime: '11:30 AM',
    dropoffDate: dayjs().format('YYYY-MM-DD'),
    dropoffTime: '6:00 PM',
    status: 'Confirmed',
    currentStage: 'Pickup',
  },
  {
    id: 'DR-4583',
    pickupLocation: 'New York, NY',
    dropoffLocation: 'Boston, MA',
    pickupDate: dayjs().format('YYYY-MM-DD'), // Today
    pickupTime: '2:00 PM',
    dropoffDate: dayjs().format('YYYY-MM-DD'),
    dropoffTime: '8:00 PM',
    status: 'Confirmed',
    currentStage: 'Pickup',
  },
   {
    id: 'DR-4586',
    pickupLocation: 'Dallas, TX',
    dropoffLocation: 'Houston, TX',
    pickupDate: dayjs().format('YYYY-MM-DD'), // Today
    pickupTime: '4:00 PM',
    dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dropoffTime: '9:00 AM',
    status: 'Unconfirmed',
    currentStage: 'Pending',
  },
  {
    id: 'DR-4584',
    pickupLocation: 'Miami, FL',
    dropoffLocation: 'Orlando, FL',
    pickupDate: dayjs().add(1, 'day').format('YYYY-MM-DD'), // Tomorrow
    pickupTime: '9:00 AM',
    dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dropoffTime: '3:00 PM',
    status: 'Confirmed',
    currentStage: 'Pickup',
  },
   {
    id: 'DR-4587',
    pickupLocation: 'Denver, CO',
    dropoffLocation: 'Salt Lake City, UT',
    pickupDate: dayjs().add(1, 'day').format('YYYY-MM-DD'), // Tomorrow
    pickupTime: '1:00 PM',
    dropoffDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    dropoffTime: '7:00 PM',
    status: 'Unconfirmed',
    currentStage: 'Pending',
  },
   {
    id: 'DR-4588',
    pickupLocation: 'Atlanta, GA',
    dropoffLocation: 'Nashville, TN',
    pickupDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Future
    pickupTime: '10:30 AM',
    dropoffDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    dropoffTime: '5:00 PM',
    status: 'Confirmed',
    currentStage: 'Pickup',
  },
  {
    id: 'DR-4589',
    pickupLocation: 'Los Angeles, CA',
    dropoffLocation: 'San Francisco, CA',
    pickupDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), // Yesterday
    pickupTime: '3:00 PM',
    dropoffDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    dropoffTime: '10:00 PM',
    status: 'Delivered',
    currentStage: 'Delivered',
  },
];

export const MOCK_LOAD_DETAILS = MOCK_LOADS.reduce((acc, load) => {
  acc[load.id] = {
    ...load, // Include all list fields
    // Add more detailed fields
    loadInfo: {
      type: 'General Freight',
      weight: '42,000 lbs',
      dimensions: '53ft Trailer',
    },
    specialInstructions: load.id === 'DR-4583' ? 'Handle with care. Fragile items. Contact dispatch on arrival.' : null,
    recommendations: {
      temperature: null,
      route: load.id === 'DR-4587' ? 'Consider I-70 closure alerts due to weather.' : 'Standard route recommended.',
      weather: load.id === 'DR-4587' ? 'Potential snowstorms expected in the Rockies.' : null,
    },
    dispatchNotes: [
      `Contact Shipper: John Doe at 555-123-4567 on arrival.`, // Example phone number
      `BOL required at pickup.`,
      load.id === 'DR-4582' ? 'Gate code: #1984' : 'Standard procedure at gate.'
    ],
    pickupTimeActual: load.status === 'In Progress' || load.status === 'Delivered' ? dayjs(load.pickupDate + ' ' + load.pickupTime).add(15, 'minutes').format('h:mm A') : null,
    inTransitStartTime: load.status === 'In Progress' || load.status === 'Delivered' ? dayjs(load.pickupDate + ' ' + load.pickupTime).add(45, 'minutes').format('h:mm A') : null,
    deliveryTimeEstimate: load.status === 'In Progress' ? dayjs(load.dropoffDate + ' ' + load.dropoffTime).subtract(30, 'minutes').format('h:mm A') : null,
    documentsAvailable: true,
  };
  return acc;
}, {});

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Load DR-4582 Update',
    message: 'Pickup confirmed. Load is now In Transit.',
    timestamp: dayjs().subtract(15, 'minutes').toISOString(),
    readStatus: false,
    type: 'Load Update',
    relatedId: 'DR-4582' // Optional: Link to related entity
  },
  {
    id: 'notif-2',
    title: 'New Load Assigned',
    message: 'Load DR-4588 (Atlanta, GA → Nashville, TN) has been assigned to you.',
    timestamp: dayjs().subtract(2, 'hours').toISOString(),
    readStatus: false,
    type: 'Load Assignment',
    relatedId: 'DR-4588'
  },
  {
    id: 'notif-3',
    title: 'Compliance Task Due Soon',
    message: 'Your quarterly safety certification is due on ' + dayjs().add(3, 'days').format('MMMM D') + '.',
    timestamp: dayjs().subtract(1, 'day').toISOString(),
    readStatus: true,
    type: 'Compliance',
    relatedId: 'compliance-task-123' // Example ID
  },
   {
    id: 'notif-4',
    title: 'System Maintenance Alert',
    message: 'Scheduled maintenance tonight from 11 PM to 1 AM. Expect brief downtime.',
    timestamp: dayjs().subtract(4, 'hours').toISOString(),
    readStatus: false,
    type: 'System',
  },
    {
    id: 'notif-5',
    title: 'Load DR-4589 Delivered',
    message: 'Load DR-4589 has been successfully marked as Delivered.',
    timestamp: dayjs().subtract(1, 'day').add(2, 'hours').toISOString(), // Sometime yesterday
    readStatus: true,
    type: 'Load Update',
    relatedId: 'DR-4589'
  },
]; 