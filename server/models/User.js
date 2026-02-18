const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
    handle: { type: String, default: '' },
    stats: {
        solved: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        rank: { type: String, default: 'Unrated' },
        contests: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
    },
    heatmap: [{
        date: { type: String },
        count: { type: Number, default: 0 }
    }],
    recentSubmissions: [{
        problem: String,
        verdict: String,
        date: String,
        difficulty: String
    }],
    lastFetched: { type: Date, default: null }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    platforms: {
        codeforces: { type: PlatformSchema, default: () => ({}) },
        leetcode: { type: PlatformSchema, default: () => ({}) },
        codechef: { type: PlatformSchema, default: () => ({}) }
    },
    totalSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Virtual for connected platform count
UserSchema.virtual('connectedPlatforms').get(function () {
    return ['codeforces', 'leetcode', 'codechef']
        .filter(p => this.platforms[p]?.handle).length;
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
