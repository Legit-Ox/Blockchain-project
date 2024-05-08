const express = require("express");
const bodyParser = require("body-parser");
const shell = require("shelljs");
const app = express();
const port = 3001;
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
var address;

app.post("/deploy", (req, res) => {
  // Extract the parameters from the request body
  const deploymentsPath = path.join(__dirname, "./ignition/deployments");

  fs.rmdir(deploymentsPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Failed to delete directory:", err);
      return;
    }

    console.log("Deployments directory deleted successfully");

    // Continue with the rest of your code...
  });
  const { tokenName, abbreviation, reserveRatio } = req.body;
  console.log("Token Name:", tokenName);
  console.log("Abbreviation:", abbreviation);
  console.log("Reserve Ratio:", reserveRatio);

  //print all of the above variables on shell
  const filePath = path.join(__dirname, "./ignition/modules/FinalBancor.js");

  // Read the FinalBancor.js file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Replace the default values with the new values
    let result = data.replace(/"TokenName"/g, `"${tokenName}"`);
    result = result.replace(/"TN"/g, `"${abbreviation}"`);
    result = result.replace(/50/g, reserveRatio);

    // Write the new data to the FinalBancor.js file
    fs.writeFile(filePath, result, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }

      shell.exec(
        `echo y |  npx hardhat ignition deploy --network polygonAmoy ./ignition/modules/FinalBancor.js`,
        (code, stdout, stderr) => {
          console.log("Exit code:", code);
          console.log("Program output:", stdout);
          console.log("Program stderr:", stderr);

          // Run the 'npx hardhat verify' command here...

          const match = stdout.match(/0x[a-fA-F0-9]{40}/);
          address = match ? match[0] : null;
          console.log("Deployed contract address:", address);

          // Run the 'npx hardhat verify' command here...
          shell.exec(
            `npx hardhat verify ${address} --network polygonAmoy ${tokenName} ${abbreviation} ${reserveRatio}`,
            (code, stdout, stderr) => {
              console.log("Exit code:", code);
              console.log("Program output:", stdout);
              console.log("Program stderr:", stderr);
            }
          );
          result = data.replace(
            new RegExp(`"${tokenName}"`, "g"),
            '"TokenName"'
          );
          result = result.replace(new RegExp(`"${abbreviation}"`, "g"), '"TN"');
          result = result.replace(new RegExp(reserveRatio, "g"), "50");
          fs.writeFile(filePath, result, "utf8", (err) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log("FinalBancor.js file restored successfully");
          });

          res.send(address);
        }
      );
    });
  });
});
