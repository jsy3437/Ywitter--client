import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, fetchToken } from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import Socket from './network/socket';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL, authErrorEventBus);
const authService = new AuthService(httpClient);

// socket을 담당하는 파일을 만들어서 tweetService에 전달해준다
// 업데이트된 최근의 토큰을 받아갈 수 있도록 storage에 있는 getToken을 읽어 갈 수 있는 콜백함수를 전달해준다
const socketClient = new Socket(baseURL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider
				authService={authService}
				authErrorEventBus={authErrorEventBus}
			>
				<App tweetService={tweetService} />
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
