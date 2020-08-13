#!/usr/bin/env node
const path = require("path");
const { default: Parcel, createWorkerFarm } = require('@parcel/core');
const { NodeFS, MemoryFS } = require('@parcel/fs');

const bundle = async () => {
  const VIRTUAL_DIST_DIR = '/dist';
  const workerFarm = createWorkerFarm();
  const inputFS = new NodeFS();
  const outputFS = new MemoryFS(workerFarm);
  await outputFS.mkdirp(VIRTUAL_DIST_DIR);

  try {
    const bundler = new Parcel({
      entries: path.join(__dirname, 'src/index.js'),
      sourceMaps: false,
      patchConsole: false,
      autoinstall: false,
      scopeHoist: true,
      disableCache: true,
      inputFS,
      outputFS,
      workerFarm,
      distDir: VIRTUAL_DIST_DIR,
    });

    await bundler.run();
  } finally {
    await workerFarm.end();
  }
}

(async () => {
  console.log('Starting first build.');
  await bundle();
  console.log('Starting second build.');
  await bundle();
})();
