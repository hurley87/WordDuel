const hre = require('hardhat');

async function main() {
  // const Duels = await hre.ethers.getContractFactory('Duels');
  // const duels = await Duels.deploy();

  // await duels.waitForDeployment();

  // console.log('Duels Deployed at ' + duels.target);

  // const gelatoAddress = '0xd8253782c45a12053594b9deB72d8e8aB2Fca54c';
  // const FreeDuels = await hre.ethers.getContractFactory('FreeDuels');
  // const freeDuels = await FreeDuels.deploy(gelatoAddress);

  // await freeDuels.waitForDeployment();

  // console.log('FreeDuels Deployed at ' + freeDuels.target);

  // const OpenDuels = await hre.ethers.getContractFactory('OpenDuels');
  // const openduels = await OpenDuels.deploy();

  // await openduels.waitForDeployment();

  // console.log('Duels Deployed at ' + openduels.target);

  const gelatoAddress = '0xd8253782c45a12053594b9deB72d8e8aB2Fca54c';
  const OpenFreeDuels = await hre.ethers.getContractFactory('OpenFreeDuels');
  const openfreeduels = await OpenFreeDuels.deploy(gelatoAddress);

  await openfreeduels.waitForDeployment();

  console.log('Duels Free open Deployed at ' + openfreeduels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
