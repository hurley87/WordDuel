// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenDuels is Ownable {
    
    enum DuelState { Created, Accepted, Finished, Cancelled }

    uint256 public constant FEE = 0.000777 ether;

    struct Duel {
        uint id;
        address challenger;
        address opponent;
        address currentPlayer;
        string targetWord;
        string words;
        uint256 moveAmount;
        uint256 potAmount;
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

    function createDuel(string memory _targetWord) public payable {
        require(msg.value > FEE, "Amount must be greater than 0.000777 ETH");

        uint duelCounter = duels.length;

        Duel memory newDuel = Duel({
            id: duelCounter,
            challenger: msg.sender,
            opponent: address(0),
            targetWord: _targetWord,
            currentPlayer: msg.sender,
            words: "",
            moveAmount: msg.value,
            potAmount: msg.value - FEE,
            createdAt: block.timestamp,
            moveCount: 0,
            state: DuelState.Created
        });

        duels.push(newDuel);

        myDuels[msg.sender].push(duelCounter);

        payable(owner()).transfer(FEE);
        
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
        require(msg.value == duels[_duelId].moveAmount, "Amount must be equal to the challenger's move amount");

        duels[_duelId].opponent = msg.sender;
        duels[_duelId].potAmount += msg.value;
        duels[_duelId].state = DuelState.Accepted;

        myDuels[msg.sender].push(_duelId);

        duels[_duelId].currentPlayer = msg.sender;

        emit DuelAccepted(_duelId);
    }

    function makeMove(uint256 _duelId, string memory _word) public payable {
        require(duels[_duelId].state == DuelState.Accepted, "Duel must be accepted");
        require(duels[_duelId].currentPlayer == msg.sender, "Only the current player can make a move");
        require(msg.value == duels[_duelId].moveAmount, "Amount must be equal to the challenger's move amount");
        
        duels[_duelId].potAmount += msg.value;

        duels[_duelId].words = string(abi.encodePacked(duels[_duelId].words, ",", _word));
        
        if(keccak256(abi.encodePacked(_word)) == keccak256(abi.encodePacked(duels[_duelId].targetWord))) {
            duels[_duelId].state = DuelState.Finished;
            payable(duels[_duelId].currentPlayer).transfer(duels[_duelId].potAmount);
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
                payable(duels[_duelId].challenger).transfer(duels[_duelId].potAmount / 2);
                payable(duels[_duelId].opponent).transfer(duels[_duelId].potAmount / 2);
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

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyDuels(address _wallet) public view returns (uint[] memory) {
        return myDuels[_wallet];
    }
    
    function getDuels() public view returns (Duel[] memory) {
        return duels;
    }

    function getAcceptedDuels() public view returns (Duel[] memory) {
        Duel[] memory acceptedDuels = new Duel[](duels.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < duels.length; i++) {
            if(duels[i].state == DuelState.Accepted) {
                acceptedDuels[counter] = duels[i];
                counter++;
            }
        }
        return acceptedDuels;
    } 

    function getFinishedDuels() public view returns (Duel[] memory) {
        Duel[] memory finishedDuels = new Duel[](duels.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < duels.length; i++) {
            if(duels[i].state == DuelState.Finished) {
                finishedDuels[counter] = duels[i];
                counter++;
            }
        }
        return finishedDuels;
    }

    function getCancelledDuels() public view returns (Duel[] memory) {
        Duel[] memory cancelledDuels = new Duel[](duels.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < duels.length; i++) {
            if(duels[i].state == DuelState.Cancelled) {
                cancelledDuels[counter] = duels[i];
                counter++;
            }
        }
        return cancelledDuels;
    }

    function getCreatedDuels() public view returns (Duel[] memory) {
        Duel[] memory createdDuels = new Duel[](duels.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < duels.length; i++) {
            if(duels[i].state == DuelState.Created) {
                createdDuels[counter] = duels[i];
                counter++;
            }
        }
        return createdDuels;
    }

    function getWins(address _wallet) public view returns (uint[] memory) {
        return wins[_wallet];
    }

    function getLosses(address _wallet) public view returns (uint[] memory) {
        return losses[_wallet];
    }

    function getDraws(address _wallet) public view returns (uint[] memory) {
        return draws[_wallet];
    }

}
