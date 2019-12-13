const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });


const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.static(__dirname + '/public'))

const config = require('./environment/environment');
const bodyParser = require('body-parser');


require('./db/mongodb');
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/users', require('./app/routes/user'));
app.use('/products', require('./app/routes/product'));
app.use('/ecommerce', require('./app/routes/ecommerce'));
app.use('/category', require('./app/routes/category'));
app.use('/vendors', require('./app/routes/vendor'));
app.get('/check', (req,res,next)=> {
    res.status(200).json({ message : 'API is working correctly, Data Get'});
})

app.get('/', (req,res)=> {
    res.status(200).json({ status: 'Success', message: 'Working Successfully'});
})
app.listen(config.port, () => console.log(`Server is running on ${config.port}`));