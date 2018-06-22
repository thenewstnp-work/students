const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    stu_name: {
        type: String,
        required: true
    },
    stu_age: {
        type: String,
        required: true
    },
    stu_sex: {
        type: String,
        required: true
    },
    stu_class: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("student", IdeaSchema);