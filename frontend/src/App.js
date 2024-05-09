import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import functionPlot from "function-plot";

function App() {
  // const [walletAddress, setWalletAddress] = useState("");
  const [textField1, setTextField1] = useState("");
  const [textField2, setTextField2] = useState("");
  const [textField3, setTextField3] = useState("50");
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  // const [equation, setEquation] = useState("");
  // const handleEquationChange = (event) => {
  //   setEquation(event.target.value);
  // };
  const [loading, setLoading] = useState(false);

  function handleButtonClick() {
    console.log("Button clicked");

    // Here you can use the text field values as needed
    console.log("Text Field 1:", textField1);
    console.log("Text Field 2:", textField2);
    console.log("Text Field 3:", textField3);
    setLoading(true);

    // Make a POST request to the <bac></bac>kend
    axios
      .post("http://localhost:3001/deploy", {
        tokenName: textField1,
        abbreviation: textField2,
        reserveRatio: textField3,
      })
      .then((response) => {
        console.log(response.data);
        setAddress(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    const reserveRatio = Number(textField3);

    functionPlot({
      target: "#graph-container",
      width: 600,
      data: [
        {
          fn: `(x ^ ((100/${reserveRatio})-1))`, // replace 0.2 with your reserve ratio
          sampler: "builtIn",
          graphType: "polyline",
          strokeWidth: 2,
        },
      ],
      xAxis: {
        domain: [0, 100], // replace with your desired x-axis range
      },
      yAxis: {
        domain: [0, 100], // replace with your desired y-axis range
      },
    });
  }, [textField3]);

  async function requestAccount() {
    console.log("Requesting Account.......");
    if (window.ethereum) {
      console.log("Detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (error) {
        console.log("Error connecting...");
      }
    } else {
      console.log("Meta mask not detected.");
    }
  }

  // // Function to handle the button click
  // function handleButtonClick() {
  //   console.log("Button clicked");
  //   // Here you can use the text field values as needed
  //   console.log("Text Field 1:", textField1);
  //   console.log("Text Field 2:", textField2);
  //   console.log("Text Field 3:", textField3);
  // }

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <button onClick={requestAccount}>
            {isConnected ? "Connected" : "Connect Wallet"}
          </button>
          <h3>Wallet Address: {walletAddress}</h3>
        </nav>
        <main className="main-content">
          <div className="form-container">
            <div className="form-section">
              <div>Name</div>
              <input
                type="text"
                value={textField1}
                onChange={(e) => setTextField1(e.target.value)}
                placeholder="Name"
              />
              <div>Symbol</div>
              <input
                type="text"
                value={textField2}
                onChange={(e) => setTextField2(e.target.value)}
                placeholder="Symbol"
              />
              <div>Reserve Ratio</div>
              <input
                type="number"
                value={textField3}
                onChange={(e) => setTextField3(e.target.value)}
                placeholder="Reserve Ratio"
                min="0"
                max="100"
              />
              <button onClick={handleButtonClick} disabled={loading}>
                Deploy
              </button>
              {/* ... */}
              {loading ? <p>Loading...</p> : <p>Address: {address}</p>}
              {/* ... */}{" "}
              {!loading && address && (
                <button
                  onClick={() =>
                    window.open(
                      `https://www.okx.com/web3/explorer/amoy/address/${address}/contract`,
                      "_blank"
                    )
                  }
                >
                  Go to Page To interact
                </button>
              )}
            </div>
            <div id="graph-container"></div>
          </div>
        </main>
      </header>
    </div>
  );
}

export default App;
