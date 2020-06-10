import React, { createContext, ReactNode, useReducer, useContext } from 'react';

export type PackageManager = 'yarn' | 'npm';

type State = {
  pkgManager: PackageManager;
  jobName: string;
  nodeVersion: string;
  isMonorepo: boolean;
};

type Action =
  | {
      type: 'CHANGE_JOBNAME';
      jobName: string;
    }
  | {
      type: 'CHANGE_NODE_VERSION';
      nodeVersion: string;
    }
  | {
      type: 'CHANGE_PACKAGE_MANAGER';
      pkgManager: PackageManager;
    }
  | {
      type: 'CHANGE_MONOREPO';
      isMonorepo: boolean;
    };

type Dispatch = (action: Action) => void;

const INITIAL_STATE: State = {
  pkgManager: 'yarn',
  jobName: 'build',
  nodeVersion: 'lts',
  isMonorepo: false,
};

const ConfigGeneratorStateContext = createContext<State | null>(null);
const ConfigGeneratorDispatchContext = createContext<Dispatch | null>(null);

function ConfigGeneratorReducer(state: State, action: Action) {
  switch (action.type) {
    case 'CHANGE_JOBNAME':
      return { ...state, jobName: action.jobName };
    case 'CHANGE_NODE_VERSION':
      return { ...state, nodeVersion: action.nodeVersion };
    case 'CHANGE_PACKAGE_MANAGER':
      return { ...state, pkgManager: action.pkgManager };
    case 'CHANGE_MONOREPO':
      return { ...state, isMonorepo: action.isMonorepo };
    default:
      return state;
  }
}

function ConfigGeneratorProvider({ children }: { children: ReactNode }) {
  let [state, dispatch] = useReducer(ConfigGeneratorReducer, INITIAL_STATE);

  return (
    <ConfigGeneratorStateContext.Provider value={state}>
      <ConfigGeneratorDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigGeneratorDispatchContext.Provider>
    </ConfigGeneratorStateContext.Provider>
  );
}

function useConfigGeneratorState() {
  let context = useContext(ConfigGeneratorStateContext);
  if (!!!context) {
    throw new Error(
      'useConfigGeneratorState must be used within a ConfigGeneratorProvider',
    );
  }
  return context;
}

function useConfigGeneratorDispatch() {
  let context = useContext(ConfigGeneratorDispatchContext);
  if (!!!context) {
    throw new Error(
      'useConfigGeneratorDispatch must be used within a ConfigGeneratorProvider',
    );
  }
  return context;
}

function useConfigGenerator() {
  let state = useConfigGeneratorState();
  let dispatch = useConfigGeneratorDispatch();

  let changeJobName = (jobName: string) => {
    let newJobName = jobName.trim() !== '' ? jobName : INITIAL_STATE.jobName;
    dispatch({ type: 'CHANGE_JOBNAME', jobName: newJobName });
  };

  let changeNodeVersion = (nodeVersion: string) => {
    let newNodeVersion =
      nodeVersion.trim() !== '' ? nodeVersion : INITIAL_STATE.nodeVersion;
    dispatch({ type: 'CHANGE_NODE_VERSION', nodeVersion: newNodeVersion });
  };

  let changePackageManager = (packageManager: PackageManager) => {
    dispatch({ type: 'CHANGE_PACKAGE_MANAGER', pkgManager: packageManager });
  };

  let changeMonorepo = (isMonorepo: boolean) => {
    dispatch({ type: 'CHANGE_MONOREPO', isMonorepo });
  };

  return {
    config: state,
    changeMonorepo,
    changePackageManager,
    changeNodeVersion,
    changeJobName,
  };
}

export {
  ConfigGeneratorProvider,
  useConfigGeneratorState,
  useConfigGeneratorDispatch,
  useConfigGenerator,
};
