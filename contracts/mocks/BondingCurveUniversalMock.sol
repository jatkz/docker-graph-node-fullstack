pragma solidity ^0.8.0;

import "../BondingCurveUniversal.sol";

contract BondingCurveUniversalMock is BondingCurveUniversal {
    constructor(
        uint256 _totalSupply,
        uint256 _poolBalance,
        uint32 _reserveRatio
    ) public {
        reserveRatio = _reserveRatio;
        _totalSupply = _totalSupply;
        poolBalance = _poolBalance;

        gasPrice = 26 * (10**9);
    }
}
