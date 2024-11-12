const fs = require('fs');
const dotenv = require('dotenv');



// Detecta si estás en Appflow (ENV debería estar configurado en las variables de entorno de Appflow)

const isAppflow = !!process.env.ENV && !process.env.LOCAL_ENV;

const envFilePath = isAppflow ? null : '.env';

const environmentFile = (process.env.ENV || 'development') === 'development' ? `environment.ts` : "environment.prod.ts";



// Carga las variables de entorno desde el archivo local si no está en Appflow

let envConfig = {};

if (!isAppflow && envFilePath) {
    try {
      envConfig = dotenv.parse(fs.readFileSync(envFilePath));
    } catch (error) {
      console.warn(`Warning: No se pudo encontrar el archivo ${envFilePath}. Usando las variables de entorno.`);
    }
  } else {

 // Usa process.env directamente en Appflow

 envConfig = {

    production: true,
    API_URL: process.env.API_URL || '',
    API_KEY_FIREBASE: process.env.API_KEY_FIREBASE || '',
    AUTH_DOMAIN: process.env.AUTH_DOMAIN || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    PROJECT_ID: process.env.PROJECT_ID || '',
    STORAGE_BUCKET: process.env.STORAGE_BUCKET || '',
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID || '',
    MEASUREMENT_ID: process.env.MEASUREMENT_ID || '',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || ''

 };

}



// Genera el archivo de entorno para Angular

fs.writeFileSync(

 `./src/environments/${environmentFile}`,

 'export const environment = ' + JSON.stringify(envConfig) + ';'

);



console.log(`Archivo de entorno generado en ${environmentFile} para el entorno ${process.env.ENV || 'desarrollo'}`);

