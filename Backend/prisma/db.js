 
// src/lib/prisma.js
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Pool } from 'pg'
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // opcional: ssl: { rejectUnauthorized: false } si lo requiere
})


const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma
 

/*
import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const { PrismaClient } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // descomenta si tu hosting lo requiere
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

export default prisma

  */