import React from 'react';
import styled from 'styled-components';

import { ConfigGeneratorProvider } from './contexts/configGenerator';
import Preview from './components/preview/Preview';
import Generator from './components/generator/Generator';
import { View } from './components/core/View';

const Root = styled(View)`
  flex: 1;
  flex-direction: row;
  background-color: white;
  justify-content: center;
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
