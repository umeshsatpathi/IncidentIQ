import { FalkorDB } from "falkordb";

let graph;
let db

export async function connectGraph(){
    db = await FalkorDB.connect({
        host: process.env.FALKORDB_HOST || "127.0.0.1",
        port: Number(process.env.FALKORDB_PORT || 6379)
    });

    graph = db.selectGraph(process.env.FALKORDB_GRAPH || "incidentiq");

    await graph.query("RETURN 1 AS connected");
    console.log("Graph Connected"); 
}

export function getGraph() {
  if (!graph) {
    throw new Error("FalkorDB is not connected yet");
  }
  return graph;
}

export async function closeGraph() {
  if (db) {
    await db.close();
  }
}