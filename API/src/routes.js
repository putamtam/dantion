/* eslint-disable linebreak-style */
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
    path: '/dangerDetection',
    handler: addDangerDetectionHandler,
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
