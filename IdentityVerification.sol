// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityVerification {
    struct Identity {
        string name;
        uint256 dob; // Date of birth as timestamp
        string idNumber;
        address walletAddress;
        bool verified;
    }

    mapping(address => Identity) public identities;
    mapping(string => address) private idToAddress;
    address public admin;

    event IdentityRegistered(address indexed userAddress, string name);
    event IdentityVerified(address indexed userAddress, bool verified);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerIdentity(
        string memory _name,
        uint256 _dob,
        string memory _idNumber
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_dob > 0, "Invalid date of birth");
        require(bytes(_idNumber).length > 0, "ID number cannot be empty");
        require(identities[msg.sender].walletAddress == address(0), "Identity already registered");
        require(idToAddress[_idNumber] == address(0), "ID number already in use");

        identities[msg.sender] = Identity({
            name: _name,
            dob: _dob,
            idNumber: _idNumber,
            walletAddress: msg.sender,
            verified: false
        });

        idToAddress[_idNumber] = msg.sender;
        emit IdentityRegistered(msg.sender, _name);
    }

    function verifyIdentity(address _userAddress, bool _status) external onlyAdmin {
        require(identities[_userAddress].walletAddress != address(0), "Identity not found");
        identities[_userAddress].verified = _status;
        emit IdentityVerified(_userAddress, _status);
    }

    // FIXED: Remove the require statement so it doesn't revert for non-existent identities
    function getIdentity(address _userAddress) external view returns (
        string memory,
        uint256,
        string memory,
        bool
    ) {
        Identity memory identity = identities[_userAddress];
        // Return the identity data regardless of whether it exists or not
        // Empty strings and zero values will be returned for non-existent identities
        return (
            identity.name,
            identity.dob,
            identity.idNumber,
            identity.verified
        );
    }

    // ADDED: Helper function to check if identity exists
    function identityExists(address _userAddress) external view returns (bool) {
        return identities[_userAddress].walletAddress != address(0);
    }

    // ADDED: Helper function to check if ID number is already used
    function isIdNumberUsed(string memory _idNumber) external view returns (bool) {
        return idToAddress[_idNumber] != address(0);
    }
}
