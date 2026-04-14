const eventService = require('../services/eventService');

async function list(req, res, next) {
  try {
    const events = await eventService.listEvents(req.user);
    res.json(events);
  } catch (error) {
    next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const events = await eventService.myEvents(req.user.id);
    res.json(events);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const event = await eventService.getEventById(Number(req.params.id), req.user);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const event = await eventService.updateEvent(Number(req.params.id), req.body, req.user);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const event = await eventService.changeEventStatus(Number(req.params.id), req.body.status);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

async function favorite(req, res, next) {
  try {
    const response = await eventService.favoriteEvent(Number(req.params.id), req.user.id);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function unfavorite(req, res, next) {
  try {
    const response = await eventService.unfavoriteEvent(Number(req.params.id), req.user.id);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  listMine,
  getById,
  create,
  update,
  changeStatus,
  favorite,
  unfavorite,
};
