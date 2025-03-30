import React from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';

interface FlowJsonEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onApply: () => void;
  error: string | null;
  onReset: () => void;
}

/**
 * A component for editing flow JSON with validation and preview support
 */
const FlowJsonEditor: React.FC<FlowJsonEditorProps> = ({
  value,
  onChange,
  onApply,
  error,
  onReset,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Flow JSON</Typography>
        <Typography variant="caption" color="text.secondary">
          Edit the JSON directly to modify the flow diagram. Click "Apply Changes" to update the flow.
        </Typography>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <textarea
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            height: '600px',
            padding: '12px',
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            border: `1px solid ${error ? '#f44336' : '#e0e0e0'}`,
            borderRadius: '4px',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            resize: 'vertical',
            overflow: 'auto',
          }}
          spellCheck="false"
          placeholder="Edit flow JSON here..."
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onReset}
            sx={{ mr: 1 }}
          >
            Reset Changes
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={onApply}
          disabled={!!error}
        >
          Apply Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default FlowJsonEditor; 