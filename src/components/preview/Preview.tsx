import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';
import { Box, Button } from '@material-ui/core';
import copy from 'copy-to-clipboard';

import { useConfigGenerator } from '../../contexts/configGenerator';

const Wrapper = styled(Box)`
  flex: 1;
  margin-left: 15px;
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
  padding: 2px 0;
`;

export default function Preview() {
  let { config } = useConfigGenerator();
  let lockfile =
    config.pkgManager === 'yarn' ? 'yarn.lock' : 'package-lock.json';

  let generatedConfig = `
version: 2.1

jobs:
  ${config.jobName}:
    docker:
      - image: circleci/node:${config.nodeVersion}

    working_directory: ~/repo

    steps:
      - checkout

      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "${lockfile}" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-

      - run:
          name: Your step name
          command: |
            # Your command here

      - save_cache:
          paths:
            - ./node_modules
          key: v1-dependencies-{{ checksum "${lockfile}" }}

workflows:
  main:
    jobs:
      - ${config.jobName}
`.trim();

  let copyToClipboard = () => {
    copy(generatedConfig);
  };

  return (
    <Wrapper>
      <Button variant="contained" onClick={copyToClipboard}>
        Copy to clipboard
      </Button>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={generatedConfig}
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
