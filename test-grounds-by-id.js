// Test script to check grounds by specific IDs
import mongoose from 'mongoose';
import Ground from './server/models/Ground.js';

const MONGODB_URI = 'mongodb+srv://rag123456:rag123456@cluster0.qipvo.mongodb.net/boxcricket?retryWrites=true&w=majority';

async function checkGroundsById() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check specific ground IDs from bookings
    const groundIds = [
      '686a5d1508a2ea68296f325e',
      '688ca5e1ae0e73d7ddd327fb', 
      '6895ab89f643472ef78d19f9',
      '686a5d1508a2ea68296f323f'
    ];
    
    console.log('\n🔍 Checking grounds by ID:');
    for (const id of groundIds) {
      const ground = await Ground.findById(id);
      if (ground) {
        console.log(`✅ Found ground: ${ground.name}`);
        console.log(`   City: ${ground.location?.cityId}`);
        console.log(`   Status: ${ground.status}`);
        console.log(`   Verified: ${ground.isVerified}`);
      } else {
        console.log(`❌ Ground not found: ${id}`);
      }
    }
    
    // Check if these IDs exist in our known grounds
    const allGrounds = await Ground.find({});
    console.log('\n📋 All ground IDs in database:');
    allGrounds.forEach(ground => {
      console.log(`${ground._id} - ${ground.name} (${ground.location?.cityId})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkGroundsById();
