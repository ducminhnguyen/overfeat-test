// Module
const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const compress = require('compression');
const cluster = require('cluster');
const config = require('./lib/config');
const middleware = require('./middleware');
//
const views = require('./views');
const exec = require('child_process').exec;
// Main
var app = express();
init();

var port = process.env.PORT || 80;

app.listen(port, function (err) {
    if (err) {
        throw err;
    }

    console.log('Listening on port ' + port + '.');
});

function init() {
    const STATIC_ROOT = '/static';
    const STATIC_DIR = path.join(__dirname, '/static');
    var CSRF_OPTIONS = {
        whitelist: []
    };
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([
        path.join(__dirname, './templates')
    ]), {
        autoescape: true,
        watch: true
    });

    app.use(multer({ dest: './uploads/',
     rename: function (fieldname, filename) {
        return filename+Date.now();
      },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
      done=true;
    }
    }));
    app.use(compress());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
    app.use(cookieParser());
    app.use(middleware.session());
    app.use(middleware.debug);
    env.express(app);
    //Routing
    app.get('/', views.home);
    app.post('/api/photo', function(req, res){
        if(done==true) {
            // console.log(req.files);
            // res.end("File uploaded.");
            console.log(req.files);
            var imageDir = '/home/ubuntu/overfeat-test/uploads/' + req.files.userPhoto.name;
            // var cygwinPath = 'C:/cygwin64/bin/bash';
            var overfeatPath = '/home/ubuntu/overfeat/bin/linux_64/overfeat';
            var pathToWeight = '/home/ubuntu/overfeat/data/default';
            var overfeatParam = ' -d ' + pathToWeight + ' -n 5 ' + imageDir;
            var callingPath = overfeatPath + ' '  + overfeatParam;
            console.log(callingPath);
            exec(callingPath,function (error, stdout, stderr) {
                console.log(stdout);
                console.log(error);
                return res.jsonp(stdout);
            });
            
        }
    }
);
    // Middleware
    app.use(STATIC_ROOT, express.static(STATIC_DIR));
}
