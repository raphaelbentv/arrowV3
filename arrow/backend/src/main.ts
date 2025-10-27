import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '../../.env'); // Chemin vers le .env dans le répertoire backend
console.log('Chemin du fichier .env:', envPath);

const result = config({ path: envPath });
console.log('Résultat du chargement .env:', result);
console.log('MONGODB_URI chargée :', process.env.MONGODB_URI);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Intervenants')
    .setDescription("Documentation de l'API des intervenants")
    .setVersion('1.0')
    .addBearerAuth() // Ajoute un champ d'authentification
    .addTag('intervenants')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Définition du port avec une variable d'environnement
  const port = process.env.PORT || 4000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();