const hre = require('hardhat');

async function main() {
  // const XP = await hre.ethers.getContractFactory('XP');
  // const xp = await XP.deploy();

  // await xp.waitForDeployment();

  // console.log('XP Deployed at ' + xp.target);

  // const gelatoAddress = '0xd8253782c45a12053594b9deB72d8e8aB2Fca54c';
  // // const xpAddress = '0x2E49832Ee5E72BD443F905b363e966ca3217ae59';
  const AIDuels = await hre.ethers.getContractFactory('AIDuels');
  // const aiduels = await AIDuels.deploy(xpAddress, gelatoAddress);
  const aiduels = await AIDuels.deploy();

  await aiduels.waitForDeployment();

  console.log('Duels AI Deployed at ' + aiduels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
