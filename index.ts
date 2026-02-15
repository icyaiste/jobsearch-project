type JobHit ={
    headline: string;
    employer: {name: string};
    workplace_address: {municipality: string};
    publication_date: string;
}

type JobSearchResponse = {
    hits: JobHit[];
}

const searchJobs = async (municipalityCode: number, profession: string): Promise<void> => {
  try {
    const result = `https://jobsearch.api.jobtechdev.se/search?municipality=${municipalityCode}&q=${profession}&offset=0&limit=10`;
    const response = await fetch(result);
    if(!response.ok){
    throw new Error(`API request failed with status ${response.status} (${response.statusText})`
      );
    }
    const data: JobSearchResponse = await response.json();

    if (!data.hits || data.hits.length === 0) {
      console.log("No jobs found with this keyword.");
      return;
    }

    console.log(`\nFound ${data.hits.length} jobs`);
    console.log("-".repeat(50));
    //console.log(data);

     data.hits.forEach((job: JobHit, index: number) => {
      const pubDate: Date = new Date(job.publication_date);
      //console.log("pubDate: ", pubDate);

      console.log(`${index + 1}. ${job.headline}`);
      console.log(`Company: ${job.employer.name}`);
      console.log(`Location: ${job.workplace_address.municipality}`);
      console.log(`Publication: ${pubDate.toISOString().split("T")[0]}`);
      console.log("-".repeat(50));
    });

  } catch (error: unknown) {
   console.error("\n Something went wrong while fetching jobs.");
    if (error instanceof Error) {
      console.error("Error message is:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
};

const runApp = async (): Promise<void> => {
  try {
    console.log("Welcome to the Job Search App!");
    console.log("This app searches for jobs using JobTeach API");
    const municipalityCode = 1480; //Gothenburg taxonomy code
    const profession = "fullstack developer";
    await searchJobs(municipalityCode, profession);
  } catch (error) {
    console.error(error);
  }
}

runApp();