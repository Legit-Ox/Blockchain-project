import { ethers } from "hardhat";
import { run,network } from 'hardhat';


async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");

    const deploymentTransaction = simpleStorage.deploymentTransaction();
    if (deploymentTransaction) {
      await deploymentTransaction.wait(6);
    }
    await verify(simpleStorage.target.toString(), []); // Fix: Convert simpleStorage.target to string
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

//verify function in ts




const verify = async (contractAddress: string, args: any[]): Promise<void> => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if ((e as Error).message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
