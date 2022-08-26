'use strict';

const MetroStations = require('../../models/metro-stations');
const MetroLines = require('../../models/metro-lines');

const getRoute = async (req, res, next) => {
  try {
    let allStops;
    const { start, destination } = req.query;
    const startData = await MetroStations.findOne({ name: start });
    const destinationData = await MetroStations.findOne({ name: destination });

    if (startData.line === destinationData.line
        || start === 'Majestic' || destination === 'Majestic'
    ) {
      let line = await MetroLines.findOne({ name: startData.line });
      if (start === 'Majestic') {
        line = await MetroLines.findOne({ name: destinationData.line });
      } else if (destination === 'Majestic') {
        line = await MetroLines.findOne({ name: startData.line });
      }
      const startIndex = line.LineArray.indexOf(start);
      const destinationIndex = line.LineArray.indexOf(destination);
      if (startIndex < destinationIndex) {
        allStops = line.LineArray
          .slice(startIndex, destinationIndex + 1);
      } else {
        allStops = line.LineArray
          .slice(destinationIndex, startIndex + 1).reverse();
      }
      res.json({ allStops, areaOfInterest: [destination] });
    } else {
      const startLine = await MetroLines.findOne({ name: startData.line });
      const destinationLine = await MetroLines.findOne({ name: destinationData.line });
      const startIndex = startLine.LineArray.indexOf(start);
      const middleIndexOfStartLine = startLine.LineArray.indexOf('Majestic');
      const destinationIndex = destinationLine.LineArray.indexOf(destination);
      const middleIndexOfDestinationLine = destinationLine.LineArray.indexOf('Majestic');
      if (startIndex < middleIndexOfStartLine) {
        allStops = startLine.LineArray
          .slice(startIndex, middleIndexOfStartLine + 1);
      } else {
        allStops = startLine.LineArray
          .slice(middleIndexOfStartLine, startIndex + 1).reverse();
      }
      if (destinationIndex < middleIndexOfDestinationLine) {
        allStops.push(...destinationLine.LineArray
          .slice(destinationIndex, middleIndexOfDestinationLine).reverse());
      } else {
        destinationLine.LineArray.reverse();
        allStops.push(...destinationLine.LineArray
          .slice(middleIndexOfDestinationLine - 1, destinationIndex + 1).reverse());
      }
      res.json({ allStops, areaOfInterest: ['Majestic', destination] });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getRoute;
