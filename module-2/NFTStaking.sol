// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Token is ERC20 { 

    address public operator;

    modifier onlyOperator() {
        require(msg.sender == operator, "not operator");
        _;
    }

    constructor() ERC20("Token", "TOKEN") {
        operator = msg.sender;
    }

    function mint(address _to, uint256 _amount) external onlyOperator {
        _mint(_to, _amount);
    }

}

contract Nft is ERC721 {

    uint256 public totalSupply;

    event NftMinted(address indexed to, uint256 indexed tokenId);
    event Withdraw(address indexed to, uint256 amount);

    constructor() ERC721("Nft", "NFT") {}

    function mint() public  {
        _mint(msg.sender, totalSupply);
        totalSupply++;
        
        emit NftMinted(msg.sender, totalSupply);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://****my_cid****/";
    }

}

interface IMintableERC20 is IERC20 {
    function mint(address _to, uint256 _amount) external;
}

contract Staking is IERC721Receiver {
    IMintableERC20 public token;
    IERC721 public nftCollection;

    uint256 public constant REWARD_PER_DAY = 10;

    struct StakeInfo {
        uint256 depositTime;
        uint256 rewardsClaimed;
        bool isStaked;
        address owner;
    }

    mapping(uint256 => StakeInfo) public stakes;

    event TokenDeployed(address indexed token);
    event NftCollectionDeployed(address indexed nftCollection);
    event NftDeposited(address indexed from, address indexed token, uint256 tokenId);
    event NftWithdrawn(address indexed from, uint256 tokenId);
    event RewardsClaimed(address indexed to, uint256 amount);

    modifier onlyCollection() {
        require(msg.sender == address(nftCollection), "Caller is not the approved NFT collection");
        _;
    }

    constructor() {
        token = IMintableERC20(address(new Token()));
        nftCollection = IERC721(address(new Nft()));

        emit TokenDeployed(address(token));
        emit NftCollectionDeployed(address(nftCollection));
    }


    function withdrawNft(uint256 _tokenId) external {
        require(stakes[_tokenId].isStaked, "not staked");
        require(msg.sender == stakes [_tokenId].owner, "not NFT owner");

        uint256 elapsedTime = block.timestamp - stakes[_tokenId].depositTime;

        if (elapsedTime >= 1 days) {
            uint256 totalReward = (elapsedTime / 1 days) * REWARD_PER_DAY;
            uint256 pendingReward = totalReward - stakes[_tokenId].rewardsClaimed;
            if (pendingReward > 0) {
                token.mint(msg.sender, pendingReward);
            }
        }

        stakes[_tokenId] = StakeInfo({
            depositTime: 0,
            rewardsClaimed: 0,
            isStaked: false,
            owner: msg.sender
        });

        nftCollection.safeTransferFrom(address(this), msg.sender, _tokenId);

        emit NftWithdrawn(msg.sender, _tokenId);
    }

    function claimRewards(uint256 _tokenId) public {
        StakeInfo storage stake = stakes[_tokenId];
        require(stake.isStaked, "not staked");
        require(msg.sender == stakes [_tokenId].owner, "not NFT owner");

        uint256 elapsedTime = block.timestamp - stake.depositTime;
        require(elapsedTime >= 1 days, "no rewards yet, try again later");

        uint256 totalReward = (elapsedTime / 1 days) * REWARD_PER_DAY;
        uint256 pendingReward = totalReward - stake.rewardsClaimed;

        require(pendingReward > 0, "no rewards yet, try again later");

        stake.rewardsClaimed = totalReward; 
        token.mint(msg.sender, pendingReward);

        emit RewardsClaimed(msg.sender, pendingReward);
    }


    function onERC721Received (
        address,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external onlyCollection returns (bytes4) {
        require(msg.sender == address(nftCollection));

        _depositNft(tokenId, from);

        emit NftDeposited(from, msg.sender, tokenId); 
        return this.onERC721Received.selector;
    }

    function _depositNft(uint256 _tokenId, address _from) internal {
        require(!stakes[_tokenId].isStaked, "already staked");

        stakes[_tokenId] = StakeInfo({
            depositTime: block.timestamp,
            rewardsClaimed: 0,
            isStaked: true,
            owner: _from
        });
    }

}