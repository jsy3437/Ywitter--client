export default class TweetService {
	constructor(http, tokenStorage) {
		this.http = http;
	}

	async getTweets(username) {
		const query = username ? `?username=${username}` : '';
		return this.http.fetch(`/tweets${query}`, {
			method: 'GET',
		});
	}

	async postTweet(text) {
		return this.http.fetch(`/tweets`, {
			method: 'POST',
			body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
		});
	}

	async deleteTweet(tweetId) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'DELETE',
		});
	}

	async updateTweet(tweetId, text) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'PUT',
			body: JSON.stringify({ text }),
		});
	}

	// onSync(새로운 트윗이 생겼을때 어떤일을 하고 싶은지)를 계속 듣고있음
	onSync(callback) {
		return this.socket.onSync('tweets', callback);
	}
}
