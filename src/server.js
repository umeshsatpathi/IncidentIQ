import "dotenv/config";
import express from "express";
import {connectGraph, getGraph, closeGraph} from "./config/graph.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", async (req,res)=>{
    res.status(200).json({message: "Welcome to Incident IQ API"});
});
app.get("/health", async (req,res)=>{
    res.status(200).json({status: "Incident IQ API is healthy"});
})
app.get("/api/services", async (req,res)=>{
    try{
        const graph = await getGraph();
        const result = await graph.query(`MATCH (s:Service)-[:DEPENDS_ON]->(dependency:Service) RETURN s, dependency`);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
async function startServer() {
    try {
        await connectGraph();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
startServer();
process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await closeGraph();
    process.exit(0);
});
