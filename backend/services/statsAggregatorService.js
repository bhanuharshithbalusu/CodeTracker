const UserStats = require('../models/UserStats');
const leetcodeService = require('./leetcodeService');
const codeforcesService = require('./codeforcesService');
const codechefService = require('./codechefService');
const w3schoolsService = require('./w3schoolsService');

class StatsAggregatorService {
  constructor() {
    this.services = {
      leetcode: leetcodeService,
      codeforces: codeforcesService,
      codechef: codechefService,
      w3schools: w3schoolsService
    };
  }

  async fetchAllUserStats(userId, platforms) {
    const results = {
      success: [],
      errors: []
    };

    for (const [platform, username] of Object.entries(platforms)) {
      if (!username || username.trim() === '') continue;

      try {
        const stats = await this.fetchPlatformStats(platform, username);
        await this.saveUserStats(userId, platform, username, stats);
        results.success.push({ platform, stats });
      } catch (error) {
        console.error(`Error fetching ${platform} stats for ${username}:`, error.message);
        results.errors.push({ platform, username, error: error.message });
        
        // Update error count in database
        await this.updateErrorCount(userId, platform, username, error.message);
      }
    }

    return results;
  }

  async fetchPlatformStats(platform, username) {
    const service = this.services[platform];
    if (!service) {
      throw new Error(`Platform ${platform} is not supported`);
    }

    return await service.fetchUserStats(username);
  }

  async saveUserStats(userId, platform, username, stats) {
    try {
      let userStats = await UserStats.findOne({ userId, platform });

      if (!userStats) {
        userStats = new UserStats({
          userId,
          platform,
          username,
          stats: {},
          history: []
        });
      }

      // Update stats and add to history
      userStats.updateStats(stats);
      userStats.username = username; // Update username in case it changed

      await userStats.save();
      return userStats;
    } catch (error) {
      console.error('Error saving user stats:', error);
      throw new Error('Failed to save statistics');
    }
  }

  async updateErrorCount(userId, platform, username, errorMessage) {
    try {
      let userStats = await UserStats.findOne({ userId, platform });
      
      if (!userStats) {
        userStats = new UserStats({
          userId,
          platform,
          username,
          stats: {},
          history: []
        });
      }

      userStats.fetchErrors += 1;
      userStats.lastError = errorMessage;
      userStats.lastFetched = new Date();

      await userStats.save();
    } catch (error) {
      console.error('Error updating error count:', error);
    }
  }

  async getUserStats(userId) {
    try {
      const userStats = await UserStats.find({ userId, isActive: true })
        .sort({ platform: 1 })
        .lean();

      // Aggregate stats across platforms
      const aggregated = {
        totalProblems: 0,
        totalEasy: 0,
        totalMedium: 0,
        totalHard: 0,
        totalContests: 0,
        platforms: {}
      };

      userStats.forEach(stat => {
        aggregated.totalProblems += stat.stats.totalSolved || 0;
        aggregated.totalEasy += stat.stats.easySolved || 0;
        aggregated.totalMedium += stat.stats.mediumSolved || 0;
        aggregated.totalHard += stat.stats.hardSolved || 0;
        aggregated.totalContests += stat.stats.contestsParticipated || 0;
        
        aggregated.platforms[stat.platform] = stat;
      });

      return {
        aggregated,
        platforms: userStats,
        lastUpdated: userStats.length > 0 ? 
          Math.max(...userStats.map(s => new Date(s.lastFetched).getTime())) : 
          null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Failed to retrieve statistics');
    }
  }

  async refreshUserStats(userId, platforms) {
    try {
      // Add a small delay to avoid hitting rate limits
      const delayBetweenRequests = 1000; // 1 second
      
      const results = await this.fetchAllUserStats(userId, platforms);
      
      // If we have any successful updates, refresh the aggregated data
      if (results.success.length > 0) {
        const updatedStats = await this.getUserStats(userId);
        return {
          ...results,
          aggregatedStats: updatedStats
        };
      }

      return results;
    } catch (error) {
      console.error('Error refreshing user stats:', error);
      throw new Error('Failed to refresh statistics');
    }
  }

  async cleanupRemovedPlatforms(userId, currentPlatforms) {
    try {
      // Get platforms that have usernames configured
      const activePlatforms = Object.keys(currentPlatforms).filter(platform => 
        currentPlatforms[platform] && currentPlatforms[platform].trim()
      );

      // Find stats for platforms that are no longer active
      const statsToRemove = await UserStats.find({ 
        userId,
        platform: { $nin: activePlatforms }
      });

      if (statsToRemove.length > 0) {
        console.log(`Removing stats for inactive platforms:`, statsToRemove.map(s => s.platform));
        await UserStats.deleteMany({ 
          userId,
          platform: { $nin: activePlatforms }
        });
      }

      return {
        removedPlatforms: statsToRemove.map(s => s.platform),
        remainingPlatforms: activePlatforms
      };
    } catch (error) {
      console.error('Error cleaning up removed platforms:', error);
      throw new Error('Failed to cleanup removed platforms');
    }
  }
}

module.exports = new StatsAggregatorService();
