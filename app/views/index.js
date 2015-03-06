exports.home = function home (req, res, next) {
    return res.render('index.html');
}

exports.upload = function(req,res){
    if(done==true) {
        console.log(req.files);
        res.end("File uploaded.");
    }
}

