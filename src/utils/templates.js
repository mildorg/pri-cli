const { featuresEnum } = require('../constants');

const hasReactFeature = (features) => features.includes(featuresEnum.react[0]);
const hasRouterFeature = (features) => features.includes(featuresEnum.reactRouter);

module.exports = { hasReactFeature, hasRouterFeature };
