import axios from 'axios';
import axiosRetry from 'axios-retry';

const defaultRetryConfig = {
	retries: 5,
	initialDelayMs: 100,
};

export default class HttpClient {
	constructor(
		baseURL,
		authErrorEventBus,
		getCsrfToken,
		config = defaultRetryConfig
	) {
		this.authErrorEventBus = authErrorEventBus;
		this.getCsrfToken = getCsrfToken;
		this.client = axios.create({
			baseURL: baseURL,
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		});
		axiosRetry(this.client, {
			// 재시도 할 수 있는 횟수
			retries: 5,
			// 재시도 할 때 delay를 준다
			retryDelay: (retry) => {
				// pow -> 2의 n승으로 만들어줌(시도 할 수록 조금 더 오래 기다림)
				const delay = Math.pow(2, retry) * 100;
				// random -> 시도하는 간격을 일정하지 않게 delay의 0.1이내의 값을 랜덤으로 조금씩 +
				const jitter = delay * 0.1 * Math.random();
				return delay + jitter;
			},
			// 재시도 할 기준
			retryCondition: (err) =>
				// 많이 요청해도 데이터가 바뀌지 않는 get같은 idempotent가 유지되는 요청이거나
				axiosRetry.isNetworkOrIdempotentRequestError(err) ||
				// 너무 많은 req가 왔다고 반응이 있을때
				err.response.status === 429,
		});
	}

	async fetch(url, options) {
		const { body, method, headers } = options;
		const req = {
			url,
			method,
			headers: { ...headers, '_csrf-token': this.getCsrfToken() },
			data: body,
		};

		try {
			const res = await this.client(req);
			return res.data;
		} catch (err) {
			if (err.response) {
				const data = err.response.data;
				const message =
					data && data.message ? data.message : 'Something went wrong!';
				throw new Error(message);
			}
		}
	}
	// axios를 쓰면 자동으로 json변환,에러코드반환을 해준다
}
