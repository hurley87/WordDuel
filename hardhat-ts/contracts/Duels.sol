// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Duels is Ownable {
    
    enum DuelState { Created, Accepted, Finished, Cancelled }

    uint256 public constant FEE = 0.00093 ether;

    struct Duel {
        uint id;
        address challenger;
        address opponent;
        string email;
        string targetWord;
        address currentPlayer;
        string words;
        uint256 moveAmount;
        uint256 potAmount;
        uint256 createdAt;
        uint256 finishedAt;
        DuelState state;
    }
    
    Duel[] public duels;

    mapping (address => uint[]) public myDuels;

    event DuelCreated(uint256 id);
    event DuelAccepted(uint256 id);
    event DuelFinished(uint256 id, address winner);
    event DuelCancelled(uint256 id);
    event DuelMove(uint256 id, address currentPlayer);

    function createDuel(string memory _email, string memory _targetWord) public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        uint duelCounter = duels.length;

        Duel memory newDuel = Duel({
            id: duelCounter,
            challenger: msg.sender,
            opponent: address(0),
            email: _email,
            targetWord: _targetWord,
            currentPlayer: msg.sender,
            words: "",
            moveAmount: msg.value - FEE,
            potAmount: msg.value - FEE,
            createdAt: block.timestamp,
            finishedAt: 0,
            state: DuelState.Created
        });

        duels.push(newDuel);

        myDuels[msg.sender].push(duelCounter);
        
        emit DuelCreated(duelCounter);
    }

    function cancelDuel(uint256 _duelId) public {
        require(duels[_duelId].challenger == msg.sender, "Only the challenger can cancel the duel");
        require(duels[_duelId].state == DuelState.Created, "Duel must be not be accepted yet");

        duels[_duelId].state = DuelState.Cancelled;

        payable(msg.sender).transfer(duels[_duelId].potAmount);

        emit DuelCancelled(_duelId);
    }

    function acceptDuel(uint256 _duelId) public payable {
        require(duels[_duelId].state == DuelState.Created, "Duel must not be accepted yet");
        // require(msg.value == duels[_duelId].moveAmount, "Amount must be equal to the challenger's move amount");

        duels[_duelId].opponent = msg.sender;
        duels[_duelId].potAmount += msg.value;
        duels[_duelId].state = DuelState.Accepted;

        myDuels[msg.sender].push(_duelId);

        emit DuelAccepted(_duelId);
    }

    function makeMove(uint256 _duelId, string memory _word) public {
        require(duels[_duelId].state == DuelState.Accepted, "Duel must be accepted");
        require(duels[_duelId].currentPlayer == msg.sender, "Only the current player can make a move");

        if(keccak256(abi.encodePacked(_word)) == keccak256(abi.encodePacked(duels[_duelId].targetWord))) {
            duels[_duelId].state = DuelState.Finished;
            duels[_duelId].finishedAt = block.timestamp;
            payable(duels[_duelId].currentPlayer).transfer(duels[_duelId].potAmount);

            emit DuelFinished(_duelId, duels[_duelId].currentPlayer);
        } else {
            duels[_duelId].words = string(abi.encodePacked(duels[_duelId].words, ",", _word));

            if(duels[_duelId].currentPlayer == duels[_duelId].challenger) {
                duels[_duelId].currentPlayer = duels[_duelId].opponent;
            } else {
                duels[_duelId].currentPlayer = duels[_duelId].challenger;
            }

            emit DuelMove(_duelId, duels[_duelId].currentPlayer);
        }

    }

    function getDuelsCount() public view returns (uint256) {
        return duels.length;
    }

    function getMyDuelsCount(address _wallet) public view returns (uint256) {
        return myDuels[_wallet].length;
    }

    function getDuel(uint256 _duelId) public view returns (Duel memory) {
        return duels[_duelId];
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function withdrawPortion(uint256 _amount) public onlyOwner {
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyDuels(address _wallet) public view returns (uint[] memory) {
        return myDuels[_wallet];
    }
    
    function getDuels() public view returns (Duel[] memory) {
        return duels;
    }

}
