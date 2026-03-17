import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  // Paper Metadata
  title: { 
    type: String, 
    required: true 
  },
  doi: { 
    type: String 
  },
  year: { 
    type: Number 
  },
  citations: { 
    type: Number, 
    default: 0 
  },
  is_oa: { 
    type: Boolean, 
    default: false 
  },
  tags: [String],
  aiSummary: { type: String },

  // Nexus Logic (Calculated in your card)
  trendLevel: { 
    type: String, 
    default: 'Steady Interest' 
  },
  feasibility: { 
    type: Number, 
    min: 0, 
    max: 100 
  },

  // USER DATA (Crucial for "My Library")
  userEmail: { 
    type: String, 
    required: true,
    index: true // Makes searching for a user's notes 10x faster
  },
  userNote: { 
    type: String, 
    maxlength: 2000 
  },
  
  // Internal tracking
  isSaved: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
});

export default mongoose.models.Topic || mongoose.model('Topic', TopicSchema);