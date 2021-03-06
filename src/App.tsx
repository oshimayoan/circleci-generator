import React from 'react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

import { ConfigGeneratorProvider } from './contexts/configGenerator';
import Preview from './components/preview/Preview';
import Generator from './components/generator/Generator';

const Root = styled(Box)`
  display: flex;
  flex: 1;
  flex-direction: row;
  background-color: white;
  padding: 50px;
`;

export default function App() {
  return (
    <ConfigGeneratorProvider>
      <Root>
        <Generator />
        <Preview />
      </Root>
    </ConfigGeneratorProvider>
  );
}
