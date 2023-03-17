import React from "react";
import AddButton from "../components/AddButton";
import CreateProject from "../components/CreateProject";
import Hero from "../components/Hero";
import Projects from "../components/Projects";

const Home = () => {
  return (
    <div>
      <Hero />
      <Projects />
      <div className="flex justify-center items-center my-5">
        <button
          type="button"
          className="inline-block px-6 py-3 bg-green-600 rounded-full
            text-white font-medium text-md leading-tight uppercase
            shadow-md hover:bg-green-700"
        >
          Load More
        </button>
      </div>
      <CreateProject />

      <AddButton />
    </div>
  );
};

export default Home;
