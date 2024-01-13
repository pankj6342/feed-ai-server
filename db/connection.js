const mongoose = require('mongoose');

const connectToMongo = () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
        console.log("connecting to db...")
        mongoose.connect(MONGO_URI);
        mongoose.connection.on('open',()=>{
            console.log("connected to database");
        })
  } catch (error) {
    console.log({error});
  }
}

module.exports=connectToMongo;