var App = require('./models/git-app');
var Package = require('./models/package');
var async = require('async')

function gitIds(res) {
    App.findOne(function (err, app) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(app.ids); // return all app ids in JSON format
    });
};

App.findOne({})
.then((found) => {
  if(!found) App.create({ids: []}, (err) => {
    if(err) console.log(err);
  })
})

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all apps
    app.get('/api/apps', function (req, res) {
        // use mongoose to get all apps in the database
        gitIds(res);
    });

    // add/remove gitApp and send back all apps after creation
    app.post('/api/apps', function (req, res) {

        // update gitApp, information comes from AJAX request from Angular
        App.findOne({})
        .then((app) => {
          if (app.ids.includes(req.body.id)) {
            return App.update({}, {$pull: { ids: req.body.id }})
          }
          return App.update({}, {$push: { ids: req.body.id }})
        })
        .then(()=>{
          async.forEachOf(req.body.packages, function(value, key, callback) {
            Package.update({name: key}, { $addToSet: {dependents: req.body.repoName}},
               {upsert: true}, (err, res) =>{
              callback()
            })
          }, function(err) {
            console.log(err)
            if(err) return res.send(err);
          // get and return all the apps after you create another
          gitIds(res)
        })
      })
      .catch((err) => {
        res.send(err)
      })

    });

    // delete a gitApp
    app.delete('/api/apps/:todo_id', function (req, res) {
        App.remove({
            _id: req.params.todo_id
        }, function (err, gitApp) {
            if (err)
                res.send(err);

            gitIds(res);
        });
    });

    app.get('/api/packages', function(req, res) {
      Package.aggregate([{
        $project: {
          name: 1,
          dependents: 1,
          length: { $size: "$dependents" }
        }
      }, {$sort: { length: -1 }},{
        $limit: 10
      }]).then((docs) =>{
        // console.log(err)
        // if (err)  return res.send(err)
        return res.send(docs)
      })
      .catch((err)=>{
        console.log(err)
        return res.send(err)
      })
    })

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
