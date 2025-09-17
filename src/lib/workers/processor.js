import { parentPort } from "node:worker_threads";

parentPort?.on("message", async (data) => {
  const { id, code, props = {}} = data;


});