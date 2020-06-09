import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

import { View } from '../core/View';
import { Title } from '../core/Text';

const Wrapper = styled(View)`
  flex: 1;
  padding: 15px;
`;

const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: scroll;
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;

const exampleCode = `
version: 2.1

orbs:
  compare-url: oshimayoan/compare-url@1.2.4
  cypress: cypress-io/cypress@1

jobs:
  test:
    docker:
      - image: circleci/node:lts
      - image: circleci/postgres:9.6.5-alpine-ram
`.trim();

export default function Preview() {
  return (
    <Wrapper>
      <Title>Preview</Title>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={exampleCode}
        language="yaml"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style}>
            {tokens.map((line, i) => (
              <Line key={i} {...getLineProps({ line, key: i })}>
                <LineNo>{i + 1}</LineNo>
                <LineContent>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </LineContent>
              </Line>
            ))}
          </Pre>
        )}
      </Highlight>
    </Wrapper>
  );
}
