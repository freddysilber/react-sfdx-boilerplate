import { Button, Spinner } from '@salesforce/design-system-react';
import { useEffect, useState } from 'react';
import './App.css';
import Accounts from './components/accounts';
import remotingInvoke from './remoting';

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
        <div style={{ height: '100%' }}>
          <Spinner
            size="small"
            variant="base"
            assistiveText={{ label: 'Main Frame Loading...' }}
          />
        </div>
      );
    } else {
      return null;
    };
  }

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="slds-p-around_small slds-grid slds-grid_vertical">
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
