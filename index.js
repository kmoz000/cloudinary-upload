const core = require('@actions/core');
const isGlob = require('is-glob');
const glob = require('glob');

const uploader = require('./uploader')

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function run() {
  try {
    const cloudName = core.getInput('cloud-name') || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = core.getInput('api-key') || process.env.CLOUDINARY_API_KEY;
    const apiSecret = core.getInput('api-secret') || process.env.CLOUDINARY_API_SECRET;
    const filePath = core.getInput('file');
    const filesPath = core.getInput('files');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary cloud name, api key and api secret are required');
    }

    let paths = [];
    if (isJson(filesPath)) {
      paths = JSON.parse(filesPath);
    } else if (isGlob(filesPath)) {
      paths = glob.sync(filesPath);
    } else if (filePath) {
      paths = [filePath];
    } else {
      throw new Error('one of image or images parameter is required');
    }

    await uploader(cloudName, apiKey, apiSecret, paths);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
