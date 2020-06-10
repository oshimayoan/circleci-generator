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

  let generatedSimpleConfig = `
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

  let orbname = '${orbname}';
  let generatedMonorepoConfig = `
version: 2.1

orbs:
  compare-url: oshimayoan/compare-url@1.2.4

jobs:
  ${config.jobName}:
    docker:
      - image: circleci/node:${config.nodeVersion}

    working_directory: ~/repo

    steps:
      - checkout
      - compare-url/reconstruct:
          project-path: ~/repo

      # Download and cache dependencies
      # You can change both "projectA" and "projectB" with your own
      # You can copy it for more
      - restore_cache:
          keys:
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-{{ checksum "projectA/${lockfile}" }}
            - v1-dependencies-

      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "projectB/${lockfile}" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-

      - compare-url/use:
          step-name: Your step name
          custom-logic: |
            for ORB in ./*/; do
              orbname=$(basename $ORB)
              if [[ $(git diff $COMMIT_RANGE --name-status | grep "$orbname") ]]; then
                echo "testing ${orbname}"
                cd ${orbname}
                # Do what you want here
                # Maybe testing, such as:
                # yarn install --frozen-lockfile
                # yarn test --maxWorkers=4
                cd ..
              else
                echo "${orbname} not modified; no need to test"
              fi
            done

      # You can copy it for more
      - save_cache:
          paths:
            - projectA/node_modules
          key: v1-dependencies-{{ checksum "projectA/${lockfile}" }}

      - save_cache:
          paths:
            - projectB/node_modules
          key: v1-dependencies-{{ checksum "projectB/${lockfile}" }}

workflows:
  main:
    jobs:
      - ${config.jobName}
  `.trim();

  let generatedConfig = config.isMonorepo
    ? generatedMonorepoConfig
    : generatedSimpleConfig;

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
