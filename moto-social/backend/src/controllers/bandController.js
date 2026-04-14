const bandService = require('../services/bandService');

async function list(req, res, next) {
  try {
    const bands = await bandService.listBands(req.user);
    res.json(bands);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const band = await bandService.getBandById(Number(req.params.id), req.user);
    res.json(band);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const band = await bandService.createBand(req.body, req.user.id);
    res.status(201).json(band);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const band = await bandService.updateBand(Number(req.params.id), req.body, req.user);
    res.json(band);
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const band = await bandService.changeBandStatus(Number(req.params.id), req.body.status);
    res.json(band);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, changeStatus };
