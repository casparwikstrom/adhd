import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography } from '@mui/material';

// Relaxing music playlist for breaks
const PLAYLIST_ID = 'PLxtOUC943-Mkqp_BgcOf_bSy7RPA2o6eF';

const YoutubePlayer = ({ duration, onComplete }) => {
  const [player, setPlayer] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  useEffect(() => {
    let timer;
    if (player) {
      // Start countdown timer
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            player.pauseVideo();
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [player, onComplete]);

  const onReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const onEnd = () => {
    setVideoEnded(true);
    if (player) {
      player.playVideoAt(Math.floor(Math.random() * 50)); // Play random video from playlist
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      listType: 'playlist',
      list: PLAYLIST_ID,
      controls: 1,
      rel: 0,
    },
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h3"
        color="primary"
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        {formatTime(timeLeft)}
      </Typography>
      <YouTube
        videoId=""
        opts={opts}
        onReady={onReady}
        onEnd={onEnd}
      />
    </Box>
  );
};

export default YoutubePlayer;
