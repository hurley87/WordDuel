const hre = require('hardhat');

async function main() {
  const NFT = await hre.ethers.getContractFactory('Duels');
  const nft = await NFT.deploy();

  await nft.waitForDeployment();

  console.log('NFT Contract Deployed at ' + nft.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
