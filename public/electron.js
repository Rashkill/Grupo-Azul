const { app, BrowserWindow } = require('electron');
const  path = require("path"); 
const isDev = require("electron-is-dev");

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(app.getPath('userData'), 'Base_de_Datos.db')
const server = require("../server/index");

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.webContents.executeJavaScript()
  // and load the index.html of the app.
  win.loadURL(
      isDev ? 'http://localhost:3000' :  `file://${path.join(__dirname, "../build/index.html")}`
      )

  // Open the DevTools.
  if(isDev)
    win.webContents.openDevTools()
  win.maximize()

}

function createDB() {
  let db = new sqlite3.Database(dbPath);
//ACOMPAÑANTE
db.run(`CREATE TABLE IF NOT EXISTS "Acompañante" (
  "Id"	INTEGER NOT NULL UNIQUE,
  "Nombre"	TEXT NOT NULL,
  "Apellido"	TEXT NOT NULL,
  "DNI"	INTEGER NOT NULL UNIQUE,
  "CUIL"	TEXT NOT NULL,
  "EntidadBancaria"	TEXT NOT NULL,
  "CBU"	TEXT NOT NULL,
  "Domicilio"	TEXT NOT NULL,
  "Localidad"	TEXT,
  "CodigoPostal"	INTEGER NOT NULL,
  "Email"	TEXT NOT NULL,
  "Telefono"	INTEGER NOT NULL,
  "ValorHora"	INTEGER NOT NULL,
  "NumeroPoliza"	INTEGER NOT NULL,
  "NombreSeguros"	TEXT NOT NULL,
  "ConstanciaAFIP"	BLOB,
  "CV"	BLOB,
  "Latitud"	INTEGER,
  "Longitud"	INTEGER,
  "FechaEmision"	TEXT NOT NULL DEFAULT ' ',
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//Beneficiario
db.run(`CREATE TABLE IF NOT EXISTS "Beneficiario" (
  "Id"	INTEGER NOT NULL,
  "Nombre"	TEXT NOT NULL,
  "Apellido"	TEXT NOT NULL,
  "DNI"	INTEGER NOT NULL,
  "CUIL"	TEXT NOT NULL,
  "FechaNacimiento"	TEXT NOT NULL,
  "Domicilio"	TEXT NOT NULL,
  "Localidad"	TEXT NOT NULL,
  "CodigoPostal"	INTEGER NOT NULL,
  "Email"	TEXT NOT NULL,
  "Telefono"	INTEGER NOT NULL,
  "Enfermedades"	TEXT NOT NULL,
  "FichaInicial"	BLOB,
  "IdCoordinador"	INTEGER NOT NULL,
  "Seguimientos"	BLOB,
  "Latitud"	INTEGER,
  "Longitud"	INTEGER,
  "FechaEmision"	TEXT NOT NULL DEFAULT ' ',
  PRIMARY KEY("Id" AUTOINCREMENT),
  FOREIGN KEY("IdCoordinador") REFERENCES "Coordinador"("Id")
);`);
//ContratosAcompañante
db.run(`CREATE TABLE IF NOT EXISTS "ContratoAcompañante" (
  "Id"	INTEGER NOT NULL,
  "IdAcompañante"	INTEGER NOT NULL,
  "Fecha"	TEXT NOT NULL,
  "Archivo"	BLOB NOT NULL,
  "NombreArchivo"	TEXT NOT NULL,
  FOREIGN KEY("IdAcompañante") REFERENCES "Acompañante",
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//ContratosCoord
db.run(`CREATE TABLE IF NOT EXISTS "ContratoCoordinador" (
"Id"	INTEGER NOT NULL,
"IdCoordinador"	INTEGER NOT NULL,
"Fecha"	TEXT NOT NULL,
"Archivo"	BLOB NOT NULL,
"NombreArchivo"	TEXT NOT NULL,
FOREIGN KEY("IdCoordinador") REFERENCES "Coordinador"("Id"),
PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//Coordinador
db.run(`CREATE TABLE IF NOT EXISTS "Coordinador" (
  "Id"	INTEGER NOT NULL UNIQUE,
  "Nombre"	TEXT NOT NULL,
  "Apellido"	TEXT NOT NULL,
  "DNI"	INTEGER NOT NULL UNIQUE,
  "CUIL"	TEXT NOT NULL UNIQUE,
  "EntidadBancaria"	TEXT NOT NULL,
  "CBU"	TEXT NOT NULL,
  "Domicilio"	TEXT NOT NULL,
  "Localidad"	TEXT NOT NULL,
  "CodigoPostal"	INTEGER NOT NULL,
  "ValorMes"	INTEGER NOT NULL,
  "ConstanciaAFIP"	BLOB,
  "CV"	BLOB,
  "Latitud"	INTEGER,
  "Longitud"	INTEGER,
  "FechaEmision"	TEXT NOT NULL DEFAULT ' ',
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//Jornada
db.run(`CREATE TABLE IF NOT EXISTS "Jornada" (
"Id"	INTEGER NOT NULL UNIQUE,
"IdBeneficiario"	INTEGER NOT NULL,
"IdAcompañante"	INTEGER NOT NULL,
"FechaIngreso"	TEXT NOT NULL,
"FechaEgreso"	TEXT NOT NULL,
"CantHoras"	INTEGER NOT NULL,
FOREIGN KEY("IdAcompañante") REFERENCES "Acompañante"("Id"),
FOREIGN KEY("IdBeneficiario") REFERENCES "Beneficiario"("Id"),
PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//Liquidacion
db.run(`CREATE TABLE IF NOT EXISTS "Liquidacion" (
"Id"	INTEGER NOT NULL UNIQUE,
"IdBeneficiario"	INTEGER NOT NULL,
"FechaEmision"	TEXT NOT NULL,
"Desde"	TEXT NOT NULL,
"Hasta"	TEXT NOT NULL,
FOREIGN KEY("IdBeneficiario") REFERENCES "Beneficiario"("Id"),
PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//NotaBenef
db.run(`CREATE TABLE IF NOT EXISTS "NotaBeneficiario" (
  "Id"	INTEGER NOT NULL,
  "IdBeneficiario"	INTEGER NOT NULL,
  "Fecha"	TEXT NOT NULL,
  "Archivo"	BLOB NOT NULL,
  "NombreArchivo"	TEXT NOT NULL,
  FOREIGN KEY("IdBeneficiario") REFERENCES "Beneficiario"("Id"),
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//PagoMonotributoAcomp
db.run(`CREATE TABLE IF NOT EXISTS "PagoMonotributoAcompañante" (
  "Id"	INTEGER NOT NULL,
  "IdAcompañante"	INTEGER NOT NULL,
  "Fecha"	TEXT NOT NULL,
  "Archivo"	BLOB NOT NULL,
  "NombreArchivo"	TEXT NOT NULL,
  FOREIGN KEY("IdAcompañante") REFERENCES "Acompañante"("Id"),
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
//PagoMonotributoCoord
db.run(`CREATE TABLE IF NOT EXISTS "PagoMonotributoCoordinador" (
  "Id"	INTEGER NOT NULL,
  "IdCoordinador"	INTEGER NOT NULL,
  "Fecha"	TEXT NOT NULL,
  "Archivo"	BLOB NOT NULL,
  "NombreArchivo"	TEXT NOT NULL,
  FOREIGN KEY("IdCoordinador") REFERENCES "Coordinador"("Id"),
  PRIMARY KEY("Id" AUTOINCREMENT)
);`);
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => { createDB(); createWindow(); })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
