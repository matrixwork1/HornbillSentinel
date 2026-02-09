require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const User = require('../src/models/User'); // Ensure this path matches your project structure

async function run() {
  // 1. Setup and Connection
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_type_assessment';
  await mongoose.connect(uri);

  const email = `argon2test_${Date.now()}@example.com`;

  try {
    // 2. Create user: pre-save hashes with Argon2id
    let user = new User({ name: 'Argon Tester', email, password: 'Str0ng!Passw0rd123' });
    await user.save();

    const hash = user.password;
    
    // Fix: Correct splitting of the hash string to inspect components
    const parts = hash.split('$');
    // parts[0] is empty, parts[1] is 'argon2id', parts[2] is version, parts[3] is params, etc.
    const variant = parts[1] || '';
    const version = parts[2] || '';
    const params = parts[3] || '';
    
    console.log('Initial Argon2 hash:', hash);
    console.log('Variant:', variant, '| Version:', version, '| Params:', params);

    // 3. Verify Hash Structure and Parameters
    if (!hash.startsWith('$argon2')) throw new Error('Hash is not Argon2');
    if (!hash.includes('$argon2id')) throw new Error('Hash is not Argon2id'); // Fixed syntax error here
    
    // Verify the password works against the hash
    if (!(await argon2.verify(hash, 'Str0ng!Passw0rd123'))) throw new Error('argon2.verify failed');
    
    // Verify security parameters (Memory=64MB, Iterations=3, Parallelism=1)
    if (!/m=65536/.test(hash) || !/t=3/.test(hash) || !/p=1/.test(hash)) {
      throw new Error('Argon2 parameters mismatch');
    }

    // 4. Change password and verify previous/current behaviors
    const oldHash = user.password;
    console.log('Old hash (before change):', oldHash);
    
    user.password = 'N3w!Sup3rStr0ngPass';
    await user.save();
    
    // Reload user to get fresh data from DB
    user = await User.findOne({ email });
    console.log('New current hash (after change):', user.password);
    console.log('Stored previousPasswordHash:', user.previousPasswordHash);

    const matchNew = await user.comparePassword('N3w!Sup3rStr0ngPass');
    const matchOldCurrent = await user.comparePassword('Str0ng!Passw0rd123');
    const matchOldPrevious = await user.compareWithPreviousPassword('Str0ng!Passw0rd123');

    console.log('Compare new password ->', matchNew);
    console.log('Compare old password against current ->', matchOldCurrent);
    console.log('Compare old password against previous ->', matchOldPrevious);

    if (!matchNew) throw new Error('New password compare failed');
    if (matchOldCurrent) throw new Error('Old password still matches current');
    if (!matchOldPrevious) throw new Error('Previous password should match previous hash');
    
    // 6. Success & Cleanup
    console.log('Argon2id verification OK');

  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  } finally {
    // Always clean up and disconnect
    if (email) {
      await User.deleteOne({ email });
    }
    await mongoose.disconnect();
  }
}

run();