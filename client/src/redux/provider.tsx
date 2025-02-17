import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

// Define props type
interface Props {
  children: React.ReactNode;
}

// Redux Provider Component
export default function RTKProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
