/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const {
  users, dangerDetection, dangerPlace,
} = require('./dantion');

// User
const addUsersHandler = (request, h) => {
  const {
    name, alamat, number, parentNumber, email, pass,
  } = request.payload;
  if (name === undefined && alamat === undefined && number === undefined
    && parentNumber === undefined && email === undefined && pass === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan User. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const ttl = Date.getDate();
  const role = 'umum';
  const photo = String;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newUser = {
    name,
    alamat,
    number,
    parentNumber,
    ttl,
    email,
    pass,
    role,
    photo,
    id,
    createdAt,
    updatedAt,
  };
  users.push(newUser);
  const isSuccess = users.filter((user) => user.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId: id },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'Error',
    message: 'User gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const addLoginUserHandler = (request, h) => {
  const {
    email, pass,
  } = request.payload;
  const getUser = users.filter((user) => user.email === email)[0];
  if (getUser !== undefined && getUser.pass === pass) {
    const response = h.response({
      status: 'success',
      data: {
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'User tidak ditemukan',
  });
  response.code(404);
  return response;
};
const getDetailUsersHandler = (request, h) => {
  const { userId } = request.params;
  const user = users.filter((n) => n.id === userId)[0];
  if (user !== undefined) {
    const response = h.response({
      status: 'success',
      data: { user },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'User tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editUsersByIdHandler = (request, h) => {
  const { userId } = request.params;
  const {
    name,
    alamat,
    number,
    parentNumber,
    ttl,
    email,
    pass,
    role,
    photo,
  } = request.payload;
  if (name === undefined && alamat === undefined && number === undefined
    && parentNumber === undefined && email === undefined
    && pass === undefined && ttl === undefined && role === undefined
    && photo === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui data User. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      name,
      alamat,
      number,
      parentNumber,
      ttl,
      email,
      pass,
      role,
      photo,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Data user berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui data user. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteUsersByIdHandler = (request, h) => {
  const { userId } = request.params;
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Data user berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Data user gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// Danger Detection
const addDangerDetectionHandler = (request, h) => {
  const { userId } = request.params;
  const user = users.filter((n) => n.id === userId)[0];
  const {
    latitude, longitude, rekaman, tipe, status, isValid,
  } = request.payload;
  if (user === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan data detection. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newDetection = {
    latitude,
    longitude,
    rekaman,
    tipe,
    status,
    isValid,
    id,
    createdAt,
    updatedAt,
  };
  dangerDetection.push(newDetection);
  const isSuccess = dangerDetection.filter((detection) => detection.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Danger detection berhasil ditambahkan',
      data: { detectionId: id },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'Error',
    message: 'Danger detection gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getDetailDangerDetectionHandler = (request, h) => {
  const { detectionId } = request.params;
  const detection = dangerDetection.filter((n) => n.id === detectionId)[0];
  if (detection !== undefined) {
    const response = h.response({
      status: 'success',
      data: { detection },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Danger detection tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editDangerDetectionByIdHandler = (request, h) => {
  const { detectionId } = request.params;
  const {
    latitude,
    longitude,
    rekaman,
    tipe,
    status,
    isValid,
  } = request.payload;
  if (latitude === undefined && longitude === undefined && rekaman === undefined
    && tipe === undefined && status === undefined && isValid === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui data detection. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = dangerDetection.findIndex((detection) => detection.id === detectionId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      latitude,
      longitude,
      rekaman,
      tipe,
      status,
      isValid,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Data detection berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui data detection. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteDangerDetectionByIdHandler = (request, h) => {
  const { detectionId } = request.params;
  const index = dangerDetection.findIndex((detection) => detection.id === detectionId);
  if (index !== -1) {
    users.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Data detection berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Data detection gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// Danger Place
const addDangerPlaceHandler = (request, h) => {
  const {
    latitude, longitude, radius, tipe,
  } = request.payload;
  if (latitude === undefined && longitude === undefined
    && radius === undefined && tipe === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan data place. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newDetection = {
    latitude,
    longitude,
    radius,
    tipe,
    id,
    createdAt,
    updatedAt,
  };
  dangerPlace.push(newDetection);
  const isSuccess = dangerPlace.filter((place) => place.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Danger place berhasil ditambahkan',
      data: { placeId: id },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'Error',
    message: 'Danger place gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getDetailDangerPlaceHandler = (request, h) => {
  const { placeId } = request.params;
  const place = dangerPlace.filter((n) => n.id === placeId)[0];
  if (place !== undefined) {
    const response = h.response({
      status: 'success',
      data: { place },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Danger place tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editDangerPlaceByIdHandler = (request, h) => {
  const { placeId } = request.params;
  const {
    latitude, longitude, radius, tipe,
  } = request.payload;
  if (latitude === undefined && longitude === undefined
    && radius === undefined && tipe === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui data place. Mohon isi data dengan benar',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = dangerPlace.findIndex((place) => place.id === placeId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      latitude,
      longitude,
      radius,
      tipe,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Data place berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui data place. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteDangerPlaceByIdHandler = (request, h) => {
  const { placeId } = request.params;
  const index = dangerPlace.findIndex((place) => place.id === placeId);
  if (index !== -1) {
    users.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Data place berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Data place gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addUsersHandler,
  addLoginUserHandler,
  getDetailUsersHandler,
  editUsersByIdHandler,
  deleteUsersByIdHandler,
  addDangerDetectionHandler,
  getDetailDangerDetectionHandler,
  editDangerDetectionByIdHandler,
  deleteDangerDetectionByIdHandler,
  addDangerPlaceHandler,
  getDetailDangerPlaceHandler,
  editDangerPlaceByIdHandler,
  deleteDangerPlaceByIdHandler,
};
