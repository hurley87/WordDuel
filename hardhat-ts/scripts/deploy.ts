const hre = require('hardhat');

async function main() {
  // const OpenDuels = await hre.ethers.getContractFactory('OpenDuels');
  // const openduels = await OpenDuels.deploy();

  // await openduels.waitForDeployment();

  // console.log('Duels Deployed at ' + openduels.target);

  // const gelatoAddress = '0xd8253782c45a12053594b9deB72d8e8aB2Fca54c';
  // const OpenFreeDuels = await hre.ethers.getContractFactory('OpenFreeDuels');
  // const openfreeduels = await OpenFreeDuels.deploy(gelatoAddress);

  // await openfreeduels.waitForDeployment();

  // console.log('Duels Free open Deployed at ' + openfreeduels.target);

  const XP = await hre.ethers.getContractFactory('XP');
  const xp = await XP.deploy();

  await xp.waitForDeployment();

  console.log('XP Deployed at ' + xp.target);

  const AIDuels = await hre.ethers.getContractFactory('AIDuels');
  const aiduels = await AIDuels.deploy(xp.target);

  await aiduels.waitForDeployment();

  console.log('Duels AI Deployed at ' + aiduels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
