import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef } from 'react';

const HlsPlyr = ({ video }) => {
	const videoRef = useRef(null);
	const hlsRef = useRef(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		const hls = Hls.isSupported() ? new Hls() : null;

		if (hls) {
			hls.loadSource(video.url);
			hls.attachMedia(videoElement);

			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				const availableQualities = hls.levels.map((l) => l.height);
				availableQualities.unshift(0); // Add "Auto" option

				const playerOptions = {
					quality: {
						default: 0, // Default - AUTO
						options: availableQualities,
						forced: true,
						onChange: (newQuality) => {
							updateQuality(newQuality);
						},
					},
					i18n: {
						qualityLabel: {
							0: 'Auto',
						},
					},
				};

				new Plyr(videoElement, playerOptions);

				hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
					const span = document.querySelector(
						".plyr__menu__container [data-plyr='quality'][value='0'] span"
					);

					if (hls.autoLevelEnabled) {
						span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
					} else {
						span.innerHTML = `AUTO`;
					}
				});
			});

			hlsRef.current = hls;
		} else {
			new Plyr(videoElement, {});
		}

		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
			}
		};
	}, [video.url]);

	const updateQuality = (newQuality) => {
		const hls = hlsRef.current;
		if (newQuality === 0) {
			hls.currentLevel = -1; // Enable AUTO quality
		} else {
			hls.levels.forEach((level, levelIndex) => {
				if (level.height === newQuality) {
					hls.currentLevel = levelIndex;
				}
			});
		}
	};

	return (
		<video
			style={{
				width: '100%',
				height: 'auto',
			}}
			ref={videoRef}
			controls
			crossOrigin="anonymous"
			poster={video.poster}
		/>
	);
};

export default HlsPlyr;
