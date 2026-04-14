const { pool } = require('../db/pool');
const { HttpError } = require('../utils/httpError');

async function listBands(requestingUser) {
  const isAdmin = requestingUser?.profileType === 'admin';
  const query = isAdmin
    ? `SELECT b.*, u.name AS owner_name
       FROM bands b
       JOIN users u ON u.id = b.owner_id
       ORDER BY b.created_at DESC`
    : `SELECT b.*, u.name AS owner_name
       FROM bands b
       JOIN users u ON u.id = b.owner_id
       WHERE b.status = 'approved'
       ORDER BY b.created_at DESC`;

  const result = await pool.query(query);
  return result.rows;
}

async function getBandById(id, requestingUser) {
  const result = await pool.query(
    `SELECT b.*, u.name AS owner_name
     FROM bands b
     JOIN users u ON u.id = b.owner_id
     WHERE b.id = $1`,
    [id],
  );

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Banda não encontrada');
  }

  const band = result.rows[0];
  if (band.status !== 'approved' && requestingUser?.profileType !== 'admin' && band.owner_id !== requestingUser?.id) {
    throw new HttpError(403, 'Banda indisponível');
  }

  return band;
}

async function createBand(data, ownerId) {
  const result = await pool.query(
    `INSERT INTO bands (owner_id, stage_name, description, city, state, whatsapp, instagram, photo_url, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
     RETURNING *`,
    [
      ownerId,
      data.stageName,
      data.description,
      data.city,
      data.state,
      data.whatsapp || null,
      data.instagram || null,
      data.photoUrl || null,
    ],
  );

  return result.rows[0];
}

async function updateBand(id, data, requester) {
  const existing = await pool.query('SELECT * FROM bands WHERE id = $1', [id]);
  if (existing.rowCount === 0) {
    throw new HttpError(404, 'Banda não encontrada');
  }

  const band = existing.rows[0];
  if (band.owner_id !== requester.id && requester.profileType !== 'admin') {
    throw new HttpError(403, 'Sem permissão para editar esta banda');
  }

  const nextStatus = requester.profileType === 'admin' ? data.status || band.status : 'pending';

  const result = await pool.query(
    `UPDATE bands
     SET stage_name = $1, description = $2, city = $3, state = $4,
         whatsapp = $5, instagram = $6, photo_url = $7, status = $8
     WHERE id = $9
     RETURNING *`,
    [
      data.stageName,
      data.description,
      data.city,
      data.state,
      data.whatsapp || null,
      data.instagram || null,
      data.photoUrl || null,
      nextStatus,
      id,
    ],
  );

  return result.rows[0];
}

async function changeBandStatus(id, status) {
  const result = await pool.query('UPDATE bands SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Banda não encontrada');
  }
  return result.rows[0];
}

module.exports = {
  listBands,
  getBandById,
  createBand,
  updateBand,
  changeBandStatus,
};
