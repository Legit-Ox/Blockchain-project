# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# sample-hardhat-Repo


# Latest Polygon Amoy Deployment commands

### Compile

- first compile contract in contracts directory

```shell
npx hardhat compile
```

- Then deploy:

### Deployment through ignition

- Need to add OKX key for deployment variable if any is required in the hardhat config js file 

### After compilation need to setup variable key for etherscan verification which will okx api key for amoy polygon as only require for verification

```shell
  npx hardhat vars set OKLINK_AMOY_API
```

- Then paste the key in cmd and set it. It will convey configuration variable has been stored.

- After that deploy using the command

```shell
npx hardhat ignition deploy ignition/modules/Token.js --network polygonAmoy
```

- It will start the deployment after asking some question just type y.

- After this once deployment is completed it will return the contract address which will not be verified but since the key is setup we can verify OKLINK_AMOY_API is already setup.

### Latest Token Address (Polygon Amoy Testnet):

- Token#Token - 0xA05CBF01fcf82C9Aa3fC6F33c3f051887a92d3ca

# For Verification

- Use Command for Token contract verification

```shell
npx hardhat verify 0xA05CBF01fcf82C9Aa3fC6F33c3f051887a92d3ca --network polygonAmoy
```

- It will verify the contract on the Polygon Amoy test network

### URL for Token 
Address URL : https://www.oklink.com/amoy/address/0xA05CBF01fcf82C9Aa3fC6F33c3f051887a92d3ca/contract