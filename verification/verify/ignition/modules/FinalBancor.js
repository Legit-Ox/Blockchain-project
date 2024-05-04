const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FinalBancor", (m) => {
  const ERC20 = m.contract("FinalBancor", ["SaahilDoshi", "SD", 50]);
  console.log(ERC20);
  return { Address: ERC20 };
});
