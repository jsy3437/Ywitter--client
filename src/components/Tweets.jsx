import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';
import { useAuth } from '../context/AuthContext';

const Tweets = memo(({ tweetService, username, addable }) => {
	const [tweets, setTweets] = useState([]);
	const [error, setError] = useState('');
	const history = useHistory();
	const { user } = useAuth();

	useEffect(() => {
		// 전체적인 트윗을 받아온뒤
		tweetService
			.getTweets(username)
			.then((tweets) => setTweets([...tweets]))
			.catch(onError);

		// onSync 함수를 통해서 새로운 트윗이 생기면 새로운 트윗을 만들어준다
		const stopSync = tweetService.onSync((tweet) => onCreated(tweet));
		// 컴포넌트가 끝나면 더이상 듣고 싶지 않으므로 멈추는 콜백함수를 호출해준다
		return () => stopSync();
		//
	}, [tweetService, username, user]);

	const onCreated = (tweet) => {
		setTweets((tweets) => [tweet, ...tweets]);
	};

	const onDelete = (tweetId) =>
		tweetService
			.deleteTweet(tweetId)
			.then(() =>
				setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId))
			)
			.catch((error) => setError(error.toString()));

	const onUpdate = (tweetId, text) =>
		tweetService
			.updateTweet(tweetId, text)
			.then((updated) =>
				setTweets((tweets) =>
					tweets.map((item) => (item.id === updated.id ? updated : item))
				)
			)
			.catch((error) => error.toString());

	const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

	const onError = (error) => {
		setError(error.toString());
		setTimeout(() => {
			setError('');
		}, 3000);
	};

	return (
		<>
			{addable && (
				<NewTweetForm
					tweetService={tweetService}
					onError={onError}
					onCreated={onCreated}
				/>
			)}
			{error && <Banner text={error} isAlert={true} transient={true} />}
			{tweets.length === 0 && <p className="tweets-empty">No Tweets Yet</p>}
			<ul className="tweets">
				{tweets.map((tweet) => (
					<TweetCard
						key={tweet.id}
						tweet={tweet}
						owner={tweet.username === user.username}
						onDelete={onDelete}
						onUpdate={onUpdate}
						onUsernameClick={onUsernameClick}
					/>
				))}
			</ul>
		</>
	);
});
export default Tweets;
