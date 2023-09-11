const hre = require('hardhat');

async function main() {
  const Duels = await hre.ethers.getContractFactory('Duels');
  const duels = await Duels.deploy();

  await duels.waitForDeployment();

  console.log('Contract Deployed at ' + duels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
