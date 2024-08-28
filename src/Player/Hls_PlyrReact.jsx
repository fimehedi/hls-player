import Hls from 'hls.js';
import { usePlyr } from 'plyr-react';
import 'plyr-react/plyr.css';
import * as React from 'react';

const videoOptions = null;
const videoSource = null;

const useHls = (src, options) => {
	const hls = React.useRef(new Hls());
	const hasQuality = React.useRef(false);
	const [plyrOptions, setPlyrOptions] = React.useState(options);

	React.useEffect(() => {
		hasQuality.current = false;
	}, [options]);

	React.useEffect(() => {
		hls.current.loadSource(src);
		hls.current.attachMedia(document.querySelector('.plyr-react'));
		hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
			if (hasQuality.current) return;

			const levels = hls.current.levels;
			const availableQualities = levels.map((level) => level.height);
			availableQualities.unshift(0);

			const quality = {
				default: 0,
				options: availableQualities,
				forced: true,
				onChange: (newQuality) => {
					if (newQuality === 0) {
						hls.current.currentLevel = -1;
					} else {
						levels.forEach((level, levelIndex) => {
							if (level.height === newQuality) {
								hls.current.currentLevel = levelIndex;
							}
						});
					}

					// levels.forEach((level, levelIndex) => {
					// 	if (level.height === newQuality) {
					// 		hls.current.currentLevel = levelIndex;
					// 	}
					// });
				},
			};
			setPlyrOptions({
				...plyrOptions,
				quality,
				i18n: { qualityLabel: { 0: 'Auto' } },
			});
			hasQuality.current = true;
		});

		const onLevelSwitched = (event, data) => {
			const span = document.querySelector(
				".plyr__menu__container [data-plyr='quality'] span"
			);

			if (hls.current.autoLevelEnabled) {
				span.innerHTML = `Auto (${hls.current.levels[data.level].height}p)`;
			} else {
				span.innerHTML = 'Auto';
			}
		};

		hls.current.on(Hls.Events.LEVEL_SWITCHED, onLevelSwitched);

		// return () => {
		//   hls.current.off(Hls.Events.LEVEL_SWITCHED, onLevelSwitched);
		// 	hls.current.destroy();
		// };
	});

	return { options: plyrOptions };
};

const CustomPlyrInstance = React.forwardRef((props, ref) => {
	const { source, options = null, hlsSource, poster } = props;
	const raptorRef = usePlyr(ref, {
		...useHls(hlsSource, options),
		source,
	});
	return (
		<video
			ref={raptorRef}
			className="plyr-react plyr"
			controls
			crossOrigin
			poster={poster}
			style={{
				width: '100%',
				height: 'auto',
			}}
		/>
	);
});

const HlsPlyrReact = ({ video }) => {
	const ref = React.useRef(null);
	const supported = Hls.isSupported();

	return (
		<div className="wrapper">
			{supported ? (
				<CustomPlyrInstance
					ref={ref}
					source={videoSource}
					options={videoOptions}
					hlsSource={video.url}
					poster={video.poster}
				/>
			) : (
				'HLS is not supported in your browser'
			)}
		</div>
	);
};

export default HlsPlyrReact;
