# Health & Fitness Tracker

A comprehensive health and fitness tracking application built with Next.js and Tailwind CSS.

## Features

- User authentication with Google and GitHub
- Workout tracking and logging
- Nutrition planning and meal tracking
- Progress analytics and visualization
- Social features and community engagement
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/health-fitness-tracker.git
cd health-fitness-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── workouts/          # Workout tracking pages
│   ├── nutrition/         # Nutrition tracking pages
│   └── progress/          # Progress tracking pages
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
└── types/                 # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
