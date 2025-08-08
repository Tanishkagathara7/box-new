// Test script to debug grounds issues
import mongoose from 'mongoose';
import Ground from './server/models/Ground.js';

const MONGODB_URI = 'mongodb+srv://rag123456:rag123456@cluster0.qipvo.mongodb.net/boxcricket?retryWrites=true&w=majority';

async function debugGrounds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all grounds
    const allGrounds = await Ground.find({});
    console.log(`\n📊 Total grounds in database: ${allGrounds.length}`);
    
    // Get grounds by status
    const activeGrounds = await Ground.find({ status: 'active' });
    const verifiedGrounds = await Ground.find({ isVerified: true });
    const activeVerifiedGrounds = await Ground.find({ status: 'active', isVerified: true });
    
    console.log(`✅ Active grounds: ${activeGrounds.length}`);
    console.log(`✅ Verified grounds: ${verifiedGrounds.length}`);
    console.log(`✅ Active AND verified grounds: ${activeVerifiedGrounds.length}`);
    
    // Get grounds by city
    const cities = ['mumbai', 'delhi', 'bangalore', 'ahmedabad', 'chennai', 'kolkata'];
    
    for (const city of cities) {
      const cityGrounds = await Ground.find({ 
        status: 'active',
        'location.cityId': city 
      });
      console.log(`🏙️ ${city.toUpperCase()}: ${cityGrounds.length} grounds`);
      
      if (cityGrounds.length > 0) {
        cityGrounds.forEach(ground => {
          console.log(`  - ${ground.name} (Status: ${ground.status}, Verified: ${ground.isVerified})`);
        });
      }
    }
    
    // Check for grounds with no cityId
    const noCityGrounds = await Ground.find({ 
      status: 'active',
      $or: [
        { 'location.cityId': { $exists: false } },
        { 'location.cityId': null },
        { 'location.cityId': '' }
      ]
    });
    console.log(`\n❓ Grounds with no cityId: ${noCityGrounds.length}`);
    noCityGrounds.forEach(ground => {
      console.log(`  - ${ground.name} (Status: ${ground.status}, Verified: ${ground.isVerified})`);
    });
    
    // Show all grounds with their details
    console.log('\n📋 All grounds with details:');
    allGrounds.forEach((ground, index) => {
      console.log(`${index + 1}. ${ground.name}`);
      console.log(`   Status: ${ground.status}`);
      console.log(`   Verified: ${ground.isVerified}`);
      console.log(`   City: ${ground.location?.cityId || 'NO CITY'}`);
      console.log(`   Address: ${ground.location?.address || 'NO ADDRESS'}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugGrounds();
