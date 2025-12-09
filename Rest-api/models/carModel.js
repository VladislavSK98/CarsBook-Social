const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: false
       
    },
    color: {
        type: String,
        required: false,
        
    },
    imageUrl: {
        type: String,
        
    },
    mods: {
        type: String,
        required: false,  
    },
    userId: {
        type: ObjectId,
        ref: "User",  
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: "User"  
    }]
}, { timestamps: { createdAt: 'created_at' } });  


const Car = mongoose.model('Car', carSchema);

module.exports = Car;
