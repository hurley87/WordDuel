// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIDuelsFree is ERC2771Context, Ownable {
    
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

    event DuelCreated(uint256 id, address player);
    event DuelFinished(uint256 id, address winner);
    event RewardClaimed(address winner);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event BuyTokens(address indexed buyer, uint256 value);

    constructor(address _tokenAddress, address _gelatoRelay) ERC2771Context(_gelatoRelay) {
        XP = IERC20(_tokenAddress);
    }

    function createDuel() public payable {
        require(XP.balanceOf(_msgSender()) >= amountToPlay, 'Insufficient XP tokens');
        require(XP.allowance(_msgSender(), address(this)) >= amountToPlay, 'XP tokens must be approved');
        require(_msgSender() != address(0), "Sender must not be the zero address");

        Duel memory newDuel = Duel({
            id: duels.length,
            player: _msgSender(),
            createdAt: block.timestamp,
            claimedWinnings: false
        });

        duels.push(newDuel);

        require(XP.transferFrom(_msgSender(), address(this), amountToPlay), "Token transfer failed!");

        emit DuelCreated(newDuel.id, _msgSender());
    }

    function finishDuel(uint256 _duelId) public {
        require(_duelId < duels.length, 'Duel does not exist');
        require(duels[_duelId].player != address(0), "Player must not be the zero address");
        require(duels[_duelId].claimedWinnings != true, 'Winnings already claimed');

        Duel storage duel = duels[_duelId];

        require(_msgSender() == duel.player, 'Only player can finish duel');

        bool tokensSent = XP.transfer(_msgSender(), amountToWin);

        require(tokensSent, "Token transfer failed!");

        duel.claimedWinnings = true;

        emit DuelFinished(_duelId, _msgSender());
    }

    function claimReward() public {
        require(hasClaimedReward[_msgSender()] != true, 'Reward already claimed');

        bool tokensSent = XP.transfer(_msgSender(), amountToClaim);

        require(tokensSent, "Token transfer failed!");

        hasClaimedReward[_msgSender()] = true;

        emit RewardClaimed(_msgSender());
    }

    function claimedReward(address _wallet) public view returns (bool) {
        return hasClaimedReward[_wallet];
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


    function approveToken(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        XP.approve(address(this), _amount);
        emit Approval(_msgSender(), address(this), _amount);
    }

    function fundGame(uint256 _amount) public onlyOwner {
        bool sendTokens = XP.transferFrom(_msgSender(), address(this), _amount);
        require(sendTokens, "Token transfer failed!");
    }

    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

}