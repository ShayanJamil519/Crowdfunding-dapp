import React from "react";
import { FaEthereum } from "react-icons/fa";
import Identicons from "react-identicons";
import { setGlobalState } from "../store";

const ProjectDetails = () => {
  return (
    <div className="pt-48 mb-20 px-6 flex justify-center">
      <div className="flex justify-center flex-col md:w-[70%]">
        <div
          className="flex justify-start items-start
    sm:space-x-4 flex-wrap"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR26t6qRz-jzwIe6uQrWXeGwZ-HMv-PRK-Zhg&usqp=CAU"
            alt="image"
            className="rounded-xl h-70 object-cover sm:w-1/3 w-full"
          />

          <div className="flex-1 sm:py-0 py-4">
            <div className="flex flex-col justify-start flex-wrap">
              <h5 className="text-gray-900 text-4xl font-medium mb-2">
                Creating a household robot
              </h5>
              <small className="text-gray-500 text-base mb-3">
                3 days left
              </small>
            </div>

            <div className="flex justify-between items-center w-full mb-5">
              <div className="flex justify-start space-x-2">
                <Identicons
                  string="0x15...1ea2"
                  className="rounded-full shadow-md"
                  size={20}
                />
                <small className="text-gray-700 text-sm pr-5">0x93...13f</small>
                <small className="text-gray-500 font-bold text-sm">
                  16 Backing
                </small>
              </div>

              <div className="font-bold">
                <small className="text-gray-500 text-base">Open</small>
              </div>
            </div>

            <p className="text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              eligendi deleniti itaque voluptas officia quas harum delectus
              explicabo mollitia, nulla sunt veniam rem officiis culpa ullam
              accusantium incidunt quisquam hic!
            </p>

            <div className="w-full bg-gray-300 overflow-hidden mt-4">
              <div
                className="bg-green-600 text-xs font-medium
            text-green-100 text-center p-0.5 leading-none
            rounded-l-full "
                style={{ width: "50%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold mt-2">
              <small>3 ETH Raised</small>
              <small className="flex justify-start items-center">
                <FaEthereum />
                <span> 10 ETH </span>
              </small>
            </div>

            <div className="flex justify-start items-center space-x-2 mt-4">
              <button
                type="button"
                className="inline-block px-8 py-3 bg-green-600
        text-white font-medium text-md leading-tight uppercase
        rounded-full shadow-md hover:bg-green-700"
                onClick={() => setGlobalState("backModal", "scale-100")}
              >
                Back Project
              </button>

              <button
                type="button"
                className="inline-block px-8 py-3 bg-gray-600
        text-white font-medium text-md leading-tight uppercase
        rounded-full shadow-md hover:bg-green-700"
                onClick={() => setGlobalState("updateModal", "scale-100")}
              >
                Edit
              </button>

              <button
                type="button"
                className="inline-block px-8 py-3 bg-red-600
        text-white font-medium text-md leading-tight uppercase
        rounded-full shadow-md hover:bg-green-700"
                onClick={() => setGlobalState("deleteModal", "scale-100")}
              >
                Delete
              </button>

              <button
                type="button"
                className="inline-block px-8 py-3 bg-orange-600
        text-white font-medium text-md leading-tight uppercase
        rounded-full shadow-md hover:bg-green-700"
                //   onClick={() => setGlobalState('createModal', 'scale-100')}
              >
                Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
