import React, { createContext, ReactNode, useReducer, useContext } from 'react';

export type PackageManager = 'yarn' | 'npm';

type State = {
  pkgManager: PackageManager;
  jobName: string;
  nodeVersion: string;
};

type Action = {
  type: 'CHANGE_CONFIG';
  payload: State;
};

type Dispatch = (action: Action) => void;

const INITIAL_STATE: State = {
  pkgManager: 'yarn',
  jobName: 'build',
  nodeVersion: 'lts',
};

const ConfigGeneratorStateContext = createContext<State | null>(null);
const ConfigGeneratorDispatchContext = createContext<Dispatch | null>(null);

function ConfigGeneratorReducer(state: State, action: Action) {
  switch (action.type) {
    case 'CHANGE_CONFIG':
      return action.payload;
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

  let changeConfig = (config: State) => {
    let { jobName, nodeVersion, pkgManager } = config;
    let newJobName = jobName.trim() !== '' ? jobName : state.jobName;
    let newNodeVersion =
      nodeVersion.trim() !== '' ? nodeVersion : state.nodeVersion;
    let newConfig = {
      ...state,
      pkgManager,
      jobName: newJobName,
      nodeVersion: newNodeVersion,
    };
    dispatch({ type: 'CHANGE_CONFIG', payload: newConfig });
  };

  return { config: state, changeConfig };
}

export {
  ConfigGeneratorProvider,
  useConfigGeneratorState,
  useConfigGeneratorDispatch,
  useConfigGenerator,
};
