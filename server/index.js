const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const csvtojsonV2 = require('csvtojson/v2');
const fs = require('fs');
const request = require('request');
const multer = require('multer');
const XLSX = require('xlsx');
const {
  OK,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  NOT_ACCEPTABLE,
} = require('http-status-codes');
const logger = require('parse-server').logger

const ParseServer = require('parse-server').ParseServer;
// const SimpleSendGridAdapter = require('parse-server-sendgrid-adapter');
const MailTemplateAdapter = require('parse-server-mail-template-adapter');
const SimpleSendGridAdapterCustom = require('./adapter');

dotenv.config({ path: '.env' });

const config = process.env.NODE_ENV === 'development' ? require('./config.json') : require('./config.prod.json');
console.log(config)
const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 1337;
const ROUTE = process.env.ROUTE || 'parse';
const serverUrl = `${PROTOCOL}://${HOST}:${PORT}/${ROUTE}`
const publicUrl = 'https://preview.odinchart.com/parse'
const app = express();
// console.log('databaseURI', process.env);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('view engine', 'ejs');
console.log('parse Config', serverUrl)

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const parseServer = new ParseServer({
  ...config,
  serverUrl,
  port: PORT,
  cloud: __dirname + '/cloud/main.js',
  loggerAdapter: logger,
  publicServerURL: process.env.NODE_ENV === 'development' ? serverUrl : publicUrl,
  emailAdapter: MailTemplateAdapter({
    adapter: SimpleSendGridAdapterCustom({
      apiKey: process.env.SENDGRID_API_KEY,
      fromAddress: process.env.SENDGRID_FROM_ADDRESS,
    }),
    template: {
      verification: {
        subject: 'Please Verify your Email',
        // Choose one in body and bodyFile, if both setted then body used
        // body: 'verfication body',
        bodyFile: `${__dirname}/templates/verificationEmail.html`,
      },
    },
  }),
});

const destination = `${__dirname}/uploads`;
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}
app.use('/', express.static(path.join(__dirname, '../dist')));
app.use(`/${ROUTE}`, parseServer);

app.get('/api/data', (req, res) => {
  const { url } = req.query;

  if (url) {
    request(url, (err, response, body) => {
      if (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send();
      } else if (response.statusCode === 200 && body) {
        console.log(body);
        if (
          (req.file && req.file.mimetype === 'text/csv') ||
          req.query.src === 'google_sheet' ||
          req.query.src === 'url'
        ) {
          csvtojsonV2()
            .fromString(body)
            .then(
              values =>
                res
                  .status(OK)
                  .send([
                    Object.keys(values[0]),
                    ...values.map(value => Object.keys(value).map(key => value[key])),
                  ]),
              reason => {
                console.error(reason);
                res.status(INTERNAL_SERVER_ERROR).send();
              },
            );
        } else if (
          req.file.mimetype === 'application/vnd.ms-excel' ||
          req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          const workbook = XLSX.readFile(body);
          /* DO SOMETHING WITH workbook HERE */
          const firstSheetName = workbook.SheetNames[0];
          /* Get worksheet */
          const worksheet = workbook.Sheets[firstSheetName];
          console.log(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
          res.status(OK).send(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
        } else {
          res.status(NOT_ACCEPTABLE).send();
        }
      } else {
        res.status(NOT_FOUND).send();
      }
    });
  } else {
    res.status(UNPROCESSABLE_ENTITY).send();
  }
});

app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
})

app.use(
  '/api/data',
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        cb(null, `data-${file.fieldname}-${Date.now()}`);
      },
    }),
  }).single('file'),
  (req, res) => {

    if (req.file) {
      const filePath = `${destination}/${req.file.filename}`;

      if ( (/\.(csv)$/i).test(req.file.originalname) ) {
        csvtojsonV2()
          .fromFile(filePath)
          .then(
            values =>
              res
                .status(OK)
                .send([
                  Object.keys(values[0]),
                  ...values.map(value => Object.keys(value).map(key => value[key])),
                ]),
            reason => {
              console.error(reason);
              res.status(INTERNAL_SERVER_ERROR).send();
            },
          )
          .then(() => fs.unlink(filePath, err => err && console.error(err)));
      } else if ( (/\.(xls|xlsx)$/i).test(req.file.originalname) ) {
        const workbook = XLSX.readFile(filePath);
        /* DO SOMETHING WITH workbook HERE */
        const firstSheetName = workbook.SheetNames[0];
        /* Get worksheet */
        const worksheet = workbook.Sheets[firstSheetName];
        // console.log(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
        res.status(OK).send(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
        fs.unlink(filePath, err => err && console.error(err));
      } else {
        res.status(NOT_ACCEPTABLE).send();
      }
    } else {
      res.status(UNPROCESSABLE_ENTITY).send();
    }
  },
);

app.post(
  '/api/saveSVG',
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    }),
  }).single('file'),
  (req, res) => {
    res.send({ message: 'File has been Created' });
  },
);

app.route('/*').get((req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => console.log(`parse-server running on ${serverUrl}, port ${PORT}`));
