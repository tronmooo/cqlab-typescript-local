import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { validateFlowJson } from './JsonValidator';

interface SimpleJsonEditorProps {
  initialValue: string;
  onApplyChanges: (value: string) => void;
  error: string | null;
  height?: string | number;
  autoApply?: boolean;
}

/**
 * A simple reliable JSON editor that uses direct DOM manipulation
 * to avoid React controlled component issues
 */
const SimpleJsonEditor: React.FC<SimpleJsonEditorProps> = ({
  initialValue,
  onApplyChanges,
  error: externalError,
  height = '600px',
  autoApply = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [textChanged, setTextChanged] = useState(false);
  
  // Combined error from props and local validation
  const error = externalError || localError;
  
  // Update the textarea value when initialValue changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = initialValue;
      setLocalError(null);
      setTextChanged(false);
    }
  }, [initialValue]);

  // Handler for Apply button
  const handleApply = () => {
    if (textareaRef.current) {
      try {
        // Get the current text
        const value = textareaRef.current.value;
        
        // Format the JSON for better readability (helps catch syntax errors)
        const parsedJson = JSON.parse(value);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        textareaRef.current.value = formattedJson;
        
        // Validate before applying
        const validationError = validateFlowJson(formattedJson);
        if (validationError) {
          setLocalError(validationError);
          return;
        }
        
        // Apply changes and reset state
        onApplyChanges(formattedJson);
        setLocalError(null);
        setTextChanged(false);
      } catch (err) {
        setLocalError(err instanceof Error ? `JSON Error: ${err.message}` : 'Invalid JSON format');
      }
    }
  };

  // Handler for Reset button
  const handleReset = () => {
    if (textareaRef.current) {
      textareaRef.current.value = initialValue;
      setLocalError(null);
      setTextChanged(false);
    }
  };
  
  // Handler for text changes
  const handleTextChange = () => {
    if (!textChanged) {
      setTextChanged(true);
    }
    
    // Clear error when typing
    if (localError) {
      setLocalError(null);
    }
    
    // Apply changes immediately if autoApply is true
    if (autoApply && textareaRef.current) {
      try {
        const value = textareaRef.current.value;
        JSON.parse(value); // Just check if it's valid JSON
        
        // Apply changes without formatting (to avoid cursor position issues during typing)
        const validationError = validateFlowJson(value);
        if (!validationError) {
          onApplyChanges(value);
        } else {
          setLocalError(null); // Don't show validation errors immediately while typing in autoApply mode
        }
      } catch (err) {
        // Don't show parsing errors immediately while typing in autoApply mode
      }
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%', overflow: 'auto' }} className="SimpleJsonEditor">
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Flow JSON</Typography>
        <Typography variant="caption" color="text.secondary">
          Edit the JSON directly to modify the flow diagram. {!autoApply && "Click \"Apply Changes\" to update the flow."}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className="SimpleJsonEditor-textarea"
          defaultValue={initialValue}
          onChange={handleTextChange}
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
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
      {!autoApply && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ mr: 1 }}
            >
              Reset Changes
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={!!error}
          >
            Apply Changes
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default SimpleJsonEditor; 