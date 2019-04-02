var mongoose = require('mongoose');

module.exports = mongoose.model('Package', {
    name: String,
    dependents: [String]
});
