const withImages = require('next-images')
module.exports = withImages()

module.exports = {
    env: {
        MONGODB_URI: 'mongodb://localhost:27017/contrib',
    },
  }