// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AIDuels is Ownable {
    
    uint amountToPlay = 0.01 ether;
    uint amountToWin = 0.02 ether;

    struct Duel {
        uint id;
        address player;
        uint256 createdAt;
        bool claimedWinnings;
    }
    
    Duel[] public duels;

    event DuelCreated(uint256 id, address player);
    event DuelFinished(uint256 id, address winner);

    function createDuel() public payable {
        require(msg.value == amountToPlay, "Must send 0.01 ether");
        require(msg.sender != address(0), "Sender must not be the zero address");

        Duel memory newDuel = Duel({
            id: duels.length,
            player: msg.sender,
            createdAt: block.timestamp,
            claimedWinnings: false
        });

        duels.push(newDuel);

        emit DuelCreated(newDuel.id, msg.sender);
    }

    function finishDuel(uint256 _duelId) public onlyOwner {
        require(_duelId < duels.length, 'Duel does not exist');
        require(duels[_duelId].player != address(0), "Player must not be the zero address");
        require(duels[_duelId].claimedWinnings != true, 'Winnings already claimed');

        Duel storage duel = duels[_duelId];

        payable(duel.player).transfer(amountToWin);

        duel.claimedWinnings = true;

        emit DuelFinished(_duelId, duel.player);
    }

    function getDuelsCount() public view returns (uint256) {
        return duels.length;
    }

    function getDuel(uint256 _duelId) public view returns (Duel memory) {
        return duels[_duelId];
    }
    
    function getDuels() public view returns (Duel[] memory) {
        return duels;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}