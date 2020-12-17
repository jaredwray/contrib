const withImages = require('next-images')
const nextBuildId = require('next-build-id')

module.exports = withImages(), {
    generateBuildId: () => nextBuildId({ dir: __dirname })
}