import React, { useState } from 'react';
import styled from 'styled-components';
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Paper as UnstyledPaper,
  TextField,
  Box,
} from '@material-ui/core';

import { View } from '../core/View';
import Text, { Title } from '../core/Text';
import {
  useConfigGenerator,
  PackageManager,
} from '../../contexts/configGenerator';

const Wrapper = styled(View)`
  flex: 1;
  padding: 15px;
`;

const Content = styled(View)`
  padding: 15px 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Section = styled(Box)`
  padding: 10px 0;
`;

const HorizontalView = styled(View)`
  flex-direction: row;
`;

const Paper = styled(UnstyledPaper)`
  padding: 20px;
`;

const PACKAGE_MANAGER: ReadonlyArray<{ id: PackageManager; name: string }> = [
  { id: 'yarn', name: 'Yarn' },
  { id: 'npm', name: 'NPM' },
] as const;

export default function Generator() {
  let { config } = useConfigGenerator();
  let [jobName, setJobName] = useState('');
  let [nodeVersion, setNodeVersion] = useState('');
  let [pkgManager, setPkgManager] = useState<PackageManager>(config.pkgManager);

  return (
    <Wrapper>
      <Title>Config Generator</Title>
      <Content>
        <Paper elevation={3}>
          <FormLabel component="legend">Package Manager</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={pkgManager}
            onChange={(event) =>
              setPkgManager(event.target.value as PackageManager)
            }
          >
            <HorizontalView>
              {PACKAGE_MANAGER.map((item) => (
                <FormControlLabel
                  key={item.id}
                  value={item.id}
                  control={<Radio />}
                  label={item.name}
                />
              ))}
            </HorizontalView>
          </RadioGroup>
          <Section>
            <TextField
              label="Job Name (optional)"
              variant="outlined"
              placeholder="default: build"
              value={jobName}
              onChange={(event) => setJobName(event.target.value)}
            />
          </Section>
          <Section>
            <TextField
              label="Node Version (optional)"
              variant="outlined"
              placeholder="default: lts"
              value={nodeVersion}
              onChange={(event) => setNodeVersion(event.target.value)}
            />
          </Section>
        </Paper>
      </Content>
    </Wrapper>
  );
}
