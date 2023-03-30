//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


   /// @title BoostMeUp (A Crowdfunding contract)
   /// @author Shayan Jamil
   /// @notice A contract that allows users to donate funds to a cause and receive rewards in return
   /// @dev All function calls are currently implemented without side effects
   /// @custom:experimental This is an experimental contract.


contract  BoostMeUp{   

    // ===========================================
                   // State Variables
    // ===========================================

    address private owner;      // contract owner
    uint256 private balance;    // total balance of the contract
    uint8 private projectTax;   // project tax percentage
    uint8 private projectCount; // total number of projects created
    statsStruct private stats;  // statsStruct variable(stats)
    projectStruct[] projects;   // projects : array of projectStructs => [projectStruct, projectStruct, ...]


    
    // ===========================================
                   // Mappings
    // ===========================================

    mapping(address => projectStruct[]) private projectsOf;   // array of projectStruct a particular address started
    mapping(uint8 => backerStruct[]) private backersOf;    //  array of backerStruct backed to a particular project with some project id
    mapping(uint8 => bool) private projectExist;          //  a particular project with project some id exists or not


    // ===========================================
              // Enum =>  (Project's Status)
    // ===========================================
   
    enum statusEnum{
        OPEN,
        APPROVED,
        REVERTED,
        DELETED,
        PAIDOUT
    }


    // ===========================================
                    //  Structs
    // ===========================================

    // contains the statistics of the contract
    struct statsStruct{
        uint256 totalProjects;
        uint256 totalBacking;
        uint256 totalDonations;
    }

    // contains the details of a backer
    struct backerStruct{
        address owner;
        uint256 contribution;
        uint256 timestamp;
        bool refunded;   // if a required total amount for project is not backed completely then the amount back by a backers is refunded
    }

    // contains the details of a project
    struct projectStruct{
        uint256 id;
        address owner;
        string title;
        string description;
        string imageURL;
        uint256 cost;    // amount required for a project
        uint256 raised;  // amount actually raised
        uint256 timestamp;  // when project was created
        uint256 expiresAt;  // when project will expire
        uint256 backers;
        statusEnum status;
    }

   
    // ===========================================
                     // Modifier
    // ===========================================

    modifier ownerOnly(){
        require(msg.sender == owner, "Owner reserved only");
        _;
    }


    // ===========================================
                     // Event
    // ===========================================

    event Action(
        uint256 id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );

    
    // ===========================================
                     // Constructor
    // ===========================================

    constructor(uint8 _projectTax){
        owner = msg.sender;
        projectTax = _projectTax;
    }


    // ===========================================
                     // Functions
    // ===========================================

    /**
     * @dev Create a new project
     * @param _title Title of the project.
     * @param _description Description of the project.
     * @param _imageURL URL of the project's image.
     * @param _cost Total Cost of the project to be backed.
     * @param _expiresAt Timestamp when the project will expire.
     * @return True if the project was created successfully.
     */
    function createProject(string memory _title, string memory _description, string memory _imageURL, uint256 _cost, uint256 _expiresAt) external returns(bool){
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
        projectCount += 1;

        emit Action(projectCount, "PROJECT CREATED", msg.sender, block.timestamp);
        return true;
    }

    /**
     * @dev Update an existing project.
     * @param _id ID of the project to update.
     * @param _title New title of the project.
     * @param _description New description of the project.
     * @param _imageURL New URL of the project's image.
     * @param _expiresAt New timestamp when the project will expire.
     * @return True if the project was updated successfully.
     */
    function updateProject(uint256 _id, string memory _title, string memory _description, string memory _imageURL, uint256 _expiresAt) external returns(bool){
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

    /**
     * @dev Delete an existing project.
     * @param _id ID of the project to delete.
     * @return True if the project was updated successfully.
     */
    function deleteProject(uint8 _id) external returns(bool){
        require(projects[_id].status == statusEnum.OPEN, "Project no longer opened");
        require(msg.sender == projects[_id].owner, "Unauthorized: You are not the owner of this project");

        projects[_id].status = statusEnum.DELETED;

        performRefund(_id);

        stats.totalProjects -= 1;

        emit Action(_id, "PROJECT DELETED", msg.sender, block.timestamp);
        return true;
    }

    /** 
     * @dev Perform refund for all backers of a project.
     * @param _id ID of the project to refund backers.
     */
    function performRefund(uint8 _id) internal{
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

    /**
     * @dev Back a project by sending ether to it.
     * @param _id ID of the project to back.
     * @return True if the project was backed successfully.
     */
    function backProject(uint8 _id) external payable returns(bool){
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

     /**
     * @dev Perform the payout for a project, paying the project owner and the contract owner a percentage of the raised amount.
     * @param _id ID of the project to payout.
     */
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


    /**
     * @dev Allows a backer to request a refund for a project.
     * @param _id ID of the project for which a refund is requested.
     * @return True if the refund was requested successfully.
    */
    function requestRefund(uint8 _id) external returns(bool){
        require(projects[_id].status != statusEnum.REVERTED || projects[_id].status != statusEnum.DELETED, "Project is Reverted or Deleted already");

        projects[_id].status = statusEnum.REVERTED;

        performRefund(_id);

        return true;
    }

    /**
     * @dev Pays out the funds raised by a project to the project owner and the contract owner.
     * @param _id ID of the project to pay out.
     * @return True if the payout was successful.
    */
    function payOutProject(uint256 _id) external returns(bool){
        require(projects[_id].status == statusEnum.APPROVED, "Project not Approved");
        require(msg.sender == projects[_id].owner || msg.sender == owner, "Unauthorized: You are not the owner of this project");

        performPayout(_id);

        return true;

    }

    /**
     * @dev Changes the tax percentage for the platform.
     * @param _taxPercentage New tax percentage to set.
    */
    function changeTax(uint8 _taxPercentage) external ownerOnly{
        projectTax = _taxPercentage;
    }



    // ===========================================
                     // Getter Functions
    // ===========================================

    /**
     * @dev Returns the address of the contract owner.
     */
     function getContractOwner() external view returns(address){
        return owner;
    }

    /**
     * @dev Returns the balance of the contract.
    */
     function getContractBalance() external view returns(uint256){
        return balance;
    }

    /**
     * @dev Returns the tax percentage applied to each project.
    */
     function getProjectTax() external view returns(uint8){
        return projectTax;
    }

    /**
     * @dev Returns the total number of projects created.
    */
     function getProjectCount() external view returns(uint8){
        return projectCount;
    }

    /**
      * @dev Returns the overall statistics of the platform.
    */
     function getTotalStats() external view returns(statsStruct memory){
        return stats;
    }

    /**
     * @dev Returns an array of all projects created on the platform.
    */
    function getAllProjects() external view returns (projectStruct[] memory){
        return projects;
    }

    /**
     * @dev Returns a specific project based on its ID.
     * @param _id The ID of the project to retrieve.
    */
    function getSingleProjectByID(uint8 _id) external view returns(projectStruct memory){
       require(projectExist[_id], "Project doesn't exists");
        return projects[_id];
    }

    /**
     * @dev Returns an array of all projects created by a specific user.
     * @param _user The address of the user whose projects are to be retrieved.
    */   
    function getProjectsOfAUser(address _user) external view returns(projectStruct[] memory ){
        return projectsOf[_user];
    }

    /**
     * @dev Returns an array of all backers of a specific project.
     * @param _id The ID of the project whose backers are to be retrieved.
    */
    function getBackersOfAProject(uint8 _id) external view returns(backerStruct[] memory ){
        return backersOf[_id];
    }

    /**
     * @dev Returns a boolean indicating whether a project with the specified ID exists.
     * @param _id The ID of the project to check for existence.
    */    
    function getProjectExist(uint8 _id) external view returns(bool){
        return projectExist[_id];
    }

}