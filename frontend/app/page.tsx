'use client';
import {useState} from "react";
import Search from "./components/Search/Search";
import Backend from "../utils/Backend.js";

export default function Home() {
    const [searchValue, setSearchValue] = useState('');
    const [jobs, setJobs] = useState(null);

    // This is used to connect to the backend.
    const backend = new Backend();

    async function searchJobs(query: string) {
      // Setting the search value.
      setSearchValue(query);

      // Setting the jobs.
      const retrieved_jobs = await backend.jobs();
      setJobs(retrieved_jobs);
      console.log(retrieved_jobs);
    }

    const handleSearch = (value: string) => {
      // Here, you can access the search value when Enter is pressed
      console.log(value);
      searchJobs(value);
    };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm lg:flex-inline">
        <h1 className={'text-5xl my-10'}>JobOrbit</h1>
        <Search onSearch={handleSearch} />
          <h2 className={'text-2xl mt-20 mx-2 underline'}>Searched for:</h2>
          <p className={'text-2xl m-2'}> {searchValue}</p>
      </div>
    </main>
  )
}