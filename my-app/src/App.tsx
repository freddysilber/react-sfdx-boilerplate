import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@salesforce/design-system-react';
import './App.css';
import remotingInvoke from './remoting';
const Accounts = React.lazy(() => import('./components/accounts'));

export interface SObjectFieldValues {
  Id: string;
  Name: string;
  [x: string]: any;
}

export default function App() {
  const [state, setState] = useState<Partial<{
    accounts: SObjectFieldValues[],
    loading: boolean,
  }>>({});

  async function getAccounts() {
    setState({
      ...state,
      loading: true,
    });
    remotingInvoke<SObjectFieldValues[]>(
      'AccountRemoter.getAccount',
      {
        name: 'params!'
      },
    ).then((accounts) => {
      setState({
        ...state,
        accounts
      });
    }).catch((error) => {
      alert(error);
    });
  }

  function loading() {
    if (state.loading) {
      return (
        <Spinner
          variant="brand"
          size="medium"
        />
      );
    } else {
      return null;
    };
  }

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container slds-p-around_small slds-grid slds-grid_vertical">
      {/* Spinner */}
      {loading()}

      <div className="slds-box">
        <Button
          label="Refresh"
          variant="brand"
          onClick={getAccounts}
        />
        <Accounts accounts={state.accounts} />
      </div>
    </div>
  );
}
