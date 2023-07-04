// UserContext.tsx
import { createContext } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const initialUserContext: UserContextProps = {
  user: null,
  setUser: () => {
    return;
  },
};

export const UserContext = createContext<UserContextProps>(initialUserContext);
