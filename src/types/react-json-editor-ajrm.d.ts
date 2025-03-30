declare module 'react-json-editor-ajrm' {
  import { ComponentType } from 'react';

  interface JSONInputProps {
    id?: string;
    placeholder: any;
    locale?: any;
    height?: string;
    width?: string;
    onChange?: (data: { jsObject: any }) => void;
    theme?: string;
    colors?: {
      string?: string;
      number?: string;
      colon?: string;
      keys?: string;
      keys_whiteSpace?: string;
      primitive?: string;
    };
  }

  const JSONInput: ComponentType<JSONInputProps>;
  export default JSONInput;
}

declare module 'react-json-editor-ajrm/locale/en' {
  const locale: any;
  export default locale;
} 