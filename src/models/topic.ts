import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  
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

 
  trendLevel: { 
    type: String, 
    default: 'Steady Interest' 
  },
  feasibility: { 
    type: Number, 
    min: 0, 
    max: 100 
  },

 
  userEmail: { 
    type: String, 
    required: true,
    index: true 
  },
  userNote: { 
    type: String, 
    maxlength: 2000 
  },
  
  isSaved: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Topic || mongoose.model('Topic', TopicSchema);