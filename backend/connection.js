const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://sgpa911:Atlas321@cluster0.l1351.mongodb.net/luluDB?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Database is connected');
})
.catch((error) => {
    console.error('Error in connection:', error.message); // Improved error logging
});
