const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
    try {
        console.log(process.env.MONGODB_URI)
        const connectToDB = await mongoose.connect(process.env.MONGODB_URI)
        
        if(connectToDB.connection.readyState === 1) console.log('DB connection is successful')
        else console.log('DB connecting')


    } catch (error) {
        console.log("DB connection is failed");
        throw new Error(error)

    }
};

module.exports = dbConnect;
