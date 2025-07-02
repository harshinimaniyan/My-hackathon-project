const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/task');

dotenv.config({ path: '../katomaran.env' });

const tasks = [
  {
    title: 'Implement JWT Authentication',
    description: 'Add secure JWT-based authentication to the backend API.',
    status: 'completed',
    priority: 'high',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Optimize Database Indexes',
    description: 'Analyze and optimize MongoDB indexes for faster queries.',
    status: 'in progress',
    priority: 'medium',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Refactor React Components',
    description: 'Break down large React components into reusable pieces.',
    status: 'pending',
    priority: 'medium',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'completed',
    priority: 'high',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'API Rate Limiting',
    description: 'Implement rate limiting middleware to prevent API abuse.',
    status: 'pending',
    priority: 'high',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Add Dark Mode',
    description: 'Enable dark mode toggle for the frontend UI.',
    status: 'in progress',
    priority: 'low',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Write Unit Tests',
    description: 'Increase test coverage for backend controllers and models.',
    status: 'pending',
    priority: 'medium',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
  {
    title: 'Integrate Payment Gateway',
    description: 'Add Stripe integration for processing user payments.',
    status: 'completed',
    priority: 'high',
    ownerId: new mongoose.Types.ObjectId('000000000000000000000001'),
    createdAt: new Date(),
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Task.deleteMany({}); // Optional: clear existing tasks
  await Task.insertMany(tasks);
  console.log('Seeded 8 technical tasks!');
  await mongoose.disconnect();
}

seed(); 