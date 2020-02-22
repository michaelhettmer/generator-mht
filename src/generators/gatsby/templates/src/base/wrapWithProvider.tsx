import React from 'react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export const primary = '#3f51b5';
export const secondary = '#FFC05C';

const theme = createMuiTheme({ palette: { primary: { main: primary }, secondary: { main: secondary } } });

// eslint-disable-next-line react/display-name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapWithProvider = ({ element }: any) => {
    return (
        <ThemeProvider {...{ theme }}>
            <SnackbarProvider>{element}</SnackbarProvider>
        </ThemeProvider>
    );
};

export default wrapWithProvider;
