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

const WORK_TIME = 5; // 5 seconds for testing
const BASE_BREAK_TIME = 5; // 5 seconds for testing

function App() {
  const [isBreak, setIsBreak] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [accumulatedBreakTime, setAccumulatedBreakTime] = useState(BASE_BREAK_TIME);
  const [showReward, setShowReward] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);


  useEffect(() => {
    // Listen for Git commit events from the main process
    if (window.electron?.receive) {
      // Manually trigger the git-commit event
      debugger;

      window.electron.receive('git-commit', {
        hash: '123abc',
        message: 'Test commit',
        author: 'Test User',
        date: new Date().toISOString()
      });
    } else {
      console.log('Electron receive not available');
    }
  }, []);

  const handleWorkComplete = () => {
    sounds.complete.play();
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      setShowBreakPrompt(true);
    }, 3000);
  };

  const handleBreakChoice = (takeBreak) => {
    setShowBreakPrompt(false);
    if (takeBreak) {
      setIsBreak(true);
      sounds.questComplete.play();
    } else {
      setAccumulatedBreakTime(accumulatedBreakTime + BASE_BREAK_TIME);
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
            setCompletedSessions={setCompletedSessions}
            workTime={WORK_TIME}
            baseBreakTime={BASE_BREAK_TIME}
          />

          {showBreakPrompt && (
            <BreakPrompt onChoice={handleBreakChoice} />
          )}

          {isBreak && (
            <YoutubePlayer
              duration={accumulatedBreakTime}
              onComplete={() => {
                setIsBreak(false);
                setAccumulatedBreakTime(BASE_BREAK_TIME);
              }}
              onStartWork={() => {
                setIsBreak(false);
                setShowBreakPrompt(false);
              }}
            />
          )}

          {showReward && <RewardAnimation />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
