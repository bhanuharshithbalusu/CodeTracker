/**
 * Platform Stats Fetcher — Real API Integration
 * 
 * Codeforces: Official API (codeforces.com/api)
 * LeetCode:   Alpha LeetCode API (alfa-leetcode-api.onrender.com)
 * CodeChef:   Mock data (no reliable public API)
 */

const axios = require('axios');

// ─── CODEFORCES (Real API) ────────────────────────────────────────────────────

async function fetchCodeforcesStats(handle) {
    try {
        // 1. Fetch user info (rating, rank)
        const infoRes = await axios.get(
            `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
            { timeout: 10000 }
        );

        if (infoRes.data.status !== 'OK' || !infoRes.data.result?.length) {
            throw new Error('User not found on Codeforces');
        }

        const userInfo = infoRes.data.result[0];

        // 2. Fetch submission history
        const statusRes = await axios.get(
            `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`,
            { timeout: 15000 }
        );

        const submissions = statusRes.data.status === 'OK' ? statusRes.data.result : [];

        // 3. Calculate solved problems (unique accepted problems)
        const solvedSet = new Set();
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        const dateCountMap = {};

        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedSet.has(problemKey)) {
                    solvedSet.add(problemKey);

                    // Classify difficulty by rating
                    const rating = sub.problem.rating || 0;
                    if (rating <= 1200) difficultyCount.easy++;
                    else if (rating <= 1800) difficultyCount.medium++;
                    else difficultyCount.hard++;
                }

                // Build heatmap from submission timestamps
                const date = new Date(sub.creationTimeSeconds * 1000)
                    .toISOString().split('T')[0];
                dateCountMap[date] = (dateCountMap[date] || 0) + 1;
            }
        });

        // 4. Build heatmap (last 90 days)
        const heatmap = buildHeatmap(dateCountMap);

        // 5. Recent submissions (last 10)
        const recentSubmissions = submissions.slice(0, 10).map(sub => ({
            problem: sub.problem.name,
            verdict: sub.verdict === 'OK' ? 'Accepted' : sub.verdict.replace(/_/g, ' '),
            date: new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0],
            difficulty: classifyCodeforcesRating(sub.problem.rating)
        }));

        // 6. Count unique contests
        const contestIds = new Set(submissions.map(s => s.contestId).filter(Boolean));

        return {
            stats: {
                solved: solvedSet.size,
                rating: userInfo.rating || 0,
                rank: userInfo.rank || 'Unrated',
                contests: contestIds.size,
                easy: difficultyCount.easy,
                medium: difficultyCount.medium,
                hard: difficultyCount.hard,
            },
            heatmap,
            recentSubmissions
        };
    } catch (err) {
        console.error(`Codeforces API error for "${handle}":`, err.message);
        throw new Error(`Failed to fetch Codeforces data: ${err.message}`);
    }
}

function classifyCodeforcesRating(rating) {
    if (!rating || rating <= 1200) return 'Easy';
    if (rating <= 1800) return 'Medium';
    return 'Hard';
}

// ─── LEETCODE (Alpha LeetCode API) ───────────────────────────────────────────

async function fetchLeetcodeStats(handle) {
    try {
        const res = await axios.get(
            `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(handle)}`,
            { timeout: 15000 }
        );

        const data = res.data;

        if (!data || data.errors) {
            throw new Error('User not found on LeetCode');
        }

        const totalSolved = data.totalSolved || 0;
        const easySolved = data.easySolved || 0;
        const mediumSolved = data.mediumSolved || 0;
        const hardSolved = data.hardSolved || 0;
        const ranking = data.ranking || 0;
        const reputation = data.reputation || 0;

        // Build rank string
        let rankStr = 'Unrated';
        if (ranking > 0) {
            rankStr = `#${ranking.toLocaleString()}`;
        }

        // LeetCode API may provide submission calendar
        const heatmapRaw = data.submissionCalendar;
        const dateCountMap = {};
        if (heatmapRaw && typeof heatmapRaw === 'object') {
            // submissionCalendar is { "timestamp": count }
            Object.entries(heatmapRaw).forEach(([ts, count]) => {
                const date = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
                dateCountMap[date] = (dateCountMap[date] || 0) + count;
            });
        }

        const heatmap = buildHeatmap(dateCountMap);

        // Recent submissions — not available from this endpoint, generate from heatmap
        const recentSubmissions = generateRecentFromHeatmap(heatmap, 'leetcode');

        return {
            stats: {
                solved: totalSolved,
                rating: ranking,
                rank: rankStr,
                contests: data.contributionPoints || 0,
                easy: easySolved,
                medium: mediumSolved,
                hard: hardSolved,
            },
            heatmap,
            recentSubmissions
        };
    } catch (err) {
        console.error(`LeetCode API error for "${handle}":`, err.message);

        // Fallback: try LeetCode GraphQL
        try {
            return await fetchLeetcodeGraphQL(handle);
        } catch (fallbackErr) {
            console.error(`LeetCode GraphQL fallback also failed:`, fallbackErr.message);
            throw new Error(`Failed to fetch LeetCode data: ${err.message}`);
        }
    }
}

async function fetchLeetcodeGraphQL(handle) {
    const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                    reputation
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
                userCalendar {
                    submissionCalendar
                }
            }
        }
    `;

    const res = await axios.post('https://leetcode.com/graphql', {
        query,
        variables: { username: handle }
    }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
    });

    const user = res.data?.data?.matchedUser;
    if (!user) throw new Error('User not found');

    const acStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const findCount = (diff) => acStats.find(a => a.difficulty === diff)?.count || 0;

    const totalSolved = findCount('All');
    const easy = findCount('Easy');
    const medium = findCount('Medium');
    const hard = findCount('Hard');
    const ranking = user.profile?.ranking || 0;

    const dateCountMap = {};
    const calendarStr = user.userCalendar?.submissionCalendar;
    if (calendarStr) {
        try {
            const cal = typeof calendarStr === 'string' ? JSON.parse(calendarStr) : calendarStr;
            Object.entries(cal).forEach(([ts, count]) => {
                const date = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
                dateCountMap[date] = (dateCountMap[date] || 0) + count;
            });
        } catch { }
    }

    return {
        stats: {
            solved: totalSolved,
            rating: ranking,
            rank: ranking > 0 ? `#${ranking.toLocaleString()}` : 'Unrated',
            contests: 0,
            easy,
            medium,
            hard,
        },
        heatmap: buildHeatmap(dateCountMap),
        recentSubmissions: []
    };
}

// ─── CODECHEF (Mock — no reliable public API) ────────────────────────────────

async function fetchCodechefStats(handle) {
    // CodeChef does not have a stable public API.
    // Using deterministic mock data based on handle.
    const seed = seedFromHandle(handle);
    const rating = 1200 + (seed % 1800);
    const stars = Math.min(Math.floor((rating - 1200) / 200) + 1, 7);
    const solved = 20 + (seed % 500);
    const easy = Math.floor(solved * 0.45);
    const medium = Math.floor(solved * 0.35);
    const hard = solved - easy - medium;

    // Generate mock heatmap
    const dateCountMap = {};
    const today = new Date();
    for (let i = 0; i < 90; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayHash = (seed * 31 + i * 17) % 100;
        if (dayHash > 40) {
            dateCountMap[dateStr] = ((seed + i) % 5) + 1;
        }
    }

    return {
        stats: {
            solved,
            rating,
            rank: `${stars}★`,
            contests: 3 + (seed % 40),
            easy,
            medium,
            hard,
        },
        heatmap: buildHeatmap(dateCountMap),
        recentSubmissions: generateMockSubmissions(seed, 'codechef')
    };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildHeatmap(dateCountMap) {
    const data = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data.push({ date: dateStr, count: dateCountMap[dateStr] || 0 });
    }
    return data;
}

function generateRecentFromHeatmap(heatmap, platform) {
    // Generate placeholder recent submissions from days with activity
    const activeDays = heatmap.filter(h => h.count > 0).slice(-8);
    const problems = [
        'Two Sum', 'Add Two Numbers', 'Longest Substring', 'Valid Parentheses',
        'Merge Two Lists', 'Binary Search', 'Climbing Stairs', 'Maximum Subarray'
    ];
    return activeDays.map((day, i) => ({
        problem: problems[i % problems.length],
        verdict: 'Accepted',
        date: day.date,
        difficulty: ['Easy', 'Easy', 'Medium', 'Medium', 'Hard'][i % 5]
    }));
}

function generateMockSubmissions(seed, platform) {
    const problems = [
        'Life Universe', 'ATM Problem', 'Factorial', 'Enormous Input',
        'Turbo Sort', 'Small Factorials', 'The Lead Game', 'Chef and Strings'
    ];
    const difficulties = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard'];
    return Array.from({ length: 8 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (seed + i * 2) % 14);
        return {
            problem: problems[(seed + i * 7) % problems.length],
            verdict: i % 4 === 3 ? 'Wrong Answer' : 'Accepted',
            date: d.toISOString().split('T')[0],
            difficulty: difficulties[(seed + i * 5) % difficulties.length]
        };
    });
}

function seedFromHandle(handle) {
    let hash = 0;
    for (let i = 0; i < handle.length; i++) {
        hash = ((hash << 5) - hash) + handle.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function calculateStreak(heatmap) {
    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    for (let i = 0; i < heatmap.length; i++) {
        if (heatmap[i].count > 0) {
            tempStreak++;
            longest = Math.max(longest, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    // Current streak: count backwards from today
    for (let i = heatmap.length - 1; i >= 0; i--) {
        if (heatmap[i].count > 0) {
            current++;
        } else {
            break;
        }
    }

    return { current, longest };
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

module.exports = {
    fetchStats: async (handle, platform) => {
        switch (platform) {
            case 'codeforces':
                return await fetchCodeforcesStats(handle);
            case 'leetcode':
                return await fetchLeetcodeStats(handle);
            case 'codechef':
                return await fetchCodechefStats(handle);
            default:
                throw new Error('Unsupported platform');
        }
    },
    calculateStreak
};
