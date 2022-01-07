const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const port =  process.env.PORT || 3000;

let clusterWorkerSize = 4; 
if (os.cpus().length < clusterWorkerSize) {
  clusterWorkerSize = os.cpus().length;
}

if (cluster.isMaster) {
  for (let i=0; i < clusterWorkerSize; i++) {
    cluster.fork()
  }

  cluster.on("exit", function(worker) {
    console.log("Worker", worker.id, " has exitted.")
  })
} else {
  const treeMarker = require('./marker/tree');
  const generativeMarker = require('./marker/generative');
  const donutMarker = require('./marker/statistics');

  const app = express();
  app.use(cors());
  app.options('*', cors());

  app.get('/marker/tree/:param', treeMarker);
  app.get('/marker/generative/:seed', generativeMarker);
  app.get('/marker/donut/:values', donutMarker);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}