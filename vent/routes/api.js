
// express
var express = require('express'),
 router = express.Router();

// cheerio and it's middleware
var afterLoad = require('after-load');
var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');

// html entities converter and it's middleware
var Entities = require('html-entities').AllHtmlEntities,
 entities = new Entities();

// DB and passport config
var config = require('../config/database');

// models
var Fixtures = require('../models/Fixtures'),
 Results = require('../models/Results'),
 Standings = require('../models/Standings'),
 Archive = require('../models/Archive'),
 Competition = require('../models/Competition'),
 Team = require('../models/Team');

// patterns and variables
var patternDate = /(\d{2})\.(\d{2})\. (\d{2})\:(\d{2})/,
 patternChar = /^[a-z ,.'-]+$/i,
 patternDigits = /^\d*$/,
 patternRound = /^Round\s\d*$/,
 patternRes = /^\d*:\d*/,
 list = [],
 j=0;

//--------------------api---------------------//
//--------------------------------------------//

// retrive all competition tables from db
router.get('/competition', function(req, res) {
    Competition.find(function(err, compet) {
        if (err) throw err;
        else {
            return res.send(compet);
        }
    });
});

// retrive all fixtures tables from db
router.get('/fixtures', function(req, res) {
    Fixtures.find(function(err, fix) {
        if (err) throw err;
        else {
            return res.send(fix);
        }
    });
});

// retrive all standings tables from db
router.get('/standings', function(req, res) {
    Standings.find(function(err, stand) {
        if (err) throw err;
        else {
            return res.send(stand);
        }
    });
});

// retrive all archives from db
router.get('/archives', function(req, res) {
    Archive.find(function(err, arch) {
        if (err) throw err;
        else {
            return res.send(arch);
        }
    });
});

// retrive all results tables from db
router.get('/results', function(req, res) {
    Results.find(function(err, re) {
        if (err) throw err;
        else {
            return res.send(re);
        }
    });
});

// retrive all teams from db
router.get('/teams', function(req, res) {
    Team.find(function(err, team) {
        if (err) throw err;
        else {
            return res.send(team);
        }
    });
});

//------------------------------------------//

//  today's matchs for a particular league
router.get('/TodaysMatchs', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('.soccer').parsetable();
    var list = [];
    var flag = true;
    data[1].map(function(element, i) {
        if (i > 0 && element.length > 0 && flag === true) {
            if (!pattern.test(element)) {
                flag = false;
            } else {
                var dt = new Date(element.replace(patternDate, '2017-$2-$1 $3:$4'));
                list.push({
                    "Date": dt,
                    "Statue": "",
                    "HomeTeam": "",
                    "Result": "",
                    "AwayTeam": ""
                });
            }
        }
    });

    data[2].map(function(element, i) {
        $ = cheerio.load(element);
        var statue = $('span:not(.padr)').text();
        statue = entities.decode(statue);
        if (i > 0 && element.length > 0 && i <= list.length) {
            list[i - 1].Statue = statue;
        }
    });
    data[3].map(function(element, i) {
        $ = cheerio.load(element);
        var padr = $('.padr').text().trim();
        if (i > 0 && element.length > 0 && i <= list.length) {
            list[i - 1].HomeTeam = padr;
        }
    });
    data[4].map(function(element, i) {
        if (i > 0 && element.length > 0 && i <= list.length) {
            var result = entities.decode(element);
            list[i - 1].Result = result;

        }
    });
    data[5].map(function(element, i) {
        $ = cheerio.load(element);
        var padl = $('.padl').text().trim();
        if (i > 0 && element.length > 0 && i <= list.length) {
            list[i - 1].AwayTeam = padl;
        }
    });
    res.send(list);
  });

// Create a new competition
router.post('/CreateCompetition', function(req, res) {
    var newCompet = new Competition({
        title: req.body.title,
        standings: req.body.standings,
        fixtures: req.body.fixtures,
        archive: req.body.archive,
        results: req.body.results
    });
    Competition.addCompetition(newCompet, function(err, compet) {
        if (err) throw err;
        else res.send(compet._id);
    });
});

// add Archive for a particular league into db
router.post('/AddArchive', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('table').parsetable();
    var Season = "1";
    var j = 0;
    for (var i in data[0]) {
        $ = cheerio.load(data[0][i]);
        var s = $('a').text().trim();
        Season = s;
        if (i >= 0 && !patternChar.test(Season) && Season !=="") {
            list.push({
                "Season": Season,
                "Winner": "",
                "Link": ""
            });
        }
    }

    j = 0;
    for (i in data[1]) {
        $ = cheerio.load(data[1][i]);
        var w = $('a').text().trim();
        if (i >= 0 && patternChar.test(w) && j < list.length) {
            list[j++].Winner = w;
        }
    }

    j = 0;
    for (i in data[1]) {
        $ = cheerio.load(data[1][i]);
        var l = $('a').attr('href');
        if (i >= 0 && !patternChar.test(l) && l !== undefined && j < list.length) {
            list[j++].Link = 'http://www.flashscore.com' + l;
        }
    }
    var newArch = new Archive({
        url: url,
        arch: list
    });
    Archive.addArch(newArch, function(err, archive) {
        if (err) throw err;
        else return res.send(archive._id);
    });
});

// add results for a particular league into db
router.post('/AddResults', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('.soccer').parsetable(false, false, true);
    var lastRound = "1";
    for (var i in data[0]) {
        if (i >= 0 && data[0][i].length > 0 && data[0][i] !== "") {
            lastRound = data[0][i];
            list.push({
                "Round": lastRound,
                "Date": "",
                "HomeTeam": "",
                "AwayTeam": "",
                "Result": ""
            });
        } else if (lastRound == 1) {} else {
            list.push({
                "Round": lastRound,
                "Date": "",
                "HomeTeam": "",
                "AwayTeam": "",
                "Result": ""
            });
        }
    }
    j = 0;
    for (i in data[1]) {
        if (i > 0 && data[1][i].length > 0 && i < list.length) {
            var dt = new Date(data[1][i].replace(patternDate, '2017-$2-$1 $3:$4'));
            list[j++].Date = dt;
        }
    }
    j = 0;
    for (i in data[2]) {
        if (i > 0 && i < list.length && patternChar.test(data[2][i])) {
            list[j++].HomeTeam = data[2][i];
        }
    }
    j = 0;
    for (i in data[3]) {
        if (i > 0 && i < list.length && patternChar.test(data[3][i])) {
            list[j++].AwayTeam = data[3][i];
        }
    }
    j = 0;
    for (i in data[4]) {
        if (i > 0 && data[4][i].length > 0 && i < list.length) {
            var result = entities.decode(data[4][i]);
            list[j++].Result = result;
        }
    }
    var newRes = new Results({
        url: url,
        res: list
    });
    Results.addRes(newRes, function(err, result) {
        if (err) throw err;
        else return res.send(result._id);
    });
});

// add fixtures for particular league into db
router.post('/AddFixtures', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    list = [];
    cheerioTableparser($);
    var data = $('.soccer').parsetable(false, false, true);
    var lastRound = "1";

    for (var i in data[0]) {
        if (i >= 0 && data[0][i].length > 0 && patternRound.test(data[0][i])) {
            lastRound = data[0][i];
            list.push({
                "Round": lastRound,
                "Date": "",
                "HomeTeam": "",
                "AwayTeam": ""
            });
        } else if (lastRound === "1") {} else {
            list.push({
                "Round": lastRound,
                "Date": "",
                "HomeTeam": "",
                "AwayTeam": ""
            });
        }
    }
    j = 0;
    for (i in data[1]) {
        if (i > 0 && data[1][i].length > 0 && i <= list.length) {
            var dt = new Date(data[1][i].replace(patternDate, '2017-$2-$1 $3:$4'));
            list[j++].Date = dt;
        }
    }
    j = 0;
    for (i in data[2]) {
        if (i > 0 && data[2][i].length > 0 && i <= list.length) {
            list[j++].HomeTeam = data[2][i];
        }
    }
    j = 0;
    for (i in data[3]) {
        if (i > 0 && data[3][i].length > 0 && i <= list.length) {
            list[j++].AwayTeam = data[3][i];
        }
    }
    var newFix = new Fixtures({
        url: url,
        fix: list
    });
    Fixtures.addFix(newFix, function(err, fixture) {
        if (err) throw err;
        else return res.send(fixture._id);
    });

});

// add team
router.get('/AddTeam', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('.squad-table').parsetable();
    var position = "";
    var j = 0;
    for (var i in data[0]) {
        if (i >= 0 && patternChar.test(data[0][i])) {
            position = data[0][i];
        } else if (patternDigits.test(data[0][i])) {
            list.push({
                "Position": position,
                "Number": "",
                "Name": "",
                //  "Age": "",
                "Match_Played": "",
                "Goals": "",
                "Yellow_Cards": "",
                "Red_Cards": ""
            });
        }
    }
    for (i in data[0]) {
        if (patternDigits.test(data[0][i])) {
            list[j++].Number = data[0][i];
        }
    }

    j = 0;
    for (i in data[1]) {
        $ = cheerio.load(data[1][i]);
        var name = $('a').text().trim();
        if (patternChar.test(name)) {
            list[j++].Name = name;
        }
    }

    /*  j = 0;
      for (i in data[2]) {
          var x = data[2][i].trim();
        //  console.log("data4: " + data[2][i]);

          if ((/^\d{2}$/).test(x) && i < list.length) {
              list[j++].Age = x;

          } else if (x === "? " && i < list.length) {
              list[j++].Age = '?';
          }
      }*/

    j = 0;
    for (i in data[3]) {
        if ((/^\d{1,2}$/).test(data[3][i])) {
            list[j++].Match_Played = data[3][i];
        }
    }

    j = 0;
    for (i in data[4]) {
        if ((/^\d{1,2}$/).test(data[4][i])) {
            list[j++].Goals = data[4][i];
        }
    }

    j = 0;
    for (i in data[5]) {
        if ((/^\d{1,2}$/).test(data[5][i])) {
            list[j++].Yellow_Cards = data[5][i];
        }
    }

    j = 0;
    for (i in data[6]) {
        if ((/^\d{1,2}$/).test(data[6][i])) {
            list[j++].Red_Cards = data[6][i];
        }
    }
    var newTeam = new Team({
        url: url,
        squad: list
    });
    Team.addTeam(newTeam, function(err, team) {
        if (err) throw err;
        else return res.send(team._id);
    });

});

// add standings for particular league into db
router.post('/AddStandings', function(req, res) {
    var url = req.body.url;
    var html = afterLoad(url);
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('#table-type-1').parsetable(false, false, true);
    var list = [];
    var title = "1";
    for (var i in data[1]) {
        if (i > 0 && data[1][i].length > 0) {
            title = data[1][i];
            list.push({
                "rank": 0,
                "title": title,
                "played": 0,
                "win": 0,
                "draw": 0,
                "lose": 0,
                "goals": 0,
                "points": 0
            });
        } else if (title === "1") {} else {
            list.push({
                "rank": 0,
                "title": title,
                "played": 0,
                "win": 0,
                "draw": 0,
                "lose": 0,
                "goals": 0,
                "points": 0
            });
        }
    }
    j = 0;
    for (i in data[0]) {
        if (i > 0 && i <= list.length) {
            list[j++].rank = data[0][i];
        }
    }
    j = 0;
    for (i in data[2]) {
        if (i > 0 && patternDigits.test(data[2][i]) && i <= list.length) {
            list[j++].played = data[2][i];
        }
    }
    j = 0;
    for (i in data[3]) {
        if (i > 0 && patternDigits.test(data[3][i]) && i <= list.length) {
            list[j++].win = data[3][i];
        }
    }
    j = 0;
    for (i in data[4]) {
        if (i > 0 && patternDigits.test(data[4][i]) && i <= list.length) {
            list[j++].draw = data[4][i];
        }
    }
    j = 0;
    for (i in data[5]) {
        if (i > 0 && patternDigits.test(data[5][i]) && i <= list.length) {
            list[j++].lose = data[5][i];
        }
    }
    j = 0;
    for (i in data[6]) {
        if (i > 0 && i <= list.length) {
            list[j++].goals = data[6][i];
        }
    }
    j = 0;
    for (i in data[7]) {
        if (i > 0 && patternDigits.test(data[7][i]) && i <= list.length) {
            list[j++].points = data[7][i];
        }
    }
    var newStand = new Standings({
        url: url,
        stand: list
    });
    Standings.addStand(newStand, function(err, standing) {
        if (err) throw err;
        else return res.send(standing._id);
    });
});

// delete a competition
router.post('/DeleteCompetition', function(req, res) {
    var dCompet = {
        _id: req.body._id
    };
    Competition.findById(dCompet, function(err, compet) {
        if (err) console.log(err);
        else {
            Fixtures.findOne({competition: req.body.id},function(err){
              if (err) throw err;}).remove().exec();
            Archive.findOne({competition: req.body.id},function(err){
              if (err) throw err;}).remove().exec();
            Standings.findOne({competition: req.body.id},function(err){
              if (err) throw err;}).remove().exec();
            Results.findOne({competition: req.body.id},function(err){
              if (err) throw err;}).remove().exec();
            res.send('all ref deleted');
        }
    }).remove().exec();
});

// delete a fixtures
router.post('/DeleteFixtures', function(req, res) {
    var dFix = {
        _id: req.body._id
    };
    Fixtures.findById(dFix, function(err, fix) {
        if (err) console.log(err);
        if (!fix) {
            return res.send('fixtures not found');
        } else {
            return res.send(fix);
        }
    }).remove().exec();

});

// delete a results
router.post('/DeleteResults', function(req, res) {
    var dRes = {
        _id: req.body._id
    };
    Results.findById(dRes, function(err, re) {
        if (err) console.log(err);
        if (!re) {
            return res.send('results not found');
        } else {
            return res.send(re);
        }
    }).remove().exec();
});

// delete a competition
router.post('/DeleteArchive', function(req, res) {
    var dArch = {
        _id: req.body._id
    };
    Archive.findById(dArch, function(err, arch) {
        if (err) console.log(err);
        if (!arch) {
            return res.send('archive not found');
        } else {
            return res.send(arch);
        }
    }).remove().exec();
});

// delete a standings
router.post('/DeleteStandings', function(req, res) {
    var dCompet = {
        _id: req.body._id
    };
    Competition.findById(dCompet, function(err, stand) {
        if (err) console.log(err);
        if (!stand) {
            return res.send('standings not found');
        } else {
            return res.send(stand);
        }
    }).remove().exec();
});

// delete a team
router.post('/DeleteTeam', function(req, res) {
    var dTeam = {
        _id: req.body._id
    };
    Team.findById(dTeam, function(err, team) {
        if (err) console.log(err);
        if (!team) {
            return res.send('team not found');
        } else {
            return res.send(team);
        }
    }).remove().exec();
});

// update a fixtures for competition
router.post('/UpdateFixtures', (req , res ) => {
  var query = {_id: req.body.id};
  var update = {"fixtures": req.body.fixturesId};
    Competition.findByIdAndUpdate(query , {"$set": update},
    (err , fix) => {
      if (err) throw err;
      else res.send(fix);
    });
});

// update a standings for competition
router.post('/UpdateStandings', (req , res ) => {
  var query = {_id: req.body.id};
  var update = {"standings": req.body.standingsId};
    Competition.findByIdAndUpdate(query , {"$set": update},
    (err , stand) => {
      if (err) throw err;
      else res.send(stand);
    });
});

// update a results for competition
router.post('/UpdateResults', (req , res ) => {
  var query = {_id: req.body.id};
  var update = {"results": req.body.resultsId};
    Competition.findByIdAndUpdate(query , {"$set": update},
    (err , res) => {
      if (err) throw err;
      else res.send(res);
    });
});

// update a standings for competition
router.post('/UpdateArchive', (req , res ) => {
  var query = {_id: req.body.id};
  var update = {"archive": req.body.ArchiveId};
    Competition.findByIdAndUpdate(query , {"$set": update},
    (err , stand) => {
	console.log('inside')
      if (err) throw err;
      else res.send(stand);
    });
	console.log('outsize')
});

//----------------------------------------------//

//--------------NOT COMPLETED YET---------------//

//fixtures for particular team ---prob
router.get('/TeamFixtures', function(req, res) {
    var html = afterLoad('http://www.flashscore.com/team/chelsea/4fGZN2oK/fixtures/');
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('.soccer').parsetable(false, true, false);
    var list = [];
    var tournament = "";
    for (var i in data[1]) {

        $ = cheerio.load(data[1][i]);
        var tourn = $('.tournament_part').text().trim();
        if (i >= 0 && tourn.length > 0 && tourn !== "") {
            tournament = tourn;

        } else {

            list.push({
                "Round": tournament,
                "Date": "",
                "HomeTeam": "",
                "AwayTeam": ""
            });
        }
    }
    j = 0;
    for (i in data[1]) {
        if (i >= 0 && data[1][i].length > 0 && i <= list.length && patternDate.test(data[1][i])) {
            var dt = new Date(data[1][i].replace(patternDate, '2017-$2-$1 $3:$4'));
            list[j++].Date = dt;
        }
    }
    j = 0;
    for (i in data[2]) {
        $ = cheerio.load(data[2][i]);
        var padr = $('.padr').text().trim();
        if (i > 0 && padr.length > 0 && i <= list.length) {
            list[j++].HomeTeam = padr;
        }
    }
    j = 0;
    for (i in data[3]) {
        $ = cheerio.load(data[3][i]);
        var padl = $('.padl').text().trim();
        if (i > 0 && padl.length > 0 && i <= list.length) {

            list[j++].AwayTeam = padl;
        }
    }
    res.send(list);
  });

// results for a particular team --prob
router.get('/teamresults', function(req, res) {
    var html = afterLoad('http://www.flashscore.com/team/chelsea/4fGZN2oK/results');
    var $ = afterLoad.$(html);
    $ = cheerio.load($(html).html());
    cheerioTableparser($);
    var data = $('.soccer').parsetable(false, false , false);
    var list = [];
    var tournament ="";
    for (var i in data[1]) {
      console.log(data[1][i]);
        if (i > 0 && data[1][i].length > 0 ) {
            tournament = data[1][i];
      }  else {
        list.push({
          "Tournament": tournament,
          "Date": "",
          "HomeTeam": "",
          "AwayTeam": "",
          "Result": ""
        });
        }
    }
    j=0;
    for( i in data[1]){
        if ( i > 0 && data[1][i].length > 0 && i < list.length) {
            var dt = new Date(data[1][i].replace(patternDate, '2017-$2-$1 $3:$4'));
            list[j++].Date = dt;
        }
    }
    j=0;
    for(i in data[2]) {
        if (i > 0  && i < list.length && patternChar.test(data[2][i])) {
            list[j++].HomeTeam = data[2][i];
        }
    }
    j=0;
    for(i in data[3]) {
        if (i > 0  && i < list.length && patternChar.test(data[3][i])) {
            list[j++].AwayTeam = data[3][i];
        }
    }
    j=0;
    for(i in data[4]){
      if (i > 0 && data[4][i].length > 0 && i < list.length ) {
        var result = entities.decode(data[4][i]);
          list[j++].Result = result;
     }
   }
    res.send(list);
});

//---------------------------------------------//

module.exports = router;
