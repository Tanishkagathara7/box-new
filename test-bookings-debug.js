// Test script to debug bookings causing "fully booked" issue
import mongoose from 'mongoose';
import Booking from './server/models/Booking.js';

const MONGODB_URI = 'mongodb+srv://rag123456:rag123456@cluster0.qipvo.mongodb.net/boxcricket?retryWrites=true&w=majority';

async function debugBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all bookings
    const allBookings = await Booking.find({});
    console.log(`\n📊 Total bookings in database: ${allBookings.length}`);
    
    // Get today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = await Booking.find({
      bookingDate: today,
      status: { $in: ["pending", "confirmed"] }
    });
    console.log(`📅 Today's bookings (${today}): ${todayBookings.length}`);
    
    // Get bookings by status
    const pendingBookings = await Booking.find({ status: 'pending' });
    const confirmedBookings = await Booking.find({ status: 'confirmed' });
    const cancelledBookings = await Booking.find({ status: 'cancelled' });
    
    console.log(`⏳ Pending bookings: ${pendingBookings.length}`);
    console.log(`✅ Confirmed bookings: ${confirmedBookings.length}`);
    console.log(`❌ Cancelled bookings: ${cancelledBookings.length}`);
    
    // Check bookings for specific cities
    const cities = ['mumbai', 'delhi', 'bangalore', 'ahmedabad', 'chennai', 'kolkata'];
    
    for (const city of cities) {
      const cityBookings = await Booking.find({
        bookingDate: today,
        status: { $in: ["pending", "confirmed"] }
      }).populate('groundId', 'name location.cityId');
      
      const cityGroundBookings = cityBookings.filter(booking => 
        booking.groundId?.location?.cityId === city
      );
      
      console.log(`🏙️ ${city.toUpperCase()} - Today's bookings: ${cityGroundBookings.length}`);
      
      if (cityGroundBookings.length > 0) {
        cityGroundBookings.forEach(booking => {
          console.log(`  - Ground: ${booking.groundId?.name} (${booking.timeSlot?.startTime}-${booking.timeSlot?.endTime}) - Status: ${booking.status}`);
        });
      }
    }
    
    // Show all today's bookings with details
    console.log('\n📋 All today\'s bookings:');
    todayBookings.forEach((booking, index) => {
      console.log(`${index + 1}. Ground: ${booking.groundId}`);
      console.log(`   Time: ${booking.timeSlot?.startTime}-${booking.timeSlot?.endTime}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Date: ${booking.bookingDate}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugBookings();
