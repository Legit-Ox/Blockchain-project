const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TestUSDC", (m) => {
  const TestUSDC = m.contract("TestUSDC", [], {
    // Constructor arguments can be passed here if needed
  });

  return { TestUSDC };
});
