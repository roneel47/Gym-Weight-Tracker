/**
 * Test Database Connection
 * Quick script to verify MongoDB connection
 */

require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log(`📍 URI: ${process.env.MONGO_URI.substring(0, 50)}...`);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // List existing databases/collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach((col) => {
        console.log(`     - ${col.name}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Test complete. Disconnected successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Connection Failed: ${error.message}`);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Verify MongoDB URI in .env file');
    console.error('   2. Check network access in MongoDB Atlas (IP whitelist)');
    console.error('   3. Verify username and password');
    console.error('   4. Ensure internet connection is stable');
    process.exit(1);
  }
};

testConnection();
