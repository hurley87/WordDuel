const hre = require('hardhat');

async function main() {
  // const XP = await hre.ethers.getContractFactory('XP');
  // const xp = await XP.deploy();

  // await xp.waitForDeployment();

  // console.log('XP Deployed at ' + xp.target);

  const AIDuels = await hre.ethers.getContractFactory('AIDuels');
  const aiduels = await AIDuels.deploy(
    '0xE26Bc4d0eBDbf563315a953Dc9f59D58cdd31E97'
  );

  await aiduels.waitForDeployment();

  console.log('Duels AI Deployed at ' + aiduels.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
