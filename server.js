// call the packages we need
const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const leboncoin = require('leboncoin-api');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var search = new leboncoin.Search()
    .setPage(1)
    .setQuery("renove")
    .setFilter(leboncoin.FILTERS.PARTICULIER)
    .setCategory("locations")
    .setRegion("ile_de_france")
    .addSearchExtra("mrs", 1000) // min rent
    .addSearchExtra("mre", 1100); // min rent



  // Generic error handler used by all endpoints.
  function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();              // get an instance of the express Router

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    router.get('/search', function(req, res) {
        search.run().then(function (data) {
        console.log(data.page); // the current page
        console.log(data.nbResult); // the number of results for this search
        console.log(data.results); // the array of results
        res.status(200).json(data);

  }, function (err) {
    handleError(res, err.message, "Failed to search.");
  });
    });
    // more routes for our API will happen here

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // START THE SERVER
    // =============================================================================
    app.listen(port);
    console.log('Magic happens on port ' + port);
