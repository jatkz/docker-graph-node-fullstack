pragma solidity ^0.8.0;

/*
    Bancor Formula interface
*/
abstract contract IBancorFormula {
    function calculatePurchaseReturn(
        uint256 _supply,
        uint256 _connectorBalance,
        uint32 _connectorWeight,
        uint256 _depositAmount
    ) public view virtual returns (uint256);

    function calculateSaleReturn(
        uint256 _supply,
        uint256 _connectorBalance,
        uint32 _connectorWeight,
        uint256 _sellAmount
    ) public view virtual returns (uint256);
}
