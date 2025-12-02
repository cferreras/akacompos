interface CommitCache {
    hash: string;
    timestamp: number;
}

let cache: CommitCache | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getLatestCommit(): Promise<string> {
    const now = Date.now();

    // Return cached value if valid
    if (cache && (now - cache.timestamp < CACHE_TTL)) {
        console.log('Returning cached commit hash:', cache.hash);
        return cache.hash;
    }

    try {
        console.log('Fetching latest commit from GitHub API...');
        const response = await fetch('https://api.github.com/repos/cferreras/akacompos/commits/master', {
            headers: {
                'User-Agent': 'Astro-App',
                'Accept': 'application/vnd.github.sha'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const hash = await response.text();
        const shortHash = hash.substring(0, 7);

        // Update cache
        cache = {
            hash: shortHash,
            timestamp: now
        };

        return shortHash;
    } catch (error) {
        console.error('Error fetching commit from GitHub:', error);

        // Fallback to build-time env var or return cached value even if expired (stale-while-revalidate strategy could be better but simple fallback is fine here)
        // If we have an expired cache, we might want to return it instead of "unknown", but for now let's stick to the plan.
        // Actually, let's try to return the expired cache if it exists, otherwise fallback to env or "unknown"
        if (cache) {
            console.log('Returning expired cached commit hash due to error');
            return cache.hash;
        }

        return import.meta.env.GIT_COMMIT_HASH || "unknown";
    }
}
