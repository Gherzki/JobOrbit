

/**
 * A wrapper for the list of job objects provided by the backend.
 * 
 * This provides more detailed filtering computations for the list
 * of jobs.
 */
export default class JobFilter {
    /**
     * A wrapper for the list of job objects provided by the backend.
     * 
     * @param {object[]} jobs The list of jobs provided by the backend.
     */
    constructor(jobs) {
        this.jobs = jobs;
    }
    
    /**
     * Filters the list of jobs based on the query.
     * 
     * @param {string} query The query to the search bar.
     * @returns The list of jobs satisfying the query.
     */
    search(query) {
        query = query.toLowerCase()

        return this.jobs.filter(job => {
            if (job.title.toLowerCase().includes(query))
                return true;
            else if (job.description.toLowerCase().includes(query))
                return true;
            return false;
        });
    }
}

