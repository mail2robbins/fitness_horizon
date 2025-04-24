
- Progress analytics and visualization
- Social features and community engagement

SUPABASE + PRISMA
rm -r -force node_modules/.prisma

npx prisma migrate dev --name init

npx prisma generate

npx prisma db push


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
