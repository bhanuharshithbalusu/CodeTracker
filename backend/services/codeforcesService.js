const axios = require('axios');

class CodeforcesService {
  constructor() {
    this.baseURL = 'https://codeforces.com/api';
  }

  async fetchUserStats(username) {
    try {
      // Get user info
      const userResponse = await axios.get(`${this.baseURL}/user.info`, {
        params: { handles: username },
        timeout: 10000
      });

      if (userResponse.data.status !== 'OK') {
        throw new Error('User not found');
      }

      const userData = userResponse.data.result[0];

      // Get user submissions
      const submissionsResponse = await axios.get(`${this.baseURL}/user.status`, {
        params: { 
          handle: username,
          from: 1,
          count: 10000 // Get recent submissions
        },
        timeout: 15000
      });

      let submissions = [];
      if (submissionsResponse.data.status === 'OK') {
        submissions = submissionsResponse.data.result;
      }

      // Count solved problems by difficulty
      const solvedProblems = new Set();
      const difficultyCount = {
        easy: 0,
        medium: 0,
        hard: 0
      };

      submissions.forEach(submission => {
        if (submission.verdict === 'OK') {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          if (!solvedProblems.has(problemId)) {
            solvedProblems.add(problemId);
            
            // Categorize by rating (Codeforces uses rating instead of difficulty)
            const rating = submission.problem.rating || 0;
            if (rating <= 1200) {
              difficultyCount.easy++;
            } else if (rating <= 1600) {
              difficultyCount.medium++;
            } else {
              difficultyCount.hard++;
            }
          }
        }
      });

      // Get contest participation
      let contestsParticipated = 0;
      try {
        const ratingResponse = await axios.get(`${this.baseURL}/user.rating`, {
          params: { handle: username },
          timeout: 10000
        });
        
        if (ratingResponse.data.status === 'OK') {
          contestsParticipated = ratingResponse.data.result.length;
        }
      } catch (error) {
        // User might not have participated in contests
        console.log(`No contest data for ${username}`);
      }

      return {
        platform: 'codeforces',
        username: userData.handle,
        totalSolved: solvedProblems.size,
        easySolved: difficultyCount.easy,
        mediumSolved: difficultyCount.medium,
        hardSolved: difficultyCount.hard,
        rating: userData.rating || 0,
        maxRating: userData.maxRating || 0,
        rank: userData.rank || 'unrated',
        contestsParticipated,
        streak: 0 // Would need to calculate from submissions
      };
    } catch (error) {
      console.error(`Codeforces API error for ${username}:`, error.message);
      throw new Error(`Failed to fetch Codeforces stats: ${error.message}`);
    }
  }

  async fetchRecentActivity(username) {
    try {
      const response = await axios.get(`${this.baseURL}/user.status`, {
        params: { 
          handle: username,
          from: 1,
          count: 20
        },
        timeout: 10000
      });

      if (response.data.status !== 'OK') {
        return [];
      }

      return response.data.result
        .filter(submission => submission.verdict === 'OK')
        .slice(0, 10)
        .map(submission => ({
          problemName: submission.problem.name,
          contestId: submission.problem.contestId,
          timestamp: submission.creationTimeSeconds * 1000,
          rating: submission.problem.rating || 0
        }));
    } catch (error) {
      console.error(`Codeforces activity error for ${username}:`, error.message);
      return [];
    }
  }
}

module.exports = new CodeforcesService();
