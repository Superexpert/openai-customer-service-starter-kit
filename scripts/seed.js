const { db } = require('@vercel/postgres');

async function seedSitemaps(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS sitemaps (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        sitemap TEXT NOT NULL,
        created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "sitemaps" table`);


    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function main() {
    const client = await db.connect();
  
    await seedSitemaps(client);
  
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });