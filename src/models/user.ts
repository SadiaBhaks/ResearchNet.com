import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
 
  password: { type: String, required: true },
  // This is where we will store the research papers they save
  savedNotes: [{
    paperId: String,
    title: String,
    noteContent: String,
    dateSaved: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// This prevents creating the model multiple times during Next.js hot reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);