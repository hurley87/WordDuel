// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import {
    ERC2771Context,
    Context
} from "../node_modules/@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract OpenFreeDuels is ERC2771Context, Ownable {
    
    enum DuelState { Created, Accepted, Finished, Cancelled }

    struct Duel {
        uint id;
        address challenger;
        address opponent;
        address currentPlayer;
        string targetWord;
        string words;
        uint256 createdAt;
        uint256 moveCount;
        DuelState state;
    }
    
    Duel[] public duels;

    mapping (address => uint[]) public myDuels;
    mapping (address => uint[]) public wins;
    mapping (address => uint[]) public losses;
    mapping (address => uint[]) public draws;

    event DuelCreated(uint256 id);
    event DuelAccepted(uint256 id);
    event DuelCancelled(uint256 id);
    event DuelMove(uint256 id, address currentPlayer, string words, uint256 moveCount);

    constructor(address _gelatoRelay) ERC2771Context(_gelatoRelay) {}

    function createDuel(string memory _targetWord) public {

        uint duelCounter = duels.length;

        Duel memory newDuel = Duel({
            id: duelCounter,
            challenger: _msgSender(),
            opponent: address(0),
            targetWord: _targetWord,
            currentPlayer: _msgSender(),
            words: "",
            createdAt: block.timestamp,
            moveCount: 0,
            state: DuelState.Created
        });

        duels.push(newDuel);

        myDuels[_msgSender()].push(duelCounter);
        
        emit DuelCreated(duelCounter);
    }

    function cancelDuel(uint256 _duelId) public {
        require(duels[_duelId].challenger == _msgSender(), "Only the challenger can cancel the duel");
        require(duels[_duelId].state == DuelState.Created, "Duel must be not be accepted yet");

        duels[_duelId].state = DuelState.Cancelled;

        emit DuelCancelled(_duelId);
    }

    function acceptDuel(uint256 _duelId) public {
        require(duels[_duelId].state == DuelState.Created, "Duel must not be accepted yet");

        duels[_duelId].opponent = _msgSender();
        duels[_duelId].state = DuelState.Accepted;

        myDuels[_msgSender()].push(_duelId);

        duels[_duelId].currentPlayer = _msgSender();

        emit DuelAccepted(_duelId);
    }

    function makeMove(uint256 _duelId, string memory _word) public {
        require(duels[_duelId].state == DuelState.Accepted, "Duel must be accepted");
        require(duels[_duelId].currentPlayer == _msgSender(), "Only the current player can make a move");
        
        duels[_duelId].words = string(abi.encodePacked(duels[_duelId].words, ",", _word));
        
        if(keccak256(abi.encodePacked(_word)) == keccak256(abi.encodePacked(duels[_duelId].targetWord))) {
            duels[_duelId].state = DuelState.Finished;
            wins[duels[_duelId].currentPlayer].push(_duelId);
            losses[duels[_duelId].currentPlayer == duels[_duelId].challenger ? duels[_duelId].opponent : duels[_duelId].challenger].push(_duelId);
        } else {
            
            if(duels[_duelId].currentPlayer == duels[_duelId].challenger) {
                duels[_duelId].currentPlayer = duels[_duelId].opponent;
            } else {
                duels[_duelId].currentPlayer = duels[_duelId].challenger;
            }

            duels[_duelId].moveCount++;

            if(duels[_duelId].moveCount == 6) {
                duels[_duelId].state = DuelState.Finished;
                draws[duels[_duelId].challenger].push(_duelId);
                draws[duels[_duelId].opponent].push(_duelId);
            } else {
                emit DuelMove(_duelId, duels[_duelId].currentPlayer, duels[_duelId].words, duels[_duelId].moveCount);
            }

        }

    }

    function getDuelsCount() public view returns (uint256) {
        return duels.length;
    }

    function getMyDuelsCount(address _wallet) public view returns (uint256) {
        return myDuels[_wallet].length;
    }

    function getWinsCount(address _wallet) public view returns (uint256) {
        return wins[_wallet].length;
    }

    function getLossesCount(address _wallet) public view returns (uint256) {
        return losses[_wallet].length;
    }

    function getDrawsCount(address _wallet) public view returns (uint256) {
        return draws[_wallet].length;
    }

    function getDuel(uint256 _duelId) public view returns (Duel memory) {
        return duels[_duelId];
    }

    function getMyDuels(address _wallet) public view returns (uint[] memory) {
        return myDuels[_wallet];
    }
    
    function getDuels() public view returns (Duel[] memory) {
        return duels;
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
