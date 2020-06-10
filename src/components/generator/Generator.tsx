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

import {
  useConfigGenerator,
  PackageManager,
} from '../../contexts/configGenerator';

const Section = styled(Box)`
  padding: 10px 0;
`;

const HorizontalView = styled(Box)`
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
  let { config, changeConfig } = useConfigGenerator();
  let [jobName, setJobName] = useState('');
  let [nodeVersion, setNodeVersion] = useState('');
  let [pkgManager, setPkgManager] = useState<PackageManager>(config.pkgManager);

  return (
    <Box>
      <Paper elevation={3}>
        <FormLabel component="legend">Package Manager</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={pkgManager}
          onChange={(event) => {
            let newPkgManager = event.target.value as PackageManager;
            setPkgManager(newPkgManager);
            changeConfig({ ...config, pkgManager: newPkgManager });
          }}
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
            onChange={(event) => {
              let newJobName = event.target.value;
              setJobName(newJobName);
              changeConfig({ ...config, jobName: newJobName });
            }}
          />
        </Section>
        <Section>
          <TextField
            label="Node Version (optional)"
            variant="outlined"
            placeholder="default: lts"
            value={nodeVersion}
            onChange={(event) => {
              let newNodeVersion = event.target.value;
              setNodeVersion(newNodeVersion);
              changeConfig({ ...config, nodeVersion: newNodeVersion });
            }}
          />
        </Section>
      </Paper>
    </Box>
  );
}
