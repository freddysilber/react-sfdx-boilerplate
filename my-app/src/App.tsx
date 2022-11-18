import { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Accounts from './components/accounts';
// import restConfig from '../auth/rest.config.json';

// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
declare var Visualforce: any;
// console.log(Visualforce);

function App() {
  const [accounts, setAccounts] = useState<any>({});

  useEffect(() => {
    async function getAccounts() {
      console.log(process.env);

      if (process.env.NODE_ENV === 'development') {
        const response = await fetch(
          `/services/apexrest/remoting`,
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
        setAccounts({
          data: accounts,
        });
      } else if (process.env.NODE_ENV === 'production') {
        console.log('use VFRemoting here');
        // TODO: use 'Visualforce.remoting.Manager.invokeAction' in production code

        const accountName: string = '';
        Visualforce.remoting.Manager.invokeAction(
          '{!$RemoteAction.AccountRemoter.getAccount}',
          accountName,
          function (result: any, event: any) {
            console.log('VFRemoting ', { result, event });
            if (event.status) {
              console.log(1);
              // Get DOM IDs for HTML and Visualforce elements like this
              // document!.getElementById('remoteAcctId')!.innerHTML = result.Id
              // document!.getElementById(
              //   "{!$Component.block.blockSection.secondItem.acctNumEmployees}"
              // )!.innerHTML = result.NumberOfEmployees;
            } else if (event.type === 'exception') {
              console.log(2);
              // document!.getElementById("responseErrors")!.innerHTML =
              //   event.message + "<br/>\n<pre>" + event.where + "</pre>";
            } else {
              console.log(3);
              // document!.getElementById("responseErrors")!.innerHTML = event.message;
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