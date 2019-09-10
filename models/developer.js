const mongoose = require('mongoose');

let developerSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        }
    },
    level : {
        type: String,
        validate:{
            validator: function (levelVal) {
                return levelVal === "Expert" || levelVal === "Beginner";
            }
        },
        required: true
    },
    address:{
        state: {
            type: String,
            required: true
        },
        suburb: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Developer', developerSchema);