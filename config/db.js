const mongoose = require('mongoose')
const connectDb = async() => {
    try 
    {
        const connect = await mongoose.connect(process.env.DB_URL)
        console.log('DB connected :', connect.connection.host, connect.connection.name);
    } 
    catch (error) 
    {
        console.log(`db error`);
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDb