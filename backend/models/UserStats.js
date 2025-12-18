const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['leetcode', 'codeforces', 'codechef', 'w3schools']
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  stats: {
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    rank: {
      type: mongoose.Schema.Types.Mixed,  // Can store both numbers and strings like "unrated"
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    contestsParticipated: {
      type: Number,
      default: 0
    },
    maxRating: {
      type: Number,
      default: 0
    }
  },
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    totalSolved: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    }
  }],
  lastFetched: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fetchErrors: {
    type: Number,
    default: 0
  },
  lastError: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userStatsSchema.index({ userId: 1, platform: 1 }, { unique: true });
userStatsSchema.index({ lastFetched: 1 });

// Add new history entry
userStatsSchema.methods.addHistoryEntry = function(newStats) {
  const historyEntry = {
    date: new Date(),
    totalSolved: newStats.totalSolved || 0,
    rating: newStats.rating || 0,
    easySolved: newStats.easySolved || 0,
    mediumSolved: newStats.mediumSolved || 0,
    hardSolved: newStats.hardSolved || 0
  };
  
  this.history.push(historyEntry);
  
  // Keep only last 30 entries to manage storage
  if (this.history.length > 30) {
    this.history = this.history.slice(-30);
  }
};

// Update stats and add history
userStatsSchema.methods.updateStats = function(newStats) {
  // Add current stats to history before updating
  this.addHistoryEntry(newStats);
  
  // Update current stats
  this.stats = {
    ...this.stats,
    ...newStats
  };
  
  this.lastFetched = new Date();
  this.fetchErrors = 0;
  this.lastError = '';
};

module.exports = mongoose.model('UserStats', userStatsSchema);
