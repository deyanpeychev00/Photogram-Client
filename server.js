// Get dependencies// Get de
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './src/assets/images/uploads';

// read and parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
  destination: DIR,
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + (Math.random() * (Number.MIN_SAFE_INTEGER - Number.MAX_SAFE_INTEGER) + Number.MAX_SAFE_INTEGER).toString() + path.extname(file.originalname))
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).any();

function checkFileType(file, cb){
  // Allowed extentions
  let ext = /jpeg|jpg/;
  // Check file extention
  let filename = ext.test(path.extname(file.originalname).toLowerCase());
  // Check file mimetype
  let mimetype = ext.test(file.mimetype);

  if(filename && mimetype){
    return cb(null, true);
  }else{
    cb('Типът на файла не се поддържа');
  }
}
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
// Public Folder
app.use(express.static(DIR));


app.post('/upload', (req,res)=>{
  upload(req, res, (err) => {
    if(err){
      res.send({success:false, msg: err});
    } else {
      if(req.files === undefined){
        res.send({success: false, msg: 'Няма избран файл.'});
      }else{
        res.send({
          success: true,
          msg: 'Файлът е успешно качен',
          fileName: req.files[0].filename
        });
      }
    }
  });
});

//create a cors middleware
app.use(function(req, res, next) {
//set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Photogram running on localhost:${port}`));
