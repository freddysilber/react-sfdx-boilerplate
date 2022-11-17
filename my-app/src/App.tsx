import React from 'react';
import logo from './logo.svg';
import './App.css';

// // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
// declare var Visualforce: any;

function App() {
  console.log('<App/>');

  // fetch(`/services/apexrest/${defaults.rest.endpoint}`).then((response) => {
  fetch(
    // `https://site-app-4107-dev-ed.scratch.lightning.force.com/services/apexrest/project_cloud/remoting`,
    // `https://CS76.salesforce.com/services/apexrest/project_cloud/remoting`,
    `/services/apexrest/project_cloud/remoting`,
    {
      method: 'POST',
      // mode: 'same-origin',
      // mode: 'no-cors',
      mode: 'cors',
      headers: new Headers({
        // Figure out how to get this token from the currently authenticated org
        'Authorization': 'OAuth 00D1y0000002Ehp!ARwAQJXzqfo9lgysCO_c2E9jsKGQlv9dn1SYzSQCtl6zjsZuCo5Kor9xumJ5G7Twg3z0BiBbQzLyAc9dbmi.yxY3W4HP7iY2',
        // 'Authorization': 'OAuth 00D9D0000001gFv!ARQAQKUgnmGlSHnveioc0IAHUUjGHzaTOve1g8q23YZBtxUMe.76NOBVOr3LaRDVmtbpGpzIyEtfmDXCpitCqgRhm1q4J92C',
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
      body: JSON.stringify({
        apexType: 'c.AccountRemoter.getAccount'
      }),

    }
  ).then((response) => {
    console.log(response);
    return response.json();
  }).then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error(error);
  });

  // const accountName: string = '';
  // Visualforce.remoting.Manager.invokeAction(
  //   '{!$RemoteAction.AccountRemoter.getAccount}',
  //   accountName,
  //   function (result: any, event: any) {
  //     console.log({ result, event });
  //     if (event.status) {
  //       // Get DOM IDs for HTML and Visualforce elements like this
  //       document.getElementById('remoteAcctId').innerHTML = result.Id
  //       document.getElementById(
  //         "{!$Component.block.blockSection.secondItem.acctNumEmployees}"
  //       ).innerHTML = result.NumberOfEmployees;
  //     } else if (event.type === 'exception') {
  //       document.getElementById("responseErrors").innerHTML =
  //         event.message + "<br/>\n<pre>" + event.where + "</pre>";
  //     } else {
  //       document.getElementById("responseErrors").innerHTML = event.message;
  //     }
  //   },
  //   { escape: true }
  // );

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
