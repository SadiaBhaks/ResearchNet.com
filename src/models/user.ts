import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
 
  password: { type: String, required: true },
 
  savedNotes: [{
    paperId: String,
    title: String,
    noteContent: String,
    dateSaved: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);