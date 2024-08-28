import { useState } from 'react';
import './App.css';
import HlsPlyr from './Player/Hls_Plyr';
import HlsPlyrReact from './Player/Hls_PlyrReact';

function App() {
	const videos = [
		{
			title: 'Video 1',
			url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
			poster: 'https://bitdash-a.akamaihd.net/content/sintel/poster.png',
		},
		{
			title: 'Video 2',
			url: '/output/master.m3u8',
			poster: '/poster.webp',
		},
	];

	const [video, setVideo] = useState(videos[0]);

	return (
		<>
			<h1>Video</h1>

			<select
				name=""
				id=""
				onChange={(e) => {
					const index = e.target.selectedIndex;
					setVideo(videos[index]);
				}}
			>
				{videos.map((video, index) => (
					<option key={index} onClick={() => setVideo(video)}>
						{video.title}
					</option>
				))}
			</select>

			<br />
			<br />

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '20px',
				}}
			>
				<div
					style={{
						width: '600px',
					}}
				>
					<h3>Hls.js + Plyr + Auto Quality</h3>
					<HlsPlyr video={video} />
				</div>

				<div
					style={{
						width: '600px',
					}}
				>
					<h3>Hls.js + PlyrReact + Auto Quality</h3>
					<HlsPlyrReact video={video} />
				</div>
			</div>
		</>
	);
}

export default App;
