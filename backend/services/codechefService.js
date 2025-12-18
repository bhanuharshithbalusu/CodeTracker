const axios = require('axios');

class CodeChefService {
  constructor() {
    this.baseURL = 'https://www.codechef.com/api/rankings/PRACTICE';
  }

  async fetchUserStats(username) {
    try {
      // CodeChef doesn't have a public official API for user stats
      // We'll simulate/mock the data for now, but in production you'd need:
      // 1. Web scraping (not recommended due to rate limits)
      // 2. Official API access (requires approval)
      // 3. User manual input

      // For demo purposes, we'll return mock data
      // In real implementation, you would scrape or use official API
      return this.getMockStats(username);
    } catch (error) {
      console.error(`CodeChef API error for ${username}:`, error.message);
      throw new Error(`Failed to fetch CodeChef stats: ${error.message}`);
    }
  }

  getMockStats(username) {
    // Mock data for demonstration
    // In production, replace with actual API calls or scraping
    const mockData = {
      platform: 'codechef',
      username,
      totalSolved: Math.floor(Math.random() * 200) + 50,
      easySolved: Math.floor(Math.random() * 80) + 20,
      mediumSolved: Math.floor(Math.random() * 60) + 15,
      hardSolved: Math.floor(Math.random() * 30) + 5,
      rating: Math.floor(Math.random() * 1000) + 1200,
      maxRating: Math.floor(Math.random() * 1200) + 1400,
      rank: Math.floor(Math.random() * 10000) + 1000,
      contestsParticipated: Math.floor(Math.random() * 50) + 5,
      streak: Math.floor(Math.random() * 30)
    };

    return mockData;
  }

  async fetchUserStatsFromProfile(username) {
    // Alternative approach: Try to get basic info from public profile
    try {
      const response = await axios.get(`https://www.codechef.com/users/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      // Parse HTML response (basic implementation)
      const html = response.data;
      
      // Extract basic info using regex (not robust, but works for demo)
      const ratingMatch = html.match(/rating['"]\s*:\s*(\d+)/i);
      const solvedMatch = html.match(/problems[^>]*solved[^>]*>(\d+)/i);
      
      return {
        platform: 'codechef',
        username,
        totalSolved: solvedMatch ? parseInt(solvedMatch[1]) : 0,
        easySolved: 0, // Would need more detailed parsing
        mediumSolved: 0,
        hardSolved: 0,
        rating: ratingMatch ? parseInt(ratingMatch[1]) : 0,
        maxRating: ratingMatch ? parseInt(ratingMatch[1]) : 0,
        rank: 0,
        contestsParticipated: 0,
        streak: 0
      };
    } catch (error) {
      console.log(`Could not fetch CodeChef profile for ${username}, using mock data`);
      return this.getMockStats(username);
    }
  }

  async fetchRecentActivity(username) {
    // Mock recent activity
    return [
      {
        problemName: 'Chef and Numbers',
        contestId: 'PRACTICE',
        timestamp: Date.now() - 86400000,
        difficulty: 'Easy'
      },
      {
        problemName: 'Maximum Subarray',
        contestId: 'LONG',
        timestamp: Date.now() - 172800000,
        difficulty: 'Medium'
      }
    ];
  }
}

module.exports = new CodeChefService();
