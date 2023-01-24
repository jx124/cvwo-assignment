import { PostState } from "../posts/postSlice";

export interface PostRanking {
    post: PostState;
    matchCount: number;
}

function countMatches(posts: PostState[], tokens: string[]) {
    const rankings = [] as PostRanking[];

    for (const post of posts) {
        let matches = 0;

        tokens.forEach((token) => {
            // count number of matches in post values
            matches += JSON.stringify(Object.values(post)).toLowerCase().split(token).length - 1;
        })

        rankings.push({
            post: post,
            matchCount: matches,
        } as PostRanking);
    }

    return rankings;
}

function sortAndFilterPosts(rankings: PostRanking[]) {
    const filtered = rankings.filter((item) => item.matchCount !== 0);

    // sort posts from most matches to least
    return filtered.sort((a, b) => b.matchCount - a.matchCount)
}

export function getSearchResults(posts: PostState[], tokens: string[]): PostState[] {
    if (tokens.length === 1 && tokens[0] === "") {
        // skip search: nothing entered into search bar
        return posts;
    }
    const matches = countMatches(posts, tokens);
    const sorted = sortAndFilterPosts(matches);

    // remove matchCount and convert to PostState[]
    return sorted.map((rank) => rank.post);
}