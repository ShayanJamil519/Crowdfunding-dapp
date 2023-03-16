import React from "react";
import { FaEthereum } from "react-icons/fa";
import Identicon from "react-identicons";
import Moment from "react-moment";

const Backer = () => (
  <tr className="border-b border-gray-200 text-base">
    <td
      className=" font-light
        px-6 py-4 whitespace-nowrap"
    >
      <div className="flex justify-start items-center space-x-2">
        <Identicon
          className="h-10 w-10 object-contain rounded-full shadow-md"
          string={"backer.owner"}
          size={25}
        />
        <span>{"truncate(backer.owner, 4, 4, 11)"}</span>
      </div>
    </td>
    <td
      className=" font-light
                    px-6 py-4 whitespace-nowrap"
    >
      <small className=" text-base flex justify-start items-center space-x-1">
        <FaEthereum />
        <span className="text-base text-gray-700 font-medium">
          {"backer.contribution"} ETH
        </span>
      </small>
    </td>
    <td
      className=" font-light
        px-6 py-4 whitespace-nowrap"
    >
      {"backer.refunded" ? "Yes" : "No"}
    </td>
    <td
      className="font-light
        px-6 py-4 whitespace-nowrap"
    >
      <Moment fromNow>{"backer.timestamp"}</Moment>
    </td>
  </tr>
);

const ProjectBackers = () => {
  return (
    <div className="flex flex-col justify-center items-start md:w-[70%] px-6 mx-auto mb-12">
      <div
        className="max-h-[calc(100vh_-_10rem)] overflow-y-auto
    shadow-sm rounded-md w-full mb-10"
      >
        <table className="min-w-full" style={{ border: "2px solid #e1e1e1" }}>
          <thead className="border-b">
            <tr className="text-xl bg-[#ebebeb]">
              <th
                scope="col"
                className="font-medium
                px-6 py-4 text-left"
              >
                Backer
              </th>
              <th
                scope="col"
                className=" font-medium
                px-6 py-4 text-left"
              >
                Donations
              </th>
              <th
                scope="col"
                className=" font-medium
                px-6 py-4 text-left"
              >
                Refunded
              </th>
              <th
                scope="col"
                className=" font-medium
                px-6 py-4 text-left"
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((backer, i) => (
              <Backer key={i} backer={backer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectBackers;
