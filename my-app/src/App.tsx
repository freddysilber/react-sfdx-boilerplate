import { Button } from '@salesforce/design-system-react';
// import IconSettings from '@salesforce/design-system-react/components/icon-settings';
// import Icon from '@salesforce/design-system-react/components/icon';
import { useEffect, useState } from 'react';
import './App.css';
import Accounts from './components/accounts';
// import '@salesforce-ux/design-system/assets/icons/utility';
// import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';

// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
declare var Visualforce: any;

function App() {
  const [accounts, setAccounts] = useState<any>({});

  useEffect(() => {
    async function getAccounts() {
      console.log(process.env);

      if (process.env.NODE_ENV === 'development') {
        const response = await fetch(
          `/services/apexrest/remoting`,
          // TODO need to resolve this namespace
          // `/services/apexrest/project_cloud/remoting`,
          {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
              // Use token from env vars (dev). This is set in the 'auth.js' script
              'Authorization': `OAuth ${process.env.REACT_APP_TOKEN}`,
              'Content-Type': 'application/json',
            }),
            credentials: 'include',
            body: JSON.stringify({
              apexType: 'c.AccountRemoter.getAccount'
            }),
          }
        );
        const accounts = await response.json();
        // TODO no error handling here
        setAccounts({
          data: accounts,
        });
      } else if (process.env.NODE_ENV === 'production') {
        Visualforce.remoting.Manager.invokeAction(
          // 'project_cloud.Remoting.execute',
          'Remoting.execute',
          {
            apexType: 'c.AccountRemoter.getAccount',
            name: 'params!',
            // Add additional apex params/args here?
          },
          function (result: any, event: any) {
            console.log(result, event);
            setAccounts({
              data: result,
            });
            if (event.status) {
              console.log('here');
            } else if (event.type === 'exception') {
              console.log('here 2');
            } else {
              console.log('here 3');
            }
          },
          { escape: true }
        );
      }
    }

    getAccounts();
  }, []);

  if (accounts && accounts.data) {
    return (
      <div className="App">
        <Button label="Hello Button" />
        {/* <Icon
          assistiveText={{ label: 'Warning' }}
          category="utility"
          name="warning"
          size="x-small"
        /> */}
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

export default App;


/* <header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>
    Edit <code>src/App.tsx</code> and save to reload.
  </p>
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    Learn React
  </a>
</header> */