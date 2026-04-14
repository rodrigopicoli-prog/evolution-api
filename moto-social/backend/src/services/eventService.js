const { pool } = require('../db/pool');
const { HttpError } = require('../utils/httpError');

async function listEvents(requestingUser) {
  const isAdmin = requestingUser?.profileType === 'admin';

  const query = isAdmin
    ? `SELECT e.*, u.name AS author_name,
          EXISTS (
            SELECT 1 FROM favorites f
            WHERE f.event_id = e.id AND f.user_id = $1
          ) AS is_favorite
       FROM events e
       JOIN users u ON u.id = e.created_by
       ORDER BY e.start_date ASC`
    : `SELECT e.*, u.name AS author_name,
          EXISTS (
            SELECT 1 FROM favorites f
            WHERE f.event_id = e.id AND f.user_id = $1
          ) AS is_favorite
       FROM events e
       JOIN users u ON u.id = e.created_by
       WHERE e.status = 'approved'
       ORDER BY e.start_date ASC`;

  const result = await pool.query(query, [requestingUser?.id || null]);
  return result.rows;
}

async function getEventById(id, requestingUser) {
  const result = await pool.query(
    `SELECT e.*, u.name AS author_name,
      EXISTS (
        SELECT 1 FROM favorites f
        WHERE f.event_id = e.id AND f.user_id = $2
      ) AS is_favorite
     FROM events e
     JOIN users u ON u.id = e.created_by
     WHERE e.id = $1`,
    [id, requestingUser?.id || null],
  );

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Evento não encontrado');
  }

  const event = result.rows[0];
  if (event.status !== 'approved' && requestingUser?.profileType !== 'admin' && event.created_by !== requestingUser?.id) {
    throw new HttpError(403, 'Evento indisponível');
  }

  return event;
}

async function createEvent(data, userId) {
  const result = await pool.query(
    `INSERT INTO events (title, description, start_date, end_date, city, state, place_name, cover_url, category, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10)
     RETURNING *`,
    [
      data.title,
      data.description,
      data.startDate,
      data.endDate || null,
      data.city,
      data.state,
      data.placeName,
      data.coverUrl || null,
      data.category || null,
      userId,
    ],
  );

  return result.rows[0];
}

async function updateEvent(id, data, requester) {
  const existing = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  if (existing.rowCount === 0) {
    throw new HttpError(404, 'Evento não encontrado');
  }

  const event = existing.rows[0];
  if (event.created_by !== requester.id && requester.profileType !== 'admin') {
    throw new HttpError(403, 'Sem permissão para editar este evento');
  }

  const nextStatus = requester.profileType === 'admin' ? data.status || event.status : 'pending';

  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, start_date = $3, end_date = $4,
         city = $5, state = $6, place_name = $7, cover_url = $8, category = $9, status = $10
     WHERE id = $11
     RETURNING *`,
    [
      data.title,
      data.description,
      data.startDate,
      data.endDate || null,
      data.city,
      data.state,
      data.placeName,
      data.coverUrl || null,
      data.category || null,
      nextStatus,
      id,
    ],
  );

  return result.rows[0];
}

async function changeEventStatus(id, status) {
  const result = await pool.query('UPDATE events SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Evento não encontrado');
  }
  return result.rows[0];
}

async function favoriteEvent(eventId, userId) {
  const event = await pool.query('SELECT id, status, created_by FROM events WHERE id = $1', [eventId]);
  if (event.rowCount === 0) {
    throw new HttpError(404, 'Evento não encontrado');
  }

  if (event.rows[0].status !== 'approved' && event.rows[0].created_by !== userId) {
    throw new HttpError(403, 'Não é possível favoritar evento não aprovado');
  }

  await pool.query(
    `INSERT INTO favorites (user_id, event_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, event_id) DO NOTHING`,
    [userId, eventId],
  );

  return { success: true };
}

async function unfavoriteEvent(eventId, userId) {
  await pool.query('DELETE FROM favorites WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
  return { success: true };
}

async function myEvents(userId) {
  const result = await pool.query('SELECT * FROM events WHERE created_by = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

module.exports = {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  changeEventStatus,
  favoriteEvent,
  unfavoriteEvent,
  myEvents,
};
