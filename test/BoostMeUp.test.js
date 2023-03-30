const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("BoostMeUp", () => {
    let boostMeUp;
    let deployer, backer1, backer2, backer3;
    const PROJECT_TAX_PERCENTAGE = 2;

    // Project Parameters
    const PROJECT_NAME = "Test Project";
    const PROJECT_DESCRIPTION = "This is a test project";
    const IMAGE_URL = "https://www.example.com";
    const PROJECT_COST = tokens(10);
    const PROJECT_EXPIRES_AT = Math.floor(Date.now() / 1000) + 86400; // expires in 1 day
    // Project Errors
    const PROJECT_TITLE_ERROR = "Title cannot be empty";
    const PROJECT_DESCRIPTION_ERROR = "Description cannot be empty";
    const PROJECT_IMAGE_URL_ERROR = "ImageURL cannot be empty";
    const PROJECT_COST_ERROR = "Cost cannot be zero";

    beforeEach(async() => {
        // Setup Accounts
        [deployer, backer1, backer2, backer3] = await ethers.getSigners();

        // Deploying Contract
        const BoostMeUp = await ethers.getContractFactory("BoostMeUp");
        boostMeUp = await BoostMeUp.deploy(PROJECT_TAX_PERCENTAGE);
        await boostMeUp.deployed();
    });

    describe("CONTRACT DEPLOYMENT", () => {
        it("Sets the owner", async() => {
            const result = await boostMeUp.getContractOwner();
            expect(result).to.equal(deployer.address);
        });

        it("Sets the project tax correctly", async function() {
            const result = await boostMeUp.getProjectTax();
            expect(result).to.equal(PROJECT_TAX_PERCENTAGE);
        });
    });

    describe("CREATE PROJECT TESTTING", () => {
        describe("Throws Errors When Parameters Are Empty", () => {
            it("Throws an error when project title is empty", async() => {
                await expect(
                    boostMeUp.createProject(
                        "",
                        PROJECT_DESCRIPTION,
                        IMAGE_URL,
                        PROJECT_COST,
                        PROJECT_EXPIRES_AT
                    )
                ).to.be.revertedWith(PROJECT_TITLE_ERROR);
            });
            it("Throws an error when project description is empty", async() => {
                await expect(
                    boostMeUp.createProject(
                        PROJECT_TITLE_ERROR,
                        "",
                        IMAGE_URL,
                        PROJECT_COST,
                        PROJECT_EXPIRES_AT
                    )
                ).to.be.revertedWith(PROJECT_DESCRIPTION_ERROR);
            });
            it("Throws an error when project image URL is empty", async() => {
                await expect(
                    boostMeUp.createProject(
                        PROJECT_TITLE_ERROR,
                        PROJECT_DESCRIPTION_ERROR,
                        "",
                        PROJECT_COST,
                        PROJECT_EXPIRES_AT
                    )
                ).to.be.revertedWith(PROJECT_IMAGE_URL_ERROR);
            });
            it("Throws an error when project cost is zero", async() => {
                await expect(
                    boostMeUp.createProject(
                        PROJECT_TITLE_ERROR,
                        PROJECT_DESCRIPTION_ERROR,
                        PROJECT_IMAGE_URL_ERROR,
                        0,
                        PROJECT_EXPIRES_AT
                    )
                ).to.be.revertedWith(PROJECT_COST_ERROR);
            });
        });

        describe("Creates a New Project with Full Input Parameters", () => {
            let newProject;
            beforeEach(async() => {
                newProject = await boostMeUp.createProject(
                    PROJECT_NAME,
                    PROJECT_DESCRIPTION,
                    IMAGE_URL,
                    PROJECT_COST,
                    PROJECT_EXPIRES_AT
                );
                await newProject.wait();
            });

            it("Updates the project ID", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.id).to.be.equal(0);
            });
            it("Updates the project owner", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.owner).to.be.equal(deployer.address);
            });
            it("Updates the project title", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.title).to.be.equal(PROJECT_NAME);
            });
            it("Updates the project description", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.description).to.be.equal(PROJECT_DESCRIPTION);
            });
            it("Updates the project image URL", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.imageURL).to.be.equal(IMAGE_URL);
            });
            it("Updates the project cost", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.cost).to.be.equal(PROJECT_COST);
            });
            it("Updates the project creation timestamp", async() => {
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.timestamp).to.be.above(0);
            });
            it("Updates the project expiration timestamp", async() => {
                const CURRENT_TIME = Math.floor(Date.now() / 1000);
                const project = await boostMeUp.getSingleProjectByID(0);
                expect(project.expiresAt).to.be.above(CURRENT_TIME);
            });
            it("Should push project struct into project array", async() => {
                const projects = await boostMeUp.getAllProjects();
                const projectsArrayLength = await projects.length;
                expect(projectsArrayLength).to.be.equal(1);
            });
            it("Updates the project exist status", async() => {
                const projectExist = await boostMeUp.getProjectExist(0);
                expect(projectExist).to.be.equal(true);
            });
            it("Should push project struct to the users projectsOf  mapping", async() => {
                const projectsOfAUser = await boostMeUp.getProjectsOfAUser(
                    deployer.address
                );
                const projectsOfAUserLength = await projectsOfAUser.length;
                expect(projectsOfAUserLength).to.be.equal(1);
            });
            it("Increase the contract's total projects by one", async() => {
                const stats = await boostMeUp.getTotalStats();
                expect(stats.totalProjects).to.be.equal(1);
            });
            it("Emits an event upon project creation", async() => {
                const receipt = await newProject.wait();
                const event = receipt.events[0];
                expect(event.event).to.be.equal("Action");
                expect(event.args[0]).to.be.equal(1);
                expect(event.args[1]).to.be.equal("PROJECT CREATED");
                expect(event.args[2]).to.be.equal(deployer.address);
                expect(event.args[3]).to.be.above(0);
            });
        });
    });

    // =====================

    //   =======================
});