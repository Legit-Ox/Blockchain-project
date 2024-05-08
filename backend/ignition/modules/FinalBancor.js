const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FinalBancor", (m) => {
  const tokenName = "TokenName";
  const abbreviation = "TN";
  const reserveRatio = 50;

  const ERC20 = m.contract("FinalBancor", [
    tokenName,
    abbreviation,
    reserveRatio,
  ]);
  console.log(ERC20);
  return { Address: ERC20 };
});
