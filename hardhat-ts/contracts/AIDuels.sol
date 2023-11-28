// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIDuels is Ownable {
    
    enum DuelState { Created, Finished }

    IERC20 public immutable XP;
    uint constant decimals = 18;
    uint amountToPlay = 2 * 10**decimals;
    uint amountToWin = 4 * 10**decimals;
    uint amountToClaim = 2 * 10**decimals;

    struct Duel {
        uint id;
        address player;
        uint256 createdAt;
        bool claimedWinnings;
    }
    
    Duel[] public duels;

    mapping (address => bool) public hasClaimedReward;

    event DuelCreated(uint256 id);
    event DuelFinished(uint256 id, address winner);
    event RewardClaimed(address winner);

    constructor(address _tokenAddress) {
        XP = IERC20(_tokenAddress);
    }

    function createDuel() public payable {
        require(XP.balanceOf(msg.sender) >= amountToPlay, 'Insufficient XP tokens');
        require(XP.allowance(msg.sender, address(this)) >= amountToPlay, 'XP tokens must be approved');
        require(msg.sender != address(0), "Sender must not be the zero address");

        Duel memory newDuel = Duel({
            id: duels.length,
            player: msg.sender,
            createdAt: block.timestamp,
            claimedWinnings: false
        });

        duels.push(newDuel);

        require(XP.transferFrom(msg.sender, address(this), amountToPlay), "Token transfer failed!");

        emit DuelCreated(newDuel.id);
    }

    function finishDuel(uint256 _duelId) public onlyOwner {
        require(_duelId < duels.length, 'Duel does not exist');
        require(duels[_duelId].player != address(0), "Player must not be the zero address");
        require(duels[_duelId].claimedWinnings != true, 'Winnings already claimed');

        Duel storage duel = duels[_duelId];

        require(msg.sender == duel.player, 'Only player can finish duel');

        bool tokensSent = XP.transfer(msg.sender, amountToWin);

        require(tokensSent, "Token transfer failed!");

        duel.claimedWinnings = true;

        emit DuelFinished(_duelId, msg.sender);
    }

    function claimReward() public {
        require(hasClaimedReward[msg.sender] != true, 'Reward already claimed');

        bool tokensSent = XP.transfer(msg.sender, amountToClaim);

        require(tokensSent, "Token transfer failed!");

        hasClaimedReward[msg.sender] = true;

        emit RewardClaimed(msg.sender);
    }

    function claimedReward(address _wallet) public view returns (bool) {
        return hasClaimedReward[_wallet];
    }

    function buyTokens() public payable {
        require(msg.value == 0.02 ether, "0.02 ether required");
        XP.transfer(msg.sender, 2 * 10**decimals);
    }

    function getDuelsCount() public view returns (uint256) {
        return duels.length;
    }

    function getDuel(uint256 _duelId) public view returns (Duel memory) {
        return duels[_duelId];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getDuels() public view returns (Duel[] memory) {
        return duels;
    }

    function getTokenBalance(address _wallet) public view returns (uint256) {
        return XP.balanceOf(_wallet);
    }

    function getTokenAllowance(address _wallet) public view returns (uint256) {
        return XP.allowance(_wallet, address(this));
    }

    function getTokenBalanceContract() public view returns (uint256) {
        return XP.balanceOf(address(this));
    }

    function getTokenAllowanceContract() public view returns (uint256) {
        return XP.allowance(address(this), address(this));
    }

    function withdrawToken() public onlyOwner {
        XP.transfer(owner(), XP.balanceOf(address(this)));
    }

    function setupGame(uint256 _amountToPlay, uint256 _amountToWin, uint256 _amountToClaim) public onlyOwner {
        amountToPlay = _amountToPlay;
        amountToWin = _amountToWin;
        amountToClaim = _amountToClaim;
    }


    function approveToken(uint256 _amount) public onlyOwner {
        XP.approve(address(this), _amount);
    }

    function fundGame(uint256 _amount) public onlyOwner {
        bool sendTokens = XP.transferFrom(msg.sender, address(this), _amount);
        require(sendTokens, "Token transfer failed!");
    }
}