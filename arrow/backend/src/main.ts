import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '../../.env'); // Chemin vers le .env dans le répertoire backend
console.log('Chemin du fichier .env:', envPath);

const result = config({ path: envPath });
console.log('Résultat du chargement .env:', result);
console.log('MONGO_URI chargée :', process.env.MONGO_URI);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS pour éviter les erreurs avec le frontend
  app.enableCors();

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

  // Définition du port avec une variable d’environnement
  const port = (process.env.PORT as unknown as number) || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();