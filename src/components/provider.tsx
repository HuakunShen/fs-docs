import React, { useState } from 'react';

export const myContext = React.createContext({});
interface Props {
  children: React.ReactNode;
}
const Provider = (props: Props) => {
  const [isDark, setTheme] = useState(false);

  return (
    <myContext.Provider
      value={{
        isDark,
        changeTheme: () => setTheme(!isDark),
      }}
    >
      {props.children}
    </myContext.Provider>
  );
};

export default ({ children }: Props) => {
  return <Provider>{children}</Provider>;
};

