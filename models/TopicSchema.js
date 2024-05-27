import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TopicSchema = new Schema ({
    title: {type: String, required: true, unique: true},
    description: {type: String},
    posts: {type: Array},
    subscribers: {type: Array}
})

const Topic = mongoose.model('topic',TopicSchema);

export default Topic;