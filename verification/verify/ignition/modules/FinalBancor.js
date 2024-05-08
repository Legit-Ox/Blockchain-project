const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FinalBancor", (m) => {
  // Get the command-line arguments
  const tokenName = process.env.TOKEN_NAME || "BancorCurveToken";
  const abbreviation = process.env.ABBREVIATION || "BCT";
  const reserveRatio = process.env.RESERVE_RATIO || 50;

  const ERC20 = m.contract("FinalBancor", [
    tokenName,
    abbreviation,
    reserveRatio,
  ]);
  console.log(ERC20);
  return { Address: ERC20 };
});
