import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
