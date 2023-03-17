import React from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState, setGlobalState } from "../store";

const CreateProject = () => {
  const [createModal] = useGlobalState("createModal");
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
items-center justify-center bg-black bg-opacity-50
transform transition-transform duration-300 ${createModal}`}
    >
      <div
        className="bg-white shadow-lg 
    rounded-md w-11/12 md:w-2/6 h-7/12 p-6"
      >
        <form className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-bold text-2xl font-nunito uppercase">
              Add Project
            </p>
            <button
              onClick={() => setGlobalState("createModal", "scale-0")}
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

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-md mt-5"
          >
            <input
              className="block w-full bg-transparent 
            border-0 text-md py-3 text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-md mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-md py-3 text-slate-500 focus:outline-none
            focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="cost"
              placeholder="cost (ETH)"
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-md mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-md py-3 text-slate-500 focus:outline-none
            focus:ring-0"
              type="date"
              name="date"
              placeholder="Expires"
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-md mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-md py-3 text-slate-500 focus:outline-none
            focus:ring-0"
              type="url"
              name="imageURL"
              placeholder="Image URL"
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-md mt-5"
          >
            <textarea
              className="block w-full bg-transparent
            border-0 text-md py-3 text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="description"
              placeholder="Description"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-lg tracking-wide leading-tight
            rounded-md shadow-md hover:bg-green-700 mt-5"
          >
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
