import * as React from 'react';

type UserType = {
  loading: boolean;
  error: string;
};

export const UserContext = React.createContext<any | null>(null);
