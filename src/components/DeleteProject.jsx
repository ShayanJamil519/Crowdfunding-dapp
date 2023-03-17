import React from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState, setGlobalState } from "../store";

const DeleteProject = () => {
  const [deleteModal] = useGlobalState("deleteModal");
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
items-center justify-center bg-black bg-opacity-50
transform transition-transform duration-300 ${deleteModal}`}
    >
      <div
        className="bg-white shadow-lg 
    rounded-md w-11/12 md:w-2/6 h-7/12 p-6"
      >
        <form className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-bold text-2xl font-nunito uppercase">
              #Project Title
            </p>
            <button
              onClick={() => setGlobalState("deleteModal", "scale-0")}
              type="button"
              className="border-0 text-xl bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-center items-center mt-3">
            <div className="rounded-md overflow-hidden h-20 w-30">
              <img
                src={
                  "https://media.wired.com/photos/5926e64caf95806129f50fde/master/pass/AnkiHP.jpg"
                }
                alt="project title"
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5">
            <p className="text-xl">Are you sure?</p>
            <small className="text-md font-bold text-red-400">
              This is irreversible!
            </small>
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-red-600
            text-white font-medium text-lg tracking-wide leading-tight
            rounded-md shadow-md hover:bg-red-700 mt-5"
          >
            Delete Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteProject;
