export default class HttpClient {
	constructor(baseURL, authErrorEventBus) {
		this.baseURL = baseURL;
		this.authErrorEventBus = authErrorEventBus;
	}

	async fetch(url, options) {
		const res = await fetch(`${this.baseURL}${url}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			// 브라우저가 httpOnly에 있는 것을 자동으로 읽어서 넣어주는 옵션
			credentials: 'include',
		});
		let data;
		try {
			data = await res.json();
		} catch (error) {
			console.error(error);
		}

		if (res.status > 299 || res.status < 200) {
			const message =
				data && data.message ? data.message : 'Something went wrong! 🤪';
			const error = new Error(message);
			if (res.status === 401) {
				this.authErrorEventBus.notify(error);
				return;
			}
			throw error;
		}
		return data;
	}
}
