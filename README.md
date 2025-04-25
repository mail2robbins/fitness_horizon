
- Progress analytics and visualization
- Social features and community engagement

SUPABASE + PRISMA
rm -r -force node_modules/.prisma

npx prisma migrate dev --name init

npx prisma generate

npx prisma db push


# to generate a new NEXTAUTH_SECRET
# node -e "console.log(crypto.randomBytes(32).toString('base64'))"


   # 1. Delete the migrations directory
   rm -r prisma/migrations
   
   # 2. Clear Prisma cache
   rm -r node_modules/.prisma
   
   # 3. Reinstall dependencies
   npm install
   
   # 4. Generate Prisma client
   npx prisma generate
   
   # 5. Push the schema to the database
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
