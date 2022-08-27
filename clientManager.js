'use strict';

const turf = require('@turf/turf');

const PurplePoints = require('./PurpleLine.json');
const GreenPoints = require('./GreenLine.json');

const connectedUsers = new Map();
const PurpleLine = turf.lineString(PurplePoints);
const baiyapanahalli = turf.point([77.65612, 12.992118]);
const baiyapanahalliPoint = [77.65612, 12.992118];

const kengeri = turf.point([77.476466, 12.907963]);
const kengeriPoint = [77.476466, 12.907963];

const PurpleCollection = turf.featureCollection(
  PurplePoints.map((x) => turf.point(x)),
);

const GreenCollection = turf.featureCollection(
  GreenPoints.map((x) => turf.point(x)),
);

const getIndexOfArray = (array1, findArray) => {
  let index = -1;
  array1.some((item, i) => {
    if (JSON.stringify(item) === JSON.stringify(findArray)) {
      index = i;
      return true;
    }
  });
  return index;
};

const distanceBetweenLines = (startPoint, endPoint, line) => {
  if (line === 'Purple') {
    const startPointNear = turf.nearestPoint(startPoint, PurpleCollection);
    const endPointNear = turf.nearestPoint(endPoint, PurpleCollection);

    const startPointIndex = getIndexOfArray(PurplePoints, startPointNear.geometry.coordinates);
    const endPointIndex = getIndexOfArray(PurplePoints, endPointNear.geometry.coordinates);
    let lengthOfJourney;
    if (startPointIndex < endPointIndex) {
      const journeyPoints = PurplePoints.slice(startPointIndex, endPointIndex + 1);
      const journeyLine = turf.lineString(journeyPoints);
      lengthOfJourney = turf.length(journeyLine, { units: 'kilometers' });
      return lengthOfJourney;
    }
    const journeyPoints = PurplePoints.slice(endPointIndex, startPointIndex + 1).reverse();
    const journeyLine = turf.lineString(journeyPoints);
    lengthOfJourney = turf.length(journeyLine, { units: 'kilometers' });
    return lengthOfJourney;
  }
  const startPointNear = turf.nearestPoint(startPoint, GreenCollection);
  const endPointNear = turf.nearestPoint(endPoint, GreenCollection);

  const startPointIndex = getIndexOfArray(GreenPoints, startPointNear.geometry.coordinates);
  const endPointIndex = getIndexOfArray(GreenPoints, endPointNear.geometry.coordinates);
  let lengthOfJourney;
  if (startPointIndex < endPointIndex) {
    const journeyPoints = GreenPoints.slice(startPointIndex, endPointIndex + 1);
    const journeyLine = turf.lineString(journeyPoints);
    lengthOfJourney = turf.length(journeyLine, { units: 'kilometers' });
    return lengthOfJourney;
  }
  const journeyPoints = GreenPoints.slice(endPointIndex, startPointIndex + 1).reverse();
  const journeyLine = turf.lineString(journeyPoints);
  lengthOfJourney = turf.length(journeyLine, { units: 'kilometers' });
  return lengthOfJourney;
};

const addUser = (userId, socket) => {
  //     const lengthFromPointToLine = turf.pointToLineDistance(baiyapanahalli,PurpleLine,{units: 'kilometers'});
  //   const lengthOfPurpleLine = turf.length(PurpleLine, { units: 'kilometers' });
  //   const nearest = turf.nearestPoint(baiyapanahalli, PurpleCollection);
  //   distanceBetweenLines(kengeriPoint, baiyapanahalliPoint);
  //   console.log(nearest);
  connectedUsers.set(userId, socket);
  //   console.log(connectedUsers);
  console.log('user:', userId);
};

const removeUser = (userId) => {
  connectedUsers.delete(userId);
};

const getUser = (userId) => {
  console.log(userId, 'ping pong');
  return connectedUsers.get(userId);
};

/**
 *
 * @param {Object} param
 * @param {String} param.from UserID Who is sending
 * @param {String} param.to recipient User Id
 * @param {String} param.message recipient Message Body
 */
const sendMessageOfSocket = ({ from, to, ...data }) => {
  try {
    const socket = connectedUsers.get(to);
    if (!socket) {
      return;
    }
    console.log('message sent on socket');
    socket.emit('new-message', { from, to, data });
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {Object} param
 * @param {String} param.conversationId ConversationID
 * @param {String} param.to UserId of the person who has sent the message
 * @returns
 */
const messageStatusUpdated = ({ conversationId, to }) => {
  try {
    console.log({ conversationId, to });
    const socket = connectedUsers.get(to);
    // console.log(socket);
    if (!socket) {
      return;
    }
    socket.emit('message-status-updated', { conversationId });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  sendMessageOfSocket,
  messageStatusUpdated,
  distanceBetweenLines,
};
