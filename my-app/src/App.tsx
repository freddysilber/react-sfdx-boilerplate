import { Button } from '@salesforce/design-system-react';
import { useEffect, useState } from 'react';
import './App.css';
import Accounts from './components/accounts';
import remotingInvoke from './remoting/remoting';

export default function App() {
  const [accounts, setAccounts] = useState<any>({});

  useEffect(() => {
    async function getAccounts() {
      remotingInvoke<any>(
        'AccountRemoter.getAccount',
        {
          name: 'params!'
        },
      ).then((accounts) => {
        setAccounts({
          data: accounts,
        });
      }).catch((error) => {
        alert(error);
      });
    }

    getAccounts();
  }, []);
  console.log(accounts);
  if (accounts && accounts.data && accounts.data.length) {
    return (
      <div className="App">
        <Button label="Hello Button" />
        <button className="slds-button slds-button_brand">Button</button>
        <Accounts accounts={accounts.data} />
      </div>
    );
  } else {
    return (
      <div>No Records Found</div>
    );
  }
}
