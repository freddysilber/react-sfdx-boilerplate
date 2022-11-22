import { Button, Spinner } from '@salesforce/design-system-react';
import { useEffect, useState } from 'react';
import './App.css';
import Accounts from './components/accounts';
import Contacts from './components/contacts';
import remotingInvoke from './remoting';

export interface SObjectFieldValues {
  Id: string;
  Name: string;
  [x: string]: any;
}

export default function App() {
  // Component state
  const [state, setState] = useState<Partial<{
    accounts: SObjectFieldValues[],
    contacts: SObjectFieldValues[],
    loading: boolean,
  }>>({});

  // Method to fetch Account records
  async function getAccounts() {
    setState({
      ...state,
      loading: true,
    });

    remotingInvoke<SObjectFieldValues[]>(
      'AccountRemoter.getAccount',
      // Send params
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

  // Method to fetch Contact records
  async function fetchContacts() {
    setState({
      ...state,
      loading: true,
    });

    remotingInvoke<SObjectFieldValues[]>(
      'Contacts.getContacts'
    ).then((contacts) => {
      setState({
        ...state,
        contacts
      });
    }).catch((error) => {
      alert(error);
    });
  }

  // Dumb component for spinner
  function loading() {
    if (state.loading) {
      return <Spinner
        variant="brand"
        size="medium"
      />;
    } else {
      return null;
    };
  }

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Component body
  return (
    <div className="app-container slds-p-around_small slds-grid slds-grid_vertical">
      {/* Spinner */}
      {loading()}

      <div className="slds-box">
        <Button
          label="Refresh Accounts"
          variant="brand"
          onClick={getAccounts}
        />
        <Button
          label="Get Contacts"
          variant="brand"
          onClick={fetchContacts}
        />
        <br />
        <Accounts accounts={state.accounts} />
        <Contacts contacts={state.contacts} />
      </div>
    </div>
  );
}
