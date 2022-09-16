// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact x@bruno.pro
contract Token is ERC1155, AccessControl, ERC1155Supply {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => string) private _tokenUri;
    string public _baseExtension = ".json";

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        setURI(uri, 0);
    }

    function setURI(string memory newuri, uint256 tokenId)
        public
        onlyRole(URI_SETTER_ROLE)
    {
        _tokenUri[tokenId] = newuri;
    }

    function setURIs(
        string memory newuri,
        uint256 tokenIdFrom,
        uint256 tokenIdTo
    ) public onlyRole(URI_SETTER_ROLE) {
        for (uint256 i = tokenIdFrom; i <= tokenIdTo; i++) {
            _tokenUri[i] = newuri;
        }
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return
            bytes(_tokenUri[tokenId]).length > 0
                ? _tokenUri[tokenId]
                : _tokenUri[0];
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    // opensea
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(
            exists(tokenId),
            "ERC1155Metadata: URI query for nonexistent token"
        );

        string memory _uri = uri(tokenId);
        return
            bytes(_uri).length > 0
                ? string(
                    abi.encodePacked(
                        _uri,
                        Strings.toString(tokenId),
                        _baseExtension
                    )
                )
                : "";
    }

    // total badges
    function totalSupplies() public view returns (uint256) {
        uint256 i = 1;
        uint256 _totalSupplies = 0;

        while (exists(i)) {
            _totalSupplies += totalSupply(i);
            i++;
        }

        return _totalSupplies;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
