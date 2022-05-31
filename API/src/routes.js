/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const { fs } = require('fs');

const {
  addUsersHandler,
  addLoginUserHandler,
  getDetailUsersHandler,
  editUsersByIdHandler,
  deleteUsersByIdHandler,
  addDangerDetectionHandler,
  getAllDangerDetectionHandler,
  getDetailDangerDetectionHandler,
  editDangerDetectionByIdHandler,
  deleteDangerDetectionByIdHandler,
  addDangerPlaceHandler,
  getAllDangerPlaceHandler,
  getDetailDangerPlaceHandler,
  editDangerPlaceByIdHandler,
  deleteDangerPlaceByIdHandler,
  getAllUsersHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/user',
    handler: addUsersHandler,
  },
  {
    method: 'POST',
    path: '/userlogin',
    handler: addLoginUserHandler,
  },
  {
    method: 'GET',
    path: '/user',
    handler: getAllUsersHandler,
  },
  {
    method: 'GET',
    path: '/user/{userId}',
    handler: getDetailUsersHandler,
  },
  {
    method: 'PUT',
    path: '/user/{userId}',
    handler: editUsersByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/user/{userId}',
    handler: deleteUsersByIdHandler,
  },
  //  danger detection
  {
    method: 'POST',
    path: '/tesFile',
    handler: (request, h) => {
      const data = request.payload;
      if (data.file) {
        const name = data.file.hapi.filename;
        const dataUrl = `${__dirname}/uploads/${name}`;
        const file = fs.createWriteStream(dataUrl);

        file.on('error', (err) => {
          const response = h.response({
            status: 'fail',
            message: err,
          });
          response.code(400);
          return response;
        });
        file.on('error', (err) => console.error(err));

        data.file.pipe(file);

        data.file.on('end', (err) => {
          const id = nanoid(16);
          const createdAt = new Date().toISOString();
          const updatedAt = createdAt;
          const newDetection = {
            dataUrl,
          };
          dangerDetection.push(newDetection);
          const isSuccess = dangerDetection.filter((detection) => detection.dataUrl === dataUrl).length > 0;
          if (isSuccess) {
            const response = h.response({
              status: 'success',
              message: 'Tes File berhasil ditambahkan',
              data: { detectionId: id },
            });
            response.code(201);
            return response;
          }
          const response = h.response({
            status: 'Error',
            message: 'Tes File gagal ditambahkan',
          });
          response.code(500);
          return response;
        });
      } else {
        const response = h.response({
          status: 'fail',
          message: 'error',
        });
        response.code(400);
        return response;
      }
    },
    options: {
      payload: {
        maxBytes: 1000000,
        parse: true,
        output: 'stream',
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: 'POST',
    path: '/dangerDetection/{userId}',
    handler: addDangerDetectionHandler,
    options: {
      payload: {
        maxBytes: 1000000,
        parse: true,
        output: 'stream',
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/dangerDetection',
    handler: getAllDangerDetectionHandler,
  },
  {
    method: 'GET',
    path: '/dangerDetection/{detectionId}',
    handler: getDetailDangerDetectionHandler,
  },
  {
    method: 'PUT',
    path: '/dangerDetection/{detectionId}',
    handler: editDangerDetectionByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/dangerDetection/{detectionId}',
    handler: deleteDangerDetectionByIdHandler,
  },
  // danger place
  {
    method: 'POST',
    path: '/dangerPlace',
    handler: addDangerPlaceHandler,
  },
  {
    method: 'GET',
    path: '/dangerPlace',
    handler: getAllDangerPlaceHandler,
  },
  {
    method: 'GET',
    path: '/dangerPlace/{placeId}',
    handler: getDetailDangerPlaceHandler,
  },
  {
    method: 'PUT',
    path: '/dangerPlace/{placeId}',
    handler: editDangerPlaceByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/dangerPlace/{placeId}',
    handler: deleteDangerPlaceByIdHandler,
  },
];
module.exports = routes;
