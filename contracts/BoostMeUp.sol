//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;



contract  BoostMeUp{

    // State Variables
    address public owner;
    uint256 public projectTax;
    uint256 public projectCount;
    uint256 public balance;
    statsStruct public stats;
    projectStruct[] projects;


    // Mappings
    mapping(address => projectStruct[]) public projectsOf;   // array of projectStruct a particular address started
    mapping(uint256 => backerStruct[]) public backersOf;    //  array of backerStruct backed to a particular project with some project id
    mapping(uint256 => bool) public projectExist;          //  a particular project with project some id exists or not

    // Enum =>  (Project's Status)
    enum statusEnum{
        OPEN,
        APPROVED,
        REVERTED,
        DELETED,
        PAIDOUT
    }

    struct statsStruct{
        uint256 totalProjects;
        uint256 totalBacking;
        uint256 totalDonations;
    }

    struct backerStruct{
        address owner;
        uint256 contribution;
        uint256 timestamp;
        bool refunded;   // if a required total amount for project is not backed completely then the amount back by a backers is refunded
    }

    struct projectStruct{
        uint256 id;
        address owner;
        string title;
        string description;
        string imageURL;
        uint256 cost;    // amount required for a project
        uint256 raised;  // amount actually raised
        uint256 timestamp;
        uint256 expiresAt;
        uint256 backers;
        statusEnum status;
    }


    // Modifier
    modifier ownerOnly(){
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    // Event
    event Action(
        uint256 id,
        string actionType,
        string indexed executor,
        uint256 timestamp
    );

    // Constructor
    constructor(uint256 _projectTax){
        owner = msg.sender;
        projectTax = _projectTax;
    }






}