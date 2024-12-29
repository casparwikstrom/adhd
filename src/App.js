import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Timer from './components/Timer';
import BreakPrompt from './components/BreakPrompt';
import YoutubePlayer from './components/YoutubePlayer';
import RewardAnimation from './components/RewardAnimation';
import { Howl } from 'howler';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const sounds = {
  complete: new Howl({
    src: ['/sounds/complete.wav'],
  }),
  questComplete: new Howl({
    src: ['/sounds/quest-complete.wav'],
  }),
};

function App() {
  const [isBreak, setIsBreak] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [accumulatedBreakTime, setAccumulatedBreakTime] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    // Listen for Git commit events from the main process
    window.electron?.receive('git-commit', () => {
      setShowReward(true);
      sounds.complete.play();
      setTimeout(() => setShowReward(false), 3000);
    });
  }, []);

  const handleWorkComplete = () => {
    sounds.complete.play();
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      setShowBreakPrompt(true);
    }, 3000);
    setCompletedSessions(prev => prev + 1);
  };

  const handleBreakChoice = (takeBreak) => {
    setShowBreakPrompt(false);
    if (takeBreak) {
      setIsBreak(true);
      sounds.questComplete.play();
    } else {
      const currentBreakTime = completedSessions % 4 === 0 ? 10 : 5;
      setAccumulatedBreakTime(prev => prev + currentBreakTime);
      sounds.questComplete.play();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Timer
            onWorkComplete={handleWorkComplete}
            isBreak={isBreak}
            setIsBreak={setIsBreak}
            accumulatedBreakTime={accumulatedBreakTime}
            setAccumulatedBreakTime={setAccumulatedBreakTime}
            completedSessions={completedSessions}
          />

          {showBreakPrompt && (
            <BreakPrompt onChoice={handleBreakChoice} />
          )}

          {isBreak && (
            <YoutubePlayer
              duration={completedSessions % 4 === 0 ? 10 : 5}
              onComplete={() => setIsBreak(false)}
            />
          )}

          {showReward && <RewardAnimation />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
