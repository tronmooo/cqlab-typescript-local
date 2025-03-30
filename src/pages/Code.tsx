import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LinkIcon from '@mui/icons-material/Link';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CloseIcon from '@mui/icons-material/Close';
import * as monacoEditor from 'monaco-editor';

const CodeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto'
}));

const OutputContainer = styled(Box)(({ theme }) => ({
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: 1.5,
    padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  height: '200px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  border: `1px solid ${theme.palette.divider}`
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`code-tabpanel-${index}`}
      aria-labelledby={`code-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface ConsoleOutput {
  type: 'log' | 'error' | 'info' | 'warn';
  content: string;
  timestamp: Date;
}

interface TypeScriptWorker {
  getEmitOutput(uri: string): Promise<any>;
  getSemanticDiagnostics(uri: string): Promise<any>;
  getSyntacticDiagnostics(uri: string): Promise<any>;
}

// TypeScript versions
const TS_VERSIONS = [
  { version: 'Latest', value: 'latest' },
  { version: '5.0.4', value: '5.0.4' },
  { version: '4.9.5', value: '4.9.5' },
  { version: '4.8.4', value: '4.8.4' },
  { version: '4.7.4', value: '4.7.4' },
  { version: '4.6.4', value: '4.6.4' },
  { version: '4.5.5', value: '4.5.5' },
  { version: '4.4.4', value: '4.4.4' },
  { version: '4.3.5', value: '4.3.5' },
  { version: '4.2.4', value: '4.2.4' },
  { version: '4.1.5', value: '4.1.5' },
  { version: '4.0.8', value: '4.0.8' },
  { version: '3.9.10', value: '3.9.10' },
];

// External libraries that can be imported
const AVAILABLE_LIBRARIES = [
  { name: 'lodash', url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', typesUrl: 'https://cdn.jsdelivr.net/npm/@types/lodash@4.14.191/index.d.ts' },
  { name: 'axios', url: 'https://cdn.jsdelivr.net/npm/axios@1.3.4/dist/axios.min.js', typesUrl: 'https://cdn.jsdelivr.net/npm/axios@1.3.4/index.d.ts' },
  { name: 'moment', url: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js', typesUrl: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.d.ts' },
  { name: 'rxjs', url: 'https://cdn.jsdelivr.net/npm/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js', typesUrl: 'https://cdn.jsdelivr.net/npm/rxjs@7.8.0/dist/types/index.d.ts' },
  { name: 'ramda', url: 'https://cdn.jsdelivr.net/npm/ramda@0.28.0/dist/ramda.min.js', typesUrl: 'https://cdn.jsdelivr.net/npm/@types/ramda@0.28.23/index.d.ts' },
];

// TypeScript compilation options
const defaultCompilerOptions = {
  target: 'es2015',
  module: 'commonjs',
  lib: ['dom', 'es2015', 'es2016', 'es2017'],
  jsx: 'react',
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  noImplicitThis: true,
  alwaysStrict: true,
};

const defaultCode = `// TypeScript Playground
// Write and execute TypeScript code with full type checking

// Define interfaces for strong typing
interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

// Use union types for specific values
type Role = 'admin' | 'editor' | 'viewer';

// Class with TypeScript features
class UserManager {
  private users: User[] = [];
  
  // Method with parameter type annotations and return type
  public addUser(user: User): void {
    this.users.push(user);
    console.log(\`Added user: \${user.name}\`);
  }
  
  // Method with optional parameters
  public findUser(id?: number, email?: string): User | undefined {
    if (id !== undefined) {
      return this.users.find(user => user.id === id);
    } else if (email !== undefined) {
      return this.users.find(user => user.email === email);
    }
    return undefined;
  }
  
  // Method with union type return
  public getUserRole(id: number): Role | null {
    const user = this.findUser(id);
    return user ? user.role : null;
  }
  
  // Getter with specific return type
  get userCount(): number {
    return this.users.length;
  }
}

// Create and use an instance of the class
const manager = new UserManager();

// Create a user with the defined interface
const newUser: User = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'admin',
  createdAt: new Date()
};

// Use the class methods
manager.addUser(newUser);
console.log(\`Total users: \${manager.userCount}\`);

// Find and display a user
const foundUser = manager.findUser(1);
if (foundUser) {
  console.log(\`Found user: \${foundUser.name}, Role: \${foundUser.role}\`);
}

// Try changing properties or methods to see type checking in action!
`;

interface SavedCodeSnippet {
  id: string;
  title: string;
  code: string;
  createdAt: Date;
}

interface ImportedLibrary {
  name: string;
  url: string;
  typesUrl: string;
  loaded: boolean;
}

const Code: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [code, setCode] = useState(defaultCode);
  const [transpiled, setTranspiled] = useState('');
  const [output, setOutput] = useState<ConsoleOutput[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [typeErrors, setTypeErrors] = useState<string[]>([]);
  const [savedSnippets, setSavedSnippets] = useState<SavedCodeSnippet[]>([]);
  const [showTypeErrors, setShowTypeErrors] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'vs' | 'vs-dark' | 'hc-black'>('vs');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tsVersion, setTsVersion] = useState('latest');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedLibraries, setImportedLibraries] = useState<ImportedLibrary[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState('');
  
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Create dark/light theme
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setEditorTheme(isDarkMode ? 'vs' : 'vs-dark');
  };

  // Handle TypeScript version change
  const handleTSVersionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTsVersion(event.target.value as string);
    // In a real app, you would load the specified TypeScript version
    // For demo purposes, we'll just show a message
    setOutput(prev => [...prev, {
      type: 'info',
      content: `Switched to TypeScript version: ${event.target.value}`,
      timestamp: new Date()
    }]);
  };

  // Import library handling
  const handleImportLibrary = () => {
    if (!selectedLibrary) return;
    
    const library = AVAILABLE_LIBRARIES.find(lib => lib.name === selectedLibrary);
    if (!library) return;
    
    // Check if already imported
    if (importedLibraries.some(lib => lib.name === library.name)) {
      setOutput(prev => [...prev, {
        type: 'warn',
        content: `Library ${library.name} is already imported.`,
        timestamp: new Date()
      }]);
      return;
    }
    
    // Add library to imported list
    setImportedLibraries(prev => [...prev, {
      ...library,
      loaded: false
    }]);
    
    // Add import statement to code
    const importStatement = `// Import ${library.name} library
import * as ${library.name} from '${library.name}';\n\n`;
    
    setCode(prevCode => importStatement + prevCode);
    
    // In a real implementation, we would load the actual library
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      setImportedLibraries(prev => 
        prev.map(lib => 
          lib.name === library.name ? { ...lib, loaded: true } : lib
        )
      );
      
      setOutput(prev => [...prev, {
        type: 'info',
        content: `Library ${library.name} has been imported.`,
        timestamp: new Date()
      }]);
    }, 1000);
    
    setSelectedLibrary('');
    setShowImportDialog(false);
  };

  const removeLibrary = (libraryName: string) => {
    setImportedLibraries(prev => prev.filter(lib => lib.name !== libraryName));
    
    // Remove import statement from code
    const codeLines = code.split('\n');
    const filteredLines = codeLines.filter(line => 
      !line.includes(`import * as ${libraryName} from`) && 
      !line.includes(`// Import ${libraryName} library`)
    );
    setCode(filteredLines.join('\n'));
    
    setOutput(prev => [...prev, {
      type: 'info',
      content: `Library ${libraryName} has been removed.`,
      timestamp: new Date()
    }]);
  };

  // Generate shareable link
  const generateShareableLink = () => {
    // Encode the code to base64
    const encodedCode = btoa(encodeURIComponent(code));
    // Create a URL with the encoded code as a parameter
    const shareableLink = `${window.location.origin}/code?snippet=${encodedCode}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink);
    
    setOutput(prev => [...prev, {
      type: 'info',
      content: `Shareable link copied to clipboard.`,
      timestamp: new Date()
    }]);
  };

  // Check for code in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedSnippet = urlParams.get('snippet');
    
    if (encodedSnippet) {
      try {
        const decodedCode = decodeURIComponent(atob(encodedSnippet));
        setCode(decodedCode);
        
        setOutput(prev => [...prev, {
          type: 'info',
          content: `Code snippet loaded from shared link.`,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Failed to decode shared code snippet:', error);
      }
    }
  }, []);

  // Load saved snippets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ts-playground-snippets');
      if (saved) {
        setSavedSnippets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved snippets:', error);
    }
  }, []);

  // Save snippets to localStorage when they change
  useEffect(() => {
    if (savedSnippets.length > 0) {
      localStorage.setItem('ts-playground-snippets', JSON.stringify(savedSnippets));
    }
  }, [savedSnippets]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noImplicitAny: true,
      strictNullChecks: true,
      strict: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      lib: ['es5', 'es6', 'dom']
    });

    // Add type definitions for imported libraries
    importedLibraries.forEach(lib => {
      if (lib.typesUrl) {
        // In a real implementation, you would fetch the type definitions
        // and add them to Monaco using addExtraLib
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module '${lib.name}' {
            const ${lib.name}: any;
            export = ${lib.name};
            export as namespace ${lib.name};
          }`,
          `file:///node_modules/@types/${lib.name}/index.d.ts`
        );
      }
    });

    // Trigger initial type checking
    setTimeout(() => {
      checkForTypeErrors();
    }, 500);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    
    // Type check after a short delay to avoid checking on every keystroke
    if (editorRef.current && monacoRef.current) {
      setTimeout(() => {
        checkForTypeErrors();
      }, 500);
    }
  };

  const checkForTypeErrors = () => {
    if (!editorRef.current || !monacoRef.current || !showTypeErrors) return;
    
    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();
    
    if (!model) return;
    
    monaco.languages.typescript.getTypeScriptWorker().then(worker => {
      worker(model.uri).then((tsClient: TypeScriptWorker) => {
        tsClient.getSemanticDiagnostics(model.uri.toString()).then(diagnostics => {
          if (diagnostics.length > 0) {
            const errors = diagnostics.map((d: any) => {
              return `Error ${d.code}: ${d.messageText}`;
            });
            setTypeErrors(errors);
          } else {
            setTypeErrors([]);
          }
        });
      });
    });
  };

  const transpileTypeScript = () => {
    if (!monacoRef.current) return Promise.resolve('');
    
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    
    if (!model) return Promise.resolve('');
    
    return monaco.languages.typescript.getTypeScriptWorker().then(worker => {
      return worker(model.uri).then((tsClient: TypeScriptWorker) => {
        return tsClient.getEmitOutput(model.uri.toString()).then(result => {
          const output = result.outputFiles[0];
          if (output) {
            setTranspiled(output.text);
            return output.text;
          }
          return '';
        });
      });
    });
  };

  const handleSaveCode = () => {
    const title = prompt('Enter a name for this code snippet:');
    if (!title) return;
    
    const newSnippet: SavedCodeSnippet = {
      id: `snippet-${Date.now()}`,
      title,
      code,
      createdAt: new Date()
    };
    
    setSavedSnippets(prev => [newSnippet, ...prev]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typescript-code.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSnippet = (snippetCode: string) => {
    setCode(snippetCode);
    setTabValue(0); // Switch to editor tab
  };

  const handleDeleteSnippet = (id: string) => {
    setSavedSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  const consoleOverride = () => {
    const originalConsole = { ...console };
    
    const overrideMethod = (method: 'log' | 'error' | 'info' | 'warn') => {
      return (...args: any[]) => {
        // Call the original method
        originalConsole[method](...args);
        
        // Format the console output
        const formattedOutput = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Add to our output state
        setOutput(prev => [...prev, {
          type: method,
          content: formattedOutput,
          timestamp: new Date()
        }]);
      };
    };
    
    // Override console methods
    console.log = overrideMethod('log');
    console.error = overrideMethod('error');
    console.info = overrideMethod('info');
    console.warn = overrideMethod('warn');
    
    return originalConsole;
  };

  const restoreConsole = (originalConsole: typeof console) => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput([]);
    
    try {
      // Transpile TypeScript to JavaScript
      const jsCode = await transpileTypeScript();
      
      if (!jsCode) {
        setOutput([{ 
          type: 'error', 
          content: 'Failed to transpile TypeScript code.', 
          timestamp: new Date() 
        }]);
        return;
      }
      
      // Override console methods to capture output
      const originalConsole = consoleOverride();
      
      try {
        // Create a sandbox with imported libraries
        const libraryImports = importedLibraries.reduce((acc, lib) => {
          // In a real implementation, we would actually load the libraries
          // For demo purposes, we'll mock them
          acc[lib.name] = createMockLibrary(lib.name);
          return acc;
        }, {} as Record<string, any>);
        
        // Execute the transpiled code with libraries in scope
        const executeFunction = new Function(...Object.keys(libraryImports), jsCode);
        executeFunction(...Object.values(libraryImports));
      } catch (error) {
        console.error(`Runtime error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        // Restore original console methods
        restoreConsole(originalConsole);
      }
    } catch (error) {
      setOutput([{ 
        type: 'error', 
        content: `Error: ${error instanceof Error ? error.message : String(error)}`, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  const codeExamples = [
    {
      title: 'Classes & Inheritance',
      description: 'Demonstrating TypeScript classes and inheritance',
      code: `// TypeScript Class Example with Inheritance

abstract class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  abstract makeSound(): void;
  
  move(distanceInMeters: number = 0): void {
    console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  makeSound(): void {
    console.log('Woof! Woof!');
  }
  
  getInfo(): string {
    return \`\${this.name} is a \${this.breed}.\`;
  }
}

// Create a dog instance
const dog = new Dog('Rex', 'German Shepherd');
dog.makeSound();
dog.move(10);
console.log(dog.getInfo());
`
    },
    {
      title: 'Generics',
      description: 'Working with TypeScript generics',
      code: `// TypeScript Generics Example

// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Box<T> {
  value: T;
}

// Generic class
class Queue<T> {
  private data: T[] = [];
  
  push(item: T): void {
    this.data.push(item);
  }
  
  pop(): T | undefined {
    return this.data.shift();
  }
  
  get length(): number {
    return this.data.length;
  }
}

// Using the generic function
const numIdentity = identity<number>(42);
console.log(\`Identity function with number: \${numIdentity}\`);

const strIdentity = identity<string>("Hello TypeScript");
console.log(\`Identity function with string: \${strIdentity}\`);

// Using the generic interface
const numberBox: Box<number> = { value: 123 };
console.log(\`Number box value: \${numberBox.value}\`);

// Using the generic class
const queue = new Queue<string>();
queue.push("one");
queue.push("two");
queue.push("three");

console.log(\`Queue length: \${queue.length}\`);
console.log(\`Popped from queue: \${queue.pop()}\`);
console.log(\`Queue length after pop: \${queue.length}\`);
`
    },
    {
      title: 'Async/Await',
      description: 'Using async/await with TypeScript',
      code: `// TypeScript Async/Await Example

// Simulating an API request
function fetchUserData(userId: string): Promise<object> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (userId === "invalid") {
        reject(new Error("User not found"));
      } else {
        resolve({
          id: userId,
          name: "John Doe",
          email: "john@example.com"
        });
      }
    }, 1000);
  });
}

// Function to process user data
async function processUserData(userId: string): Promise<string> {
  try {
    console.log(\`Fetching data for user: \${userId}...\`);
    const userData = await fetchUserData(userId);
    console.log("User data received:", userData);
    return \`Processed data for user \${userId}\`;
  } catch (error) {
    console.error(\`Error processing user \${userId}:\`, error);
    throw error;
  }
}

// To demonstrate, we would normally use await here, but we'll use the promise directly
// since we're in a browser environment without top-level await
console.log("Starting async operation...");

processUserData("123")
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.error("Operation failed:", error);
  });

// Note: The actual result will appear after a delay due to the setTimeout
console.log("This log appears before the async operation completes");
`
    },
    {
      title: 'Type Utilities',
      description: 'TypeScript utility types and type manipulation',
      code: `// TypeScript Type Utilities

// Base interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  metadata?: {
    lastLogin: Date;
    preferences: Record<string, unknown>;
  };
}

// Partial - Makes all properties optional
type PartialUser = Partial<User>;
const userUpdate: PartialUser = {
  name: 'Updated Name'
};
console.log("User update:", userUpdate);

// Required - Makes all properties required
type RequiredUser = Required<User>;
// Uncommenting this would cause a type error:
// const incompleteUser: RequiredUser = { id: 1, name: 'John' };

// Readonly - Makes all properties readonly
type ReadonlyUser = Readonly<User>;
const readonlyUser: ReadonlyUser = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  role: 'user'
};
// This would cause an error:
// readonlyUser.name = 'New Name';

// Pick - Creates a new type with only the specified properties
type UserCredentials = Pick<User, 'email' | 'id'>;
const credentials: UserCredentials = {
  id: 1,
  email: 'john@example.com'
};
console.log("User credentials:", credentials);

// Omit - Creates a new type without the specified properties
type PublicUser = Omit<User, 'email' | 'metadata'>;
const publicUser: PublicUser = {
  id: 1,
  name: 'John',
  role: 'user'
};
console.log("Public user data:", publicUser);

// Record - Creates a type with specified property keys and value types
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
const roles: UserRoles = {
  john: 'admin',
  mary: 'user',
  visitor: 'guest'
};
console.log("User roles:", roles);

// Exclude - Excludes types from a union
type Role = 'admin' | 'user' | 'guest' | 'moderator';
type NonAdminRole = Exclude<Role, 'admin'>;
const regularRole: NonAdminRole = 'user';
console.log("Regular role:", regularRole);

// Extract - Extracts a subset of a type
type AdminOrModerator = Extract<Role, 'admin' | 'moderator'>;
const powerUserRole: AdminOrModerator = 'admin';
console.log("Power user role:", powerUserRole);
`
    },
    {
      title: 'External Libraries',
      description: 'Using imported libraries with TypeScript',
      code: `// Using External Libraries
// Note: This example assumes you've imported libraries like lodash, axios, and moment

// Using lodash for array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = lodash.map(numbers, num => num * 2);
console.log("Doubled numbers:", doubled);

const evens = lodash.filter(numbers, num => num % 2 === 0);
console.log("Even numbers:", evens);

// Using axios for HTTP requests (simulated)
// In a real environment, this would make a real HTTP request
axios.get('https://api.example.com/data')
  .then(response => {
    console.log("API Response:", response.data);
  })
  .catch(error => {
    console.error("API Error:", error);
  });

// Using moment for date manipulation
console.log("Current date and time:", moment.now());

// Note: To run this example, import the required libraries first!
`
    },
    {
      title: 'Decorators',
      description: 'Using TypeScript decorators with classes and methods',
      code: `// TypeScript Decorators Example
// Note: You need to enable experimentalDecorators in tsconfig

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  console.log(\`Class \${constructor.name} has been sealed\`);
}

// Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling method \${propertyKey} with arguments: \${JSON.stringify(args)}\`);
    const result = originalMethod.apply(this, args);
    console.log(\`Method \${propertyKey} returned: \${JSON.stringify(result)}\`);
    return result;
  };
  
  return descriptor;
}

// Property decorator
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    let value: any;
    
    const getter = function() {
      return value;
    };
    
    const setter = function(newValue: any) {
      if (typeof newValue === 'string') {
        // Apply formatting
        value = formatString.replace('{value}', newValue);
      } else {
        value = newValue;
      }
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

@sealed
class Person {
  @format('Greeting: {value}')
  greeting: string;
  
  constructor(public name: string, greeting: string) {
    this.greeting = greeting;
  }
  
  @log
  greet(other: string): string {
    return \`\${this.greeting}, \${other}! My name is \${this.name}.\`;
  }
}

// Create a person instance
const alice = new Person('Alice', 'Hello');
const greeting = alice.greet('Bob');
console.log(\`Formatted greeting property: \${alice.greeting}\`);

// Note: Decorators are still experimental, so this might not work in all TypeScript environments
`
    }
  ];

  // Mock library for demo purposes
  const createMockLibrary = (name: string) => {
    switch (name) {
      case 'lodash':
        return {
          map: (arr: any[], fn: Function) => arr.map(fn),
          filter: (arr: any[], fn: Function) => arr.filter(fn),
          // Add more lodash methods as needed
        };
      case 'axios':
        return {
          get: (url: string) => Promise.resolve({ data: { message: `Mock response from ${url}` } }),
          post: (url: string, data: any) => Promise.resolve({ data: { message: `Mock response from ${url}`, sentData: data } }),
          // Add more axios methods as needed
        };
      case 'moment':
        return {
          now: () => new Date().toISOString(),
          format: (date: Date, format: string) => `Formatted date: ${date.toISOString()}`,
          // Add more moment methods as needed
        };
      default:
        return {};
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <CodeContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h4" gutterBottom>
            TypeScript Playground
      </Typography>
          <Box>
            <Tooltip title="Toggle Dark/Light Mode">
              <IconButton onClick={toggleDarkMode} sx={{ mr: 1 }}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <FormControl size="small" variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
              <InputLabel id="ts-version-label">TS Version</InputLabel>
              <Select
                labelId="ts-version-label"
                value={tsVersion}
                onChange={handleTSVersionChange}
                label="TS Version"
                size="small"
              >
                {TS_VERSIONS.map((version) => (
                  <MenuItem key={version.value} value={version.value}>
                    {version.version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              startIcon={<ImportExportIcon />}
              variant="outlined"
              size="small"
              onClick={() => setShowImportDialog(true)}
              sx={{ mr: 1 }}
            >
              Import Library
            </Button>
            
            <Button 
              startIcon={<LinkIcon />}
              variant="outlined"
              size="small"
              onClick={generateShareableLink}
            >
              Share Code
            </Button>
          </Box>
        </Box>

        {/* Import Library Dialog */}
        {showImportDialog && (
          <Paper sx={{ mb: 2, p: 2, position: 'relative' }}>
            <IconButton 
              size="small"
              onClick={() => setShowImportDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            
            <Typography variant="h6" gutterBottom>Import Library</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mr: 2 }}>
                <InputLabel id="library-select-label">Select Library</InputLabel>
                <Select
                  labelId="library-select-label"
                  value={selectedLibrary}
                  onChange={(e) => setSelectedLibrary(e.target.value as string)}
                  label="Select Library"
                >
                  <MenuItem value="">
                    <em>Select a library</em>
                  </MenuItem>
                  {AVAILABLE_LIBRARIES.map((lib) => (
                    <MenuItem key={lib.name} value={lib.name}>
                      {lib.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                onClick={handleImportLibrary}
                disabled={!selectedLibrary}
              >
                Import
              </Button>
            </Box>
            
            {importedLibraries.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Imported Libraries:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {importedLibraries.map((lib) => (
                    <Chip
                      key={lib.name}
                      label={lib.name}
                      color="primary"
                      variant="outlined"
                      onDelete={() => removeLibrary(lib.name)}
                      icon={lib.loaded ? undefined : <CircularProgress size={16} />}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Editor" />
          <Tab label="Examples" />
          <Tab label="Saved Code" />
            <Tab label="JS Output" />
            <Tab label="Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">TypeScript Editor</Typography>
              <Box>
                <Tooltip title="Copy Code">
                    <IconButton onClick={handleCopyCode} size="small" sx={{ mr: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save Code">
                    <IconButton onClick={handleSaveCode} size="small" sx={{ mr: 1 }}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                  <Tooltip title="Download Code">
                    <IconButton onClick={handleDownloadCode} size="small" sx={{ mr: 1 }}>
                      <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Run Code">
                    <IconButton 
                      onClick={handleRunCode} 
                      color="primary" 
                      size="small" 
                      disabled={isExecuting}
                    >
                      {isExecuting ? <CircularProgress size={24} /> : <PlayArrowIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
              
              {importedLibraries.length > 0 && (
                <Box mb={2} p={1} sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Imported Libraries:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {importedLibraries.map((lib) => (
                      <Chip
                        key={lib.name}
                        label={lib.name}
                        size="small"
                        variant="outlined"
                        onDelete={() => removeLibrary(lib.name)}
                        color={lib.loaded ? 'success' : 'default'}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Editor
                height="400px"
                defaultLanguage="typescript"
              value={code}
              onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme={editorTheme}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnType: true,
                  formatOnPaste: true,
                  rulers: [80],
                  autoIndent: 'full',
                }}
              />
              
              {typeErrors.length > 0 && showTypeErrors && (
                <Box mt={2}>
                  <Alert severity="warning">
                    <Typography variant="subtitle2">Type Errors:</Typography>
                    {typeErrors.map((error, index) => (
                      <Typography key={index} variant="body2" component="div">
                        {error}
                      </Typography>
                    ))}
                  </Alert>
                </Box>
              )}
              
              <Box mt={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Console Output</Typography>
                  <Button 
                    startIcon={<RestartAltIcon />} 
                    size="small" 
                    onClick={handleClearOutput}
                  >
                    Clear
                  </Button>
                </Box>
                <OutputContainer sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  {output.length === 0 ? (
                    <Typography color="text.secondary">
                      Run your code to see output here...
                    </Typography>
                  ) : (
                    output.map((item, index) => (
                      <Box key={index} mb={0.5}>
                        <Typography 
                          component="span" 
                          color={
                            item.type === 'error' ? 'error' : 
                            item.type === 'warn' ? 'warning.main' : 
                            item.type === 'info' ? 'info.main' : 
                            'inherit'
                          }
                        >
                          {item.content}
                        </Typography>
                      </Box>
                    ))
                  )}
                </OutputContainer>
              </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {codeExamples.map((example, index) => (
              <Grid item xs={12} key={index}>
                  <Card variant={theme.palette.mode === 'dark' ? 'outlined' : 'elevation'}>
                  <CardHeader
                    title={example.title}
                    subheader={example.description}
                    action={
                        <Button 
                          startIcon={<CodeIcon />} 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleLoadSnippet(example.code)}
                        >
                          Use Example
                        </Button>
                    }
                  />
                  <CardContent>
                      <Editor
                        height="200px"
                        defaultLanguage="typescript"
                      value={example.code}
                        theme={editorTheme}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                        }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
              {savedSnippets.length === 0 ? (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You don't have any saved code snippets yet. Write some code in the editor and save it!
                  </Alert>
                </Grid>
              ) : (
                savedSnippets.map((snippet) => (
                  <Grid item xs={12} key={snippet.id}>
                    <Card variant={theme.palette.mode === 'dark' ? 'outlined' : 'elevation'}>
                  <CardHeader
                        title={snippet.title}
                        subheader={`Created: ${new Date(snippet.createdAt).toLocaleString()}`}
                    action={
                          <Box>
                            <Button 
                              startIcon={<CodeIcon />} 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleLoadSnippet(snippet.code)}
                              sx={{ mr: 1 }}
                            >
                              Load
                            </Button>
                            <Button
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteSnippet(snippet.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                    }
                  />
                  <CardContent>
                        <Editor
                          height="150px"
                          defaultLanguage="typescript"
                          value={snippet.code}
                          theme={editorTheme}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                          }}
                    />
                  </CardContent>
                </Card>
              </Grid>
                ))
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Transpiled JavaScript</Typography>
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={transpiled || '// Run your TypeScript code to see the transpiled JavaScript here...'}
                theme={editorTheme}
                options={{
                  readOnly: true,
                  minimap: { enabled: true },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box px={2} py={3}>
              <Typography variant="h6" gutterBottom>Playground Settings</Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Appearance</Typography>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={isDarkMode} 
                          onChange={toggleDarkMode} 
                          color="primary"
                        />
                      }
                      label="Dark Mode"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={showTypeErrors} 
                          onChange={() => setShowTypeErrors(!showTypeErrors)} 
                          color="primary"
                        />
                      }
                      label="Show Type Errors"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>TypeScript Options</Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="ts-version-settings-label">TypeScript Version</InputLabel>
                    <Select
                      labelId="ts-version-settings-label"
                      value={tsVersion}
                      onChange={handleTSVersionChange}
                      label="TypeScript Version"
                    >
                      {TS_VERSIONS.map((version) => (
                        <MenuItem key={version.value} value={version.value}>
                          {version.version}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<ImportExportIcon />}
                    onClick={() => {
                      setShowImportDialog(true);
                      setTabValue(0); // Switch to editor tab
                    }}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Manage Library Imports
                  </Button>
          </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Share Your Code</Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<LinkIcon />}
                    onClick={generateShareableLink}
                    fullWidth
                  >
                    Generate Shareable Link
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    This will copy a link to your clipboard that you can share with others.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
        </TabPanel>
      </Paper>
    </CodeContainer>
    </ThemeProvider>
  );
};

export default Code; 