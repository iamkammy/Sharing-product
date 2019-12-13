const db = require('../environment/environment');
const mongoose = require('mongoose');

mongoose.connect(db.cloudDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Succesfully connected')).catch(() => console.log('Connection Error!'));
