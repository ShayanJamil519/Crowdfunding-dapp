import React from "react";
import Identicons from "react-identicons";
import { FaEthereum } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, id }) => {
  return (
    <div id="projects" className="rounded-md shadow-md bg-white w-64 m-4">
      <Link to={"/projects/" + id}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR26t6qRz-jzwIe6uQrWXeGwZ-HMv-PRK-Zhg&usqp=CAU"
          alt="image"
          className="rounded-xl h-64 w-full object-cover"
        />
        <div className="p-4">
          <h5>Creating a household robot</h5>

          <div className="flex flex-col">
            <div className="flex justify-start space-x-2 items-center mb-3">
              <Identicons
                string="0x15...1ea2"
                className="rounded-full shadow-md"
                size={15}
              />
              <small className="text-gray-700">0x15...1ea2</small>
            </div>
            <small className="text-gray-500">2 days left</small>
          </div>

          <div className="w-full bg-gray-300 overflow-hidden">
            <div
              className="bg-green-600 text-xs font-medium
            text-green-100 text-center p-0.5 leading-none
            rounded-l-full "
              style={{ width: "50%" }}
            ></div>
          </div>

          <div
            className="flex justify-between items-center 
        font-bold mt-1 mb-2 text-gray-700"
          >
            <small>14 ETH Raised</small>
            <small className="flex justify-start items-center">
              <FaEthereum />
              <span>5 ETH</span>
            </small>
          </div>

          <div
            className="flex justify-between items-center flex-wrap
            mt-4 mb-2 text-gray-500 font-bold"
          >
            <small>14 Backer</small>
            <div>
              <small className="text-green-500">Open</small>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const Projects = () => {
  return (
    <div className="flex flex-col px-6 mb-7">
      <div className="flex justify-center items-center flex-wrap">
        {Array(6)
          .fill()
          .map((card, i) => (
            <ProjectCard key={i} id={i} project={card}>
              Card{" "}
            </ProjectCard>
          ))}
      </div>
    </div>
  );
};

export default Projects;
