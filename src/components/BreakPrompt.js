import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const BreakPrompt = ({ onChoice }) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Time for a Break Decision!
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
          Do you want to take a break now or add the break time to the next one and keep working?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onChoice(true)}
          sx={{ mr: 2 }}
        >
          Take Break Now
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => onChoice(false)}
        >
          Keep Working
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BreakPrompt;
