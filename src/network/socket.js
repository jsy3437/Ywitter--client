import socket from 'socket.io-client';

export default class Socket {
	// baseURL, token을 받을수 있는 콜백함수를 받아서
	// socket을 만들때 사용
	constructor(baseURL, getAccessToken) {
		this.io = socket(baseURL, {
			// token은 꼭 auth를 이용해서 받아와야함
			// 만약 쿼리로 받아오게 되면 토큰이 노출됨
			auth: (cb) => cb({ token: getAccessToken() }),
		});

		// socket을 만들때 에러발생시 처리해주는 코드
		this.io.on('connect_error', (err) => {
			console.log('socket error', err.message);
		});
	}

	// onSync(어떤 주제를 들을지, 어떤 행동을 할지)
	onSync(event, callback) {
		//  io가 연결되지 않았다면 연결먼저 하고 io가 연결되어있다면 연결은 스킵한다
		if (!this.io.connected) {
			this.io.connect();
		}

		// 듣고 있는 주제의 이벤트가 발생하면 해당이벤트의 행동을 호출해준다
		this.io.on(event, (message) => callback(message));
		//  io의 이벤트를 더이상 듣지 않도록 끌수 있는 함수를 전달해준다
		return () => this.io.off(event);
	}
}

// node강의완주, 포트포어딩해서 외부에서 접속가능한 서버만들기 ,마리아db , mysql워크벤치로 해당db에 접근 할 수 있게 만들어야함, ssh 키로 접속가능하게, user기능을 가지고 있는 포트폴리오 만들기 , 게시판(제목 내용 사진첨부2개 본일일시수정삭제가능 게시글 목록12개씩여러페이지 디테일페이지), 관리자페이지(유저목록 유저삭제 게시글삭제수정 이미지다운로드 게시글 순서바꾸기) 이페이지들을 배포,도메인연결하고 엔진엑스를 통해야함
