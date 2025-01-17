import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const TimerDisplay = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const BASE_BREAK_TIME = 5; // 5 seconds for testing

const Timer = ({
  onWorkComplete,
  isBreak,
  setIsBreak,
  accumulatedBreakTime,
  setAccumulatedBreakTime,
  completedSessions,
  setCompletedSessions,
  onToggleTimer,
  workTime
}) => {
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);

  const getInitialTime = useCallback(() => {
    if (isBreak) {
      return accumulatedBreakTime;
    }
    return workTime;
  }, [isBreak, workTime, accumulatedBreakTime]);

  // Reset timer when switching between work and break
  useEffect(() => {
    setTimeLeft(getInitialTime());
    setProgress(100);
    setIsActive(false);
  }, [isBreak, getInitialTime]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          const totalTime = getInitialTime();
          setProgress((newTime / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
        onWorkComplete();
      } else {
        setIsBreak(false);

      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, onWorkComplete, setIsBreak, getInitialTime, setAccumulatedBreakTime, setCompletedSessions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    // Reset timer state
    setIsActive(false);
    setTimeLeft(getInitialTime());
    setProgress(100);

    // Reset app state
    setIsBreak(false);
    setAccumulatedBreakTime(BASE_BREAK_TIME);
    setCompletedSessions(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <Typography variant="h6" color="textSecondary">
        {isBreak ? 'Break Time' : 'Work Time'}
      </Typography>

      <TimerDisplay>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={200}
          thickness={2}
          sx={{
            color: isBreak ? 'secondary.main' : 'primary.main',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" component="div" color="text.primary">
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </TimerDisplay>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color={isBreak ? 'secondary' : 'primary'}
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          color={isBreak ? 'secondary' : 'primary'}
          onClick={resetTimer}
        >
          Reset
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary">
        Sessions completed: {completedSessions}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Accumulated Break Time: {accumulatedBreakTime}
      </Typography>
    </TimerContainer>
  );
};

export default Timer;
