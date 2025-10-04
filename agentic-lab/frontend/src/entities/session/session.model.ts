import type { PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from '~shared/store';
import { User } from './session.types';

type State = User | null;

// Helper function to get session from localStorage
const getInitialState = (): State => {
  try {
    const persistedState = localStorage.getItem('persist:root');
    if (persistedState) {
      const { session } = JSON.parse(persistedState);
      if (session) {
        return JSON.parse(session);
      }
    }
  } catch (e) {
    console.error('Error loading persisted session:', e);
  }
  return null;
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState() as State,
  reducers: {
    setSession: (_state, action: PayloadAction<State>) => {
      // Ensure the session is immediately available
      return action.payload;
    },
    resetSession: () => {
      // Ensure the session is immediately cleared
      return null;
    },
  },
  selectors: {
    selectSession: (state) => state,
  },
});

export const { setSession, resetSession } = sessionSlice.actions;

declare module '~shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof sessionSlice> { }
}

const injectedSessionSlice = sessionSlice.injectInto(rootReducer);

export const { selectSession } = injectedSessionSlice.selectors;
