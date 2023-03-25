//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;



contract  BoostMeUp{

    // State Variables
    address public owner;     // contract owner
    uint256 public projectTax;
    uint256 public projectCount;
    uint256 public balance;   // contract balance
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
    function createProject(string memory _title, string memory _description, string memory _imageURL, uint256 _cost, uint256 _expiresAt) public returns(bool){
        require(bytes(_title).length>0, "Title cannot be empty");
        require(bytes(_description).length>0, "Description cannot be empty");
        require(bytes(_imageURL).length>0, "ImageURL cannot be empty");
        require(_cost > 0 ether, "Cost cannot be zero");

        projectStruct memory project;
        project.id = projectCount;
        project.owner = msg.sender;
        project.title = _title;
        project.description = _description;
        project.imageURL = _imageURL;
        project.cost = _cost;
        project.timestamp = block.timestamp;
        project.expiresAt = _expiresAt;

        projects.push(project);
        projectExist[projectCount] = true;
        projectsOf[msg.sender].push(project);
        stats.totalProjects += 1;

        emit Action(projectCount++, "PROJECT CREATED", msg.sender, block.timestamp);
        return true;
    }

    function updateProject(uint256 _id, string memory _title, string memory _description, string memory _imageURL, uint256 _expiresAt) public returns(bool){
        require(msg.sender == projects[_id].owner, "Unauthorized: You are not the owner of this project");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length>0, "Description cannot be empty");
        require(bytes(_imageURL).length>0, "ImageURL cannot be empty");

        projects[_id].title = _title;
        projects[_id].description = _description;
        projects[_id].imageURL  = _imageURL;
        projects[_id].expiresAt  = _expiresAt;

        emit Action(_id, "PROJECT UPDATED", msg.sender, block.timestamp);
        return true;
    }

    function deleteProject(uint256 _id) public returns(bool){
        require(projects[_id].status == statusEnum.OPEN, "Project no longer opened");
        require(msg.sender == projects[_id].owner, "Unauthorized: You are not the owner of this project");

        projects[_id].status = statusEnum.DELETED;

        performRefund(_id);

        stats.totalProjects -= 1;

        emit Action(_id, "PROJECT DELETED", msg.sender, block.timestamp);
        return true;
    }


    function performRefund(uint256 _id) internal{
        for(uint256 i = 0; i < backersOf[_id].length; i++){
            address _owner = backersOf[_id][i].owner;
            uint256 _contribution = backersOf[_id][i].contribution;

            backersOf[_id][i].refunded = true;
            backersOf[_id][i].timestamp= block.timestamp;

            (bool success, ) = payable(_owner).call{value:_contribution}("");
            require(success);

            stats.totalBacking -= 1;
            stats.totalDonations -= _contribution;
        }
    }


    function backProject(uint256 _id) public payable returns(bool){
        require(msg.value > 0 ether, "Ether must be greater than 0");
        require(projectExist[_id], "Project Not Found");
        require(projects[_id].status == statusEnum.OPEN, "Project no longer opened");

        stats.totalBacking += 1;
        stats.totalDonations += msg.value;
        projects[_id].raised += msg.value;
        projects[_id].backers += 1;

        backersOf[_id].push(backerStruct(msg.sender, msg.value, block.timestamp, false));

        emit Action(_id, "PROJECT BACKED", msg.sender, block.timestamp);

        
        // Assigning Project's Status Based on Amount Raised

        if(projects[_id].raised >= projects[_id].cost){
            projects[_id].status = statusEnum.APPROVED;
            balance += projects[_id].raised;

            performPayout(_id);

            return true;
        }

         if(block.timestamp >= projects[_id].expiresAt) {
            projects[_id].status = statusEnum.REVERTED;

            performRefund(_id);

            return true;
        }

        return true;
    }

    function performPayout(uint256 _id) internal{
        uint256 raised = projects[_id].raised;
        uint256 tax = (raised * projectTax) / 100 ;    // %age Tax

        projects[_id].status = statusEnum.PAIDOUT;

            // Paying Amount(tax deducted) To Project Owner
            (bool success, ) = payable(projects[_id].owner).call{value:(raised - tax )}("");
            require(success, "Failed to transfer funds to project owner");

            // Paying Amount(tax) To Contract Owner
            (success, ) = payable(owner).call{value:tax}("");
            require(success, "Failed to transfer funds to contract owner");

            // Updating Contract Balance
            balance -= projects[_id].raised;

            emit Action (_id, "PROJECT PAID OUT", msg.sender, block.timestamp
        );

    }

    function requestRefund(uint256 _id) public returns(bool){
        require(projects[_id].status != statusEnum.REVERTED || projects[_id].status != statusEnum.DELETED, "Project is Reverted or Deleted already");

        projects[_id].status = statusEnum.REVERTED;

        performRefund(_id);

        return true;
    }

    function payOutProject(uint256 _id) public returns(bool){
        require(projects[_id].status == statusEnum.APPROVED, "Project not Approved");
        require(msg.sender == projects[_id].owner || msg.sender == owner, "Unauthorized: You are not the owner of this project");

        performPayout(_id);

        return true;

    }


    



     





    






}