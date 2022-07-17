pragma solidity ^0.8.0;

/*
    Bancor Formula interface
*/
abstract contract ISimpleCurveFormula {
    function calculateBuyReturn(uint256 _supply, uint256 _value)
        public
        view
        virtual
        returns (uint256, uint256);

    function calculateSaleReturn(uint256 _supply, uint256 _amount)
        public
        view
        virtual
        returns (uint256);

    function calculateBuyCost(uint256 _supply, uint256 _amount)
        public
        view
        virtual
        returns (uint256);

    function calculateSaleCost(uint256 _supply, uint256 _value)
        public
        view
        virtual
        returns (uint256);
}
