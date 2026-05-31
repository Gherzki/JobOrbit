

import Job from "./Job.js"


/**
 * Represents the backend to be connected to.
 */
export default class Backend {
    /**
     * Represents the backend to be connected to.
     * 
     * @param {int} port The port of the backend.
     */
    constructor(port = 8000) {
        this.port = port;
    }
    
    /**
     * The base URL of the backend.
     */
    get url() {
        return `http://localhost:${this.port}`;
    }

    /**
     * An asynchronous function that returns all jobs.
     * @returns A list of jobs if successful; null otherwise.
     */
    async jobs() {
        const url = `${this.url}/api/jobs/`
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Response status: ${response.status}`);

            const json = await response.json();
            const jobs = json["results"]
            return Job.from(jobs)
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

