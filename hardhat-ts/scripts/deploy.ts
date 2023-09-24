const hre = require('hardhat');

async function main() {
  const Duels = await hre.ethers.getContractFactory('Duels');
  const duels = await Duels.deploy();

  await duels.waitForDeployment();

  console.log('Contract Deployed at ' + duels.target);

  const FreeDuels = await hre.ethers.getContractFactory('FreeDuels');
  const freeDuels = await FreeDuels.deploy(duels.target);

  await freeDuels.waitForDeployment();

  console.log('Contract Deployed at ' + freeDuels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
