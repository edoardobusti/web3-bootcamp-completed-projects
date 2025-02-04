// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Factory is ERC1155 {

    address public defenseContractor;

    modifier onlyDefenseContractor() {
        require(msg.sender == defenseContractor, "not authorized entity");
        _;
    }

    constructor() ERC1155("ipfs://QmNfA1EoUfPkXEMQP7KguEioNkZjEJs6TiRJFN2w9UPYWu/") { 
        defenseContractor = msg.sender;
    }

    function mint(address _to, uint256 _id, uint8 _amount, bytes calldata _data) external onlyDefenseContractor {
        _mint(_to, _id, _amount, _data);
    }

    function burn(address _from, uint256 _id, uint8 _amount) external onlyDefenseContractor {
        _burn(_from, _id, _amount);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return string(
            abi.encodePacked(
                super.uri(_id), 
                Strings.toString(_id),
                ".json" 
            )
        );
    }
}

interface IERC1155Factory is IERC1155 {
    function mint(address _to, uint256 _id, uint8 _amount, bytes calldata data) external;
    function burn(address _from, uint256 _id, uint8 _amount) external;
    function balanceOf(address _account, uint256 _id) external view returns (uint256);
    function uri(uint256 _id) external view returns (string memory);
}

contract DefenseContractor {

    IERC1155Factory public factory;

    event FactoryEstablished(address _factory);
    event Created(address indexed _user, uint256 _id);
    event Consumed(address indexed _user, uint256 _id);

    enum Item { GUNPOWDER, METAL, FUEL, BULLET, TANK, FLARE, MISSILE }


    uint256 public constant COOLDOWN_PERIOD = 60;
    mapping(uint256 => uint256) public lastMintTime;

    modifier isValidItem(uint256 _id) {
        require(_id <= 6, "invalidID");
        _;
    }

    constructor() {
        factory = IERC1155Factory(address(new Factory()));
        emit FactoryEstablished(address(factory));
    }

    function orderItem(uint256 _id) external isValidItem(_id){

        Item item = Item(_id);
        
        if (item == Item.GUNPOWDER || item == Item.METAL || item == Item.FUEL) {
            require(block.timestamp >= lastMintTime[uint256(item)] + COOLDOWN_PERIOD, "must wait 60 seconds");

            lastMintTime[_id] = block.timestamp;
            
            _create(uint256(item));
            
            emit Created(msg.sender, uint256(item));
            
        } else {
            _produceSpecialItem(uint256(item));
        }
    }

    function tradeItems(uint256 _toSell, uint256 _toBuy) external isValidItem(_toSell){
        require(_toSell != _toBuy, "you can't trade the same item");
        require(_toBuy <= 2, "you can't trade for this item");
        _create(_toBuy);
        _consume(_toSell);
    }

    function dismantleItem(uint256 _id) external isValidItem(_id){

        require(_id >= 3, "this is not a special item");

        Item item = Item(_id);

        _consume(uint256(item));
        emit Consumed(msg.sender, uint256(item));
    }

    function getBalanceOf(address _account, uint256 _id) external view returns(uint256) {
        return factory.balanceOf(_account, _id);
    }


    function getUri(uint256 _id) external view returns (string memory ) {
        return factory.uri(_id);
    }

    function _produceSpecialItem(uint256 _id) internal {

        Item item = Item(_id);

        if (item == Item.BULLET) {
            _consume(uint256(Item.GUNPOWDER));
            _consume(uint256(Item.METAL));

        } else if (item == Item.TANK) {
            _consume(uint256(Item.METAL));
            _consume(uint256(Item.FUEL));

        } else if (item == Item.FLARE) {
            _consume(uint256(Item.GUNPOWDER));
            _consume(uint256(Item.FUEL));

        } else if (item == Item.MISSILE) {
            _consume(uint256(Item.GUNPOWDER));
            _consume(uint256(Item.METAL));
            _consume(uint256(Item.FUEL));
        }

        _create(uint256(item));
    }

    function _create(uint256 _id) internal {
        factory.mint(msg.sender, _id, 1, "");
        emit Created(msg.sender, _id);
    }

    function _consume(uint256 _id) internal {
        factory.burn(msg.sender, _id, 1);
        emit Consumed(msg.sender, _id);
    }


}