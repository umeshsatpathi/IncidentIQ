import "dotenv/config";
import {connectGraph, getGraph, closeGraph} from "../config/graph.js";
import {seedIncidentGraph} from "../graph/seed.js";

async function seed() {
    try {
        await connectGraph();
        const graph = await getGraph();
        await seedIncidentGraph(graph);
    }catch (error) {
        console.error("Error seeding graph:", error);
        process.exitCode = 1;
    }finally {
        await closeGraph();
    }
}
seed();
