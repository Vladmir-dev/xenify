import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Since we are running this outside the Next.js app context, 
// we re-initialize the connection briefly for the script.
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Clean the database (Optional: helps avoid duplicates when re-seeding)
  await prisma.expense.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create a Demo User
  const user = await prisma.user.create({
    data: {
      name: 'Pius Tumwebaze',
      email: 'tempestpius70@gmail.com', // Using your email from the prompt
    },
  })

  // 3. Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Food & Drinks', userId: user.id } }),
    prisma.category.create({ data: { name: 'Transport', userId: user.id } }),
    prisma.category.create({ data: { name: 'Software/SaaS', userId: user.id } }),
    prisma.category.create({ data: { name: 'Office Supplies', userId: user.id } }),
  ])

  // 4. Create Sample Expenses
  await prisma.expense.createMany({
    data: [
      {
        amount: 45.50,
        description: 'Team Lunch',
        paymentMethod: 'Card',
        categoryId: categories[0].id,
        userId: user.id,
        date: new Date(),
      },
      {
        amount: 120.00,
        description: 'Monthly Cloud Hosting',
        paymentMethod: 'Credit Card',
        categoryId: categories[2].id,
        userId: user.id,
        date: new Date(),
      },
      {
        amount: 15.00,
        description: 'Uber to Office',
        paymentMethod: 'Cash',
        categoryId: categories[1].id,
        userId: user.id,
        date: new Date(Date.now() - 86400000), // Yesterday
      }
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })