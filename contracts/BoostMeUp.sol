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
        address indexed executor,
        uint256 timestamp
    );

    // Constructor
    constructor(uint256 _projectTax){
        owner = msg.sender;
        projectTax = _projectTax;
    }


    // Functions
    function createProject(string memory title, string memory description, string memory imageURL, uint256 cost, uint256 expiresAt) public returns(bool){
        require(bytes(title).length>0, "Title cannot be empty");
        require(bytes(description).length>0, "Description cannot be empty");
        require(bytes(imageURL).length>0, "ImageURL cannot be empty");
        require(cost > 0 ether, "Cost cannot be zero");

        projectStruct memory project;
        project.id = projectCount;
        project.owner = msg.sender;
        project.title = title;
        project.description = description;
        project.imageURL = imageURL;
        project.cost = cost;
        project.timestamp = block.timestamp;
        project.expiresAt = expiresAt;

        projects.push(project);
        projectExist[projectCount] = true;
        projectsOf[msg.sender].push(project);
        stats.totalProjects += 1;

        emit Action(projectCount++, "PROJECT CREATED", msg.sender, block.timestamp);

        return true;




    }






}