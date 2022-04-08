import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      main: string;
      sub1: string;
      sub2: string;
      sub3: string;
    };
  }
}
