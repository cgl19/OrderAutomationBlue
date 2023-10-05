var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const fs = require('fs');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const flash = require("connect-flash");

const cors = require("cors");
const db = require("./models");
const { parse } = require('json2csv');
const archiver = require('archiver');
const unzipper = require('unzipper');
var app = express();

const {
	Users,
	ListingConditions,
	DistiVendorList,
	DistiListings,
	VendorMappings,
	Stocks,
	UserPowers,
	FreightRules,
	BotConfig,
	StocksAndPriceData,
	HandlingPrices,
} = db;

// update DB tables based on model updates. Does not handle renaming tables/columns
// NOTE: toggling this to true drops all tables (including data)
db.sequelize.sync({ omitNull: true });

var router = require("./routes");


 
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors({ origin: ["*"] }));

app.use(logger("dev"));
app.use(express.json());
app.use(
	fileUpload({
		createParentPath: true,
	})
);


app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "some secret phrase",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 3600,
		},
	})
); 
 




// function createZipArchive(res) {
// 	const backupFolderPath = path.join(__dirname, 'backups');
// 	const zipFilePath = path.join(__dirname, 'backups.zip');

// 	const output = fs.createWriteStream(zipFilePath);
// 	const archive = archiver('zip', {
// 		zlib: { level: 9 } // Maximum compression level
// 	});

// 	output.on('close', () => {
// 		console.log('Zip archive created:', archive.pointer(), 'total bytes');
// 		res.download(zipFilePath, 'backups.zip', (err) => {
// 			if (err) {
// 				console.error('Error downloading zip archive:', err);
// 				res.status(500).end();
// 			} else {
// 				console.log('Zip archive downloaded successfully');
// 				fs.unlinkSync(zipFilePath); // Remove the zip file after download
// 			}
// 		});
// 	});

// 	archive.on('error', (err) => {
// 		console.error('Error creating zip archive:', err);
// 		res.status(500).end();
// 	});

// 	archive.pipe(output);
// 	archive.directory(backupFolderPath, 'backups'); // Add the backups folder to the archive
// 	archive.finalize();
// }


// app.get('/download', (req, res) => {
// 	createZipArchive(res);
// });




// app.post('/admin/test', async function (req, res) {


// 	const generals = req.body.generals;
// 	const distiSettingstype = req.body.distiSettingstype;
// 	const uploadSettings = req.body.uploadSettings;
// 	const freightRules = req.body.freightRules;

// 	//	let handlingPrices = await HandlingPrices.findAll();

// 	if (generals == "on") {
// 		var data = await BotConfig.findAll();
// 		const SY_interval = data[0].SYinterval;
// 		const D_H_interval = data[0].SYinterval
// 		const IG_interval = data[0].IGinterval
// 		const ASI_interval = data[0].ASIinterval
// 		const SS_interval = data[0].SSinterval
// 		const TripleEight_interval = data[0].TripleEightinterval
// 		//getting time  intervals 
// 		const SY_Last_Run = data[0].SYLastRun
// 		const DH_Last_Run = data[0].DnHLastRun
// 		const IG_Last_Run = data[0].IGLastRun
// 		const ASI_Last_Run = data[0].ASILastRun
// 		const SS_Last_Run = data[0].SSLastRun
// 		const TripleEight_Last_Run = data[0].TripleEightLastRun

// 		const csvContent = `SY_interval,D_H_interval,IG_interval,ASI_interval,SS_interval,TripeEight_interval,SY_Last_Run,DH_Last_Run,IG_Last_Run,ASI_Last_Run,SS_Last_Run,TripleEight_Last_Run
//         ${SY_interval},${D_H_interval},${IG_interval},${ASI_interval},${SS_interval},${TripleEight_interval},${SY_Last_Run},${DH_Last_Run},${IG_Last_Run},${ASI_Last_Run},${SS_Last_Run},${TripleEight_Last_Run}`;

// 		// Save the CSV data to a file
// 		const backupsFolderPath = path.join(__dirname, 'backups');

// 		// Create the backups folder if it doesn't exist
// 		if (!fs.existsSync(backupsFolderPath)) {
// 			fs.mkdirSync(backupsFolderPath);
// 		}

// 		// File path for the backup CSV file
// 		const backupFilePath = path.join(backupsFolderPath, 'generals_data_backup.csv');

// 		// Save the CSV data to the backup file
// 		fs.writeFile(backupFilePath, csvContent, 'utf8', (err) => {
// 			if (err) {
// 				console.error('Error writing file:', err);
// 			} else {
// 				console.log('Data saved to generals_data_backup.csv');
// 				console.log('Backup file path:', backupFilePath);
// 			}
// 		});

// 	}



// 	//checking secondn condition
// 	if (distiSettingstype == "on") {
// 		const IsSYon = data[0].IsSYon;
// 		const IsDnHon = data[0].IsDnHon;
// 		const IsIGon = data[0].IsIGon;
// 		const IsASIon = data[0].IsASIon;
// 		const IsSSon = data[0].IsSSon;
// 		const csvContent = `IsSYon,IsDnHon,IsIGon,IsASIon,IsSSon
//         ${IsSYon},${IsDnHon},${IsIGon},${IsASIon},${IsSSon}`;

// 		// Directory path for the backups folder (adjust the path if needed)
// 		const backupsFolderPath = path.join(__dirname, 'backups');

// 		// Create the backups folder if it doesn't exist
// 		if (!fs.existsSync(backupsFolderPath)) {
// 			fs.mkdirSync(backupsFolderPath);
// 		}

// 		// File path for the backup CSV file
// 		const backupFilePath = path.join(backupsFolderPath, 'disti_setting_data_backup.csv');

// 		// Save the CSV data to the backup file
// 		fs.writeFile(backupFilePath, csvContent, 'utf8', (err) => {
// 			if (err) {
// 				console.error('Error writing file:', err);
// 			} else {
// 				console.log('Data saved to disti_data_backup.csv');
// 				console.log('Backup file path:', backupFilePath);
// 			}
// 		});

// 	}







// 	//checking third condition
// 	if (uploadSettings == "on") {
// 		const Minimum_Product_Price = data[0].MinProdPrice;
// 		const Minimum_Quantity_Filter = data[0].MinQuanFilter;
// 		const IsBelowSaleCoston = data[0].IsBelowSaleCoston;
// 		const IsOutOFStockon = data[0].IsOutOFStockon;

// 		const csvContent = `Minimum_Product_Price,Minimum_Quantity_Filter,IsBelowSaleCoston,IsOutOFStockon
//          ${Minimum_Product_Price},${Minimum_Quantity_Filter},${IsBelowSaleCoston},${IsOutOFStockon}`;

// 		// Directory path for the backups folder (adjust the path if needed)
// 		const backupsFolderPath = path.join(__dirname, 'backups');

// 		// Create the backups folder if it doesn't exist
// 		if (!fs.existsSync(backupsFolderPath)) {
// 			fs.mkdirSync(backupsFolderPath);
// 		}

// 		// File path for the backup CSV file
// 		const backupFilePath = path.join(backupsFolderPath, 'upload_settings_data_backup.csv');

// 		// Save the CSV data to the backup file
// 		fs.writeFile(backupFilePath, csvContent, 'utf8', (err) => {
// 			if (err) {
// 				console.error('Error writing file:', err);
// 			} else {
// 				console.log('Data saved to upload_settings_data_backup.csv');
// 				console.log('Backup file path:', backupFilePath);
// 			}
// 		});


// 	}




// 	//checking fourth condition
// 	if (freightRules == "on") {
// 		let freightRuless = await FreightRules.findAll();
// 		const result = {};
// 		freightRuless.forEach((item) => {
// 			// Extract the dataValues object from each item
// 			const { dataValues } = item;

// 			// Loop through the properties in dataValues
// 			Object.keys(dataValues).forEach((key) => {
// 				// Store the key-value pairs in the result object
// 				result[key] = result[key] || [];
// 				result[key].push(dataValues[key]);
// 			});
// 		});

// 		const csvContent = parse(result);

// 		// Directory path for the backups folder (adjust the path if needed)
// 		const backupsFolderPath = path.join(__dirname, 'backups');

// 		// Create the backups folder if it doesn't exist
// 		if (!fs.existsSync(backupsFolderPath)) {
// 			fs.mkdirSync(backupsFolderPath);
// 		}

// 		// File path for the backup CSV file
// 		const backupFilePath = path.join(backupsFolderPath, 'freight_rules_backup.csv');

// 		// Save the CSV data to the backup file
// 		fs.writeFile(backupFilePath, csvContent, 'utf8', (err) => {
// 			if (err) {
// 				console.error('Error writing file:', err);
// 			} else {
// 				console.log('Data saved to freight_rules_backup.csv');
// 				console.log('Backup file path:', backupFilePath);
// 			}
// 		});



// 	}

// 	//after creating backup files now we are redirecting to download route
// 	//download route will create archive and start download automatically
// 	res.redirect('/download');

// });




// Multer file upload configuration

// app.post('/admin/import', async function (req, res) {
// 	const { generals, distiSettings, uploadSettings, freightRules } = req.body;

// 	console.log('generals:', generals);
// 	console.log('file:', req.files);

// 	if (generals === 'on') {
// 		// Check if the uploaded file exists
// 		if (!req.files || !req.files.file) {
// 			return res.status(400).send('No file uploaded.');
// 		}

// 		// Create the "importbackups" folder if it doesn't exist
// 		const folderPath = 'importbackups/';
// 		if (!fs.existsSync(folderPath)) {
// 			fs.mkdirSync(folderPath);
// 		}

// 		const file = req.files.file;
// 		const filePath = `${folderPath}${file.name}`;

// 		// Move the uploaded file to the "importbackups" folder
// 		await file.mv(filePath);

// 		// Unzip the uploaded file and store it in the "importbackups" folder
// 		await fs.createReadStream(filePath)
// 			.pipe(unzipper.Extract({ path: folderPath }))
// 			.promise();

// 		// Clean up the temporary upload file
// 		fs.unlinkSync(filePath);

// 		// Log the file path
// 		console.log('File path:', filePath);
// 	} else {
// 		return res.status(400).send('Please select at least one checkbox.');
// 	}
// });



app.use(flash());
app.use("/", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
