import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';

const App = () => {
  return (
    <ThemeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;