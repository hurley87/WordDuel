//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XP is IERC20, Ownable {

    uint public override totalSupply;
    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    string public name = "XP";
    string public symbol = "XP";
    uint public decimals = 18;

    function transfer(address recipient, uint amount) external override returns (bool) {
        balanceOf[_msgSender()] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(_msgSender(), recipient, amount);
        return true;
    }
    
    function approve(address spender, uint amount) external override returns (bool) {
        require(_msgSender() != spender, 'Cannot approve self');
        require(balanceOf[_msgSender()] >= amount, 'Insufficient balance');
        allowance[_msgSender()][spender] = amount;
        emit Approval(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        allowance[sender][_msgSender()] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external onlyOwner {
        balanceOf[_msgSender()] += amount;
        totalSupply += amount;
        emit Transfer(address(0), _msgSender(), amount);
    }

    function burn(uint amount) external {
        balanceOf[_msgSender()] -= amount;
        totalSupply -= amount;
        emit Transfer(_msgSender(), address(0), amount);
    }

}