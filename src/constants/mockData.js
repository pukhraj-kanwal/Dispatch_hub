// This file contains mock data for development purposes.
// Replace with actual API calls in a real application.

export const MOCK_DASHBOARD_DATA = {
  metrics: {
    todaysLoads: 2,
    milesToday: 156,
    tasksDone: {
        completed: 5,
        total: 8
    }
  },
  activeLoad: {
    id: 'DR-4582',
    status: 'In Progress',
    pickupLocation: 'Chicago, IL',
    dropoffLocation: 'Detroit, MI',
    estimatedArrival: '2:30 PM'
    // Add other load details as needed
  },
  // activeLoad: null, // Use this to test the 'No active loads' state
  tasks: [
    {
      id: 'task-1',
      title: 'Vehicle Inspection',
      dueDate: 'Today',
      status: 'overdue' // 'pending', 'completed', 'overdue'
    },
    {
      id: 'task-2',
      title: 'Update Logbook',
      dueDate: 'Today',
      status: 'completed'
    },
     {
      id: 'task-3',
      title: 'Safety Training Module',
      dueDate: 'Apr 18',
      status: 'pending'
    }
    // Add more tasks
  ],
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const formatDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const MOCK_LOADS_DATA = {
    confirmed: [
        {
            id: 'DR-4582',
            status: 'Confirmed',
            pickupLocation: 'Chicago, IL',
            pickupDate: formatDate(today),
            pickupTime: '10:00 AM',
            dropoffLocation: 'Detroit, MI',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '2:30 PM',
        },
        {
            id: 'DR-4583',
            status: 'Confirmed',
            pickupLocation: 'New York, NY',
            pickupDate: formatDate(today),
            pickupTime: '2:00 PM',
            pickupWarning: true, // Example warning
            dropoffLocation: 'Boston, MA',
            dropoffDate: formatDate(today),
            dropoffTime: '8:00 PM',
        },
        {
            id: 'DR-4584',
            status: 'Confirmed',
            pickupLocation: 'Miami, FL',
            pickupDate: formatDate(tomorrow),
            pickupTime: '9:00 AM',
            dropoffLocation: 'Orlando, FL',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '3:00 PM',
        },
        {
            id: 'DR-C001',
            status: 'Confirmed',
            pickupLocation: 'Dallas, TX',
            pickupDate: formatDate(today),
            pickupTime: '11:00 AM',
            dropoffLocation: 'Houston, TX',
            dropoffDate: formatDate(today),
            dropoffTime: '4:30 PM',
        },
        {
            id: 'DR-C002',
            status: 'Confirmed',
            pickupLocation: 'Atlanta, GA',
            pickupDate: formatDate(today),
            pickupTime: '3:30 PM',
            dropoffLocation: 'Nashville, TN',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '9:00 AM',
        },
        {
            id: 'DR-C003',
            status: 'Confirmed',
            pickupLocation: 'Denver, CO',
            pickupDate: formatDate(tomorrow),
            pickupTime: '8:00 AM',
            dropoffLocation: 'Salt Lake City, UT',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '6:00 PM',
        },
        {
            id: 'DR-C004',
            status: 'Confirmed',
            pickupLocation: 'Phoenix, AZ',
            pickupDate: formatDate(tomorrow),
            pickupTime: '10:30 AM',
            dropoffLocation: 'Las Vegas, NV',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '4:00 PM',
        },
        {
            id: 'DR-C005',
            status: 'Confirmed',
            pickupLocation: 'Minneapolis, MN',
            pickupDate: formatDate(dayAfterTomorrow),
            pickupTime: '7:00 AM',
            dropoffLocation: 'Milwaukee, WI',
            dropoffDate: formatDate(dayAfterTomorrow),
            dropoffTime: '1:00 PM',
        },
        {
            id: 'DR-C006',
            status: 'Confirmed',
            pickupLocation: 'Charlotte, NC',
            pickupDate: formatDate(dayAfterTomorrow),
            pickupTime: '12:00 PM',
            dropoffLocation: 'Raleigh, NC',
            dropoffDate: formatDate(dayAfterTomorrow),
            dropoffTime: '5:00 PM',
        },
        {
            id: 'DR-C007',
            status: 'Confirmed',
            pickupLocation: 'Kansas City, MO',
            pickupDate: formatDate(yesterday),
            pickupTime: '9:30 AM',
            dropoffLocation: 'St. Louis, MO',
            dropoffDate: formatDate(yesterday),
            dropoffTime: '3:00 PM',
        },
    ],
    unconfirmed: [
         {
            id: 'DR-4585',
            status: 'Unconfirmed',
            pickupLocation: 'Seattle, WA',
            pickupDate: formatDate(today),
            pickupTime: '11:30 AM',
            pickupWarning: true,
            dropoffLocation: 'Portland, OR',
            dropoffDate: formatDate(today),
            dropoffTime: '4:00 PM',
        },
        {
            id: 'DR-4586',
            status: 'Unconfirmed',
            pickupLocation: 'Los Angeles, CA',
            pickupDate: formatDate(today),
            pickupTime: '1:00 PM',
            dropoffLocation: 'San Diego, CA',
            dropoffDate: formatDate(today),
            dropoffTime: '5:30 PM',
        },
        {
            id: 'DR-4588',
            status: 'Incomplete',
            pickupLocation: 'Cleveland, OH',
            pickupDate: formatDate(today),
            pickupTime: '-',
            dropoffLocation: 'Pittsburgh, PA',
            dropoffDate: formatDate(today),
            dropoffTime: '-',
        },
         {
            id: 'DR-4587',
            status: 'Unconfirmed',
            pickupLocation: 'San Francisco, CA',
            pickupDate: formatDate(tomorrow),
            pickupTime: '9:00 AM',
            dropoffLocation: 'Sacramento, CA',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '1:30 PM',
        },
        {
            id: 'DR-U001',
            status: 'Unconfirmed',
            pickupLocation: 'Austin, TX',
            pickupDate: formatDate(today),
            pickupTime: '4:00 PM',
            dropoffLocation: 'San Antonio, TX',
            dropoffDate: formatDate(today),
            dropoffTime: '6:30 PM',
        },
        {
            id: 'DR-U002',
            status: 'Unconfirmed',
            pickupLocation: 'Philadelphia, PA',
            pickupDate: formatDate(tomorrow),
            pickupTime: '10:00 AM',
            dropoffLocation: 'Baltimore, MD',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '1:00 PM',
        },
        {
            id: 'DR-U003',
            status: 'Unconfirmed',
            pickupLocation: 'Indianapolis, IN',
            pickupDate: formatDate(tomorrow),
            pickupTime: '1:30 PM',
            dropoffLocation: 'Louisville, KY',
            dropoffDate: formatDate(tomorrow),
            dropoffTime: '5:00 PM',
        },
        {
            id: 'DR-U004',
            status: 'Unconfirmed',
            pickupLocation: 'Memphis, TN',
            pickupDate: formatDate(dayAfterTomorrow),
            pickupTime: '8:30 AM',
            dropoffLocation: 'Birmingham, AL',
            dropoffDate: formatDate(dayAfterTomorrow),
            dropoffTime: '2:00 PM',
        },
        {
            id: 'DR-U005',
            status: 'Unconfirmed',
            pickupLocation: 'Detroit, MI',
            pickupDate: formatDate(dayAfterTomorrow),
            pickupTime: '11:00 AM',
            dropoffLocation: 'Columbus, OH',
            dropoffDate: formatDate(dayAfterTomorrow),
            dropoffTime: '4:30 PM',
        },
        {
            id: 'DR-U006',
            status: 'Unconfirmed',
            pickupLocation: 'Boston, MA',
            pickupDate: formatDate(yesterday),
            pickupTime: '7:00 AM',
            dropoffLocation: 'Providence, RI',
            dropoffDate: formatDate(yesterday),
            dropoffTime: '9:00 AM',
        },
        {
            id: 'DR-U007',
            status: 'Unconfirmed',
            pickupLocation: 'Portland, OR',
            pickupDate: formatDate(twoDaysAgo),
            pickupTime: '2:00 PM',
            dropoffLocation: 'Boise, ID',
            dropoffDate: formatDate(yesterday),
            dropoffTime: '8:00 AM',
        },
    ]
};

// Mock data for a single load detail
export const MOCK_LOAD_DETAIL_DATA = {
    'DR-4582': {
        id: 'DR-4582',
        status: 'In Progress',
        pickupLocation: 'Chicago, IL',
        pickupDate: 'April 16',
        pickupTime: '10:00 AM',
        dropoffLocation: 'Detroit, MI',
        dropoffDate: 'April 17',
        dropoffTime: '2:30 PM',
        currentStage: 'In Transit', // 'Pickup', 'In Transit', 'Delivery'
        pickupTimeActual: '10:00 AM',
        inTransitStartTime: '12:15 PM',
        deliveryTimeEstimate: '2:30 PM',
        loadInfo: {
            type: 'Standard Freight',
            weight: '12,500 lbs',
            dimensions: "48' x 102' x 13'6'",
        },
        specialInstructions: 'Please ensure proper temperature control during transit. Contact warehouse manager upon arrival at Gate B.',
        recommendations: {
            temperature: 'Maintain 34-38°F during transit. Check temperature every 2 hours.',
            route: 'Avoid I-94 construction. Recommended route: I-80 to I-69.',
            weather: 'Light rain expected. Reduce speed in affected areas.',
        },
        dispatchNotes: [
            'Use Gate 2 for entry at pickup location',
            'Call dispatch 30 minutes before arrival',
            'Dock #14 assigned for unloading',
            'Contact warehouse manager at (555) 123-4567',
        ],
        documentsAvailable: true, // Flag to enable 'Access Documents' button
    },
    'DR-4583': {
        id: 'DR-4583',
        status: 'Confirmed',
        pickupLocation: 'New York, NY',
        pickupDate: formatDate(today),
        pickupTime: '2:00 PM',
        dropoffLocation: 'Boston, MA',
        dropoffDate: formatDate(today),
        dropoffTime: '8:00 PM',
        currentStage: 'Pickup',
        pickupTimeActual: null,
        inTransitStartTime: null,
        deliveryTimeEstimate: '8:00 PM',
        loadInfo: {
            type: 'Refrigerated',
            weight: '15,000 lbs',
            dimensions: '53\' x 102\' x 13\'6\'',
        },
        specialInstructions: 'Maintain temperature between 32-36°F. Check reefer unit hourly.',
        recommendations: { route: 'Use I-95 N. Expect heavy traffic near CT.' },
        dispatchNotes: ['Dock #5 at pickup.', 'Contact receiver by 6 PM.'],
        documentsAvailable: true,
    },
    'DR-4584': {
        id: 'DR-4584',
        status: 'Confirmed',
        pickupLocation: 'Miami, FL',
        pickupDate: formatDate(tomorrow),
        pickupTime: '9:00 AM',
        dropoffLocation: 'Orlando, FL',
        dropoffDate: formatDate(tomorrow),
        dropoffTime: '3:00 PM',
        currentStage: 'Pickup',
        pickupTimeActual: null,
        inTransitStartTime: null,
        deliveryTimeEstimate: '3:00 PM',
        loadInfo: { type: 'Dry Van', weight: '22,000 lbs', dimensions: '53\' x 102\' x 13\'6\'' },
        specialInstructions: 'None',
        recommendations: { weather: 'Potential afternoon thunderstorms.' },
        dispatchNotes: ['Standard pickup procedure.'],
        documentsAvailable: false,
    },
    'DR-4585': {
        id: 'DR-4585',
        status: 'Pending', // Match status from list if needed, or represent the detail state
        pickupLocation: 'Seattle, WA',
        pickupDate: 'April 16',
        pickupTime: '11:30 AM',
        dropoffLocation: 'Portland, OR',
        dropoffDate: 'April 16',
        dropoffTime: '4:00 PM',
        currentStage: 'Pickup',
        pickupTimeActual: null,
        inTransitStartTime: null,
        deliveryTimeEstimate: '4:00 PM',
         loadInfo: {
            type: 'Express Delivery',
            weight: '8,750 lbs',
            dimensions: "24' x 102' x 13'6'",
        },
        specialInstructions: 'Requires signature upon delivery. Fragile items.',
        recommendations: {
            temperature: null,
            route: 'Standard route via I-5 S.',
            weather: 'Clear conditions expected.',
        },
        dispatchNotes: [
            'Check in at main office upon arrival.',
            'Contact receiver John Smith at (503) 555-0123 prior to arrival.',
        ],
        documentsAvailable: false,
    },
    'DR-C001': {
        id: 'DR-C001',
        status: 'Confirmed',
        pickupLocation: 'Dallas, TX',
        pickupDate: formatDate(today),
        pickupTime: '11:00 AM',
        dropoffLocation: 'Houston, TX',
        dropoffDate: formatDate(today),
        dropoffTime: '4:30 PM',
        currentStage: 'Pickup',
        loadInfo: { type: 'Flatbed', weight: '30,000 lbs', dimensions: '48\'' },
        specialInstructions: 'Tarping required.',
        dispatchNotes: ['Contact site manager on arrival.'],
        documentsAvailable: true,
    },
    'DR-U001': {
        id: 'DR-U001',
        status: 'Unconfirmed',
        pickupLocation: 'Austin, TX',
        pickupDate: formatDate(today),
        pickupTime: '4:00 PM',
        dropoffLocation: 'San Antonio, TX',
        dropoffDate: formatDate(today),
        dropoffTime: '6:30 PM',
        currentStage: 'Pickup',
        loadInfo: { type: 'Dry Van', weight: '18,000 lbs', dimensions: '53\'' },
        specialInstructions: 'Evening delivery window.',
        dispatchNotes: [],
        documentsAvailable: false,
    },
    'DR-C003': {
        id: 'DR-C003',
        status: 'Confirmed',
        pickupLocation: 'Denver, CO',
        pickupDate: formatDate(tomorrow),
        pickupTime: '8:00 AM',
        dropoffLocation: 'Salt Lake City, UT',
        dropoffDate: formatDate(tomorrow),
        dropoffTime: '6:00 PM',
        currentStage: 'Pickup',
        loadInfo: { type: 'Dry Van', weight: '10,000 lbs', dimensions: '48\'' },
        specialInstructions: 'Handle with care - electronics.',
        recommendations: { route: 'Check I-70 mountain pass conditions before departure.' },
        dispatchNotes: ['Call ahead for gate code.'],
        documentsAvailable: true,
    }
};

export const MOCK_COMPLIANCE_TASKS = [
    {
        id: 'ctask-1',
        title: 'Daily Vehicle Inspection Report',
        description: 'Complete pre-trip inspection checklist for vehicle safety compliance. Check brakes, lights, tires, and other safety components.',
        dueDate: 'Today',
        status: 'Pending', // Pending, Completed, Overdue
        category: 'Inspection'
    },
    {
        id: 'ctask-2',
        title: 'Hours of Service Review',
        description: 'Review and confirm your hours of service logs for the past week. Verify all driving times and rest periods are accurately recorded.',
        dueDate: 'Apr 15',
        status: 'Overdue',
        category: 'Logs'
    },
    {
        id: 'ctask-3',
        title: 'License Verification',
        description: 'Upload current commercial driver\'s license for verification. Ensure license is valid and not expired.',
        dueDate: 'Apr 16',
        status: 'Completed',
        category: 'License'
    },
    {
        id: 'ctask-4',
        title: 'Safety Training Module',
        description: 'Watch required video content and complete assessment.',
        dueDate: 'Apr 18',
        status: 'Pending',
        category: 'Training'
    },
    {
        id: 'ctask-5',
        title: 'Drug & Alcohol Test',
        description: 'Complete mandatory random drug and alcohol screening.',
        dueDate: 'Apr 20',
        status: 'Pending',
        category: 'Compliance'
    }
];

export const MOCK_DOCUMENTS = {
    compliance: [
        { id: 'doc-c1', name: 'Daily Vehicle Inspection', date: 'Apr 16, 2024', status: 'Required', url: null },
        { id: 'doc-c2', name: 'Hours of Service Log', date: 'Apr 14, 2024', status: 'Uploaded', url: 'mock_hos_log.pdf' },
        { id: 'doc-c3', name: 'Annual Safety Certificate', date: 'Jan 10, 2024', status: 'Uploaded', url: 'mock_safety_cert.pdf' },
    ],
    driver: [
         { id: 'doc-d1', name: "Driver's License", date: 'Apr 15, 2024', status: 'Uploaded', url: 'mock_license.pdf' }, // Escaped apostrophe
         { id: 'doc-d2', name: 'Medical Certificate', date: 'Mar 01, 2024', status: 'Uploaded', url: 'mock_med_cert.pdf' },
    ],
    shipper: [
         { id: 'doc-s1', name: 'Bill of Lading #4582', date: 'Apr 15, 2024', status: 'Pending', url: null },
         { id: 'doc-s2', name: 'Border Crossing Permit', date: 'Apr 14, 2024', status: 'Uploaded', url: 'mock_border_permit.pdf' },
         { id: 'doc-s3', name: 'Shipping Manifest #SH123', date: 'Apr 10, 2024', status: 'Uploaded', url: 'mock_manifest.pdf' },
    ]
}; 