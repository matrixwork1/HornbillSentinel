require('dotenv').config();
const mongoose = require('mongoose');

const dropDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_type_assessment';
        console.log(`Connecting to ${mongoUri}...`);

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected.');

        console.log('Dropping database...');
        await mongoose.connection.db.dropDatabase();

        console.log('Database dropped successfully.');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error dropping database:', error);
        process.exit(1);
    }
};

dropDatabase();
