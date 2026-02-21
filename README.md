# ORAU - Backend API

Esta es la API de ORAU, construida con **NestJS**. Proporciona los servicios necesarios para la gestión de productos, ventas, categorías, clientes (leads) y comunicación por correo.

## 🛠️ Tecnologías

- **Framework**: [NestJS](https://nestjs.com/)
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Almacenamiento de Imágenes**: [Cloudinary](https://cloudinary.com/)
- **Correos**: Nodemailer
- **Validación**: Class-validator & Class-transformer

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL corriendo localmente o en la nube

### Pasos
1. Clona el repositorio si aún no lo has hecho.
2. Entra al directorio: `cd backend`
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura el archivo `.env` basándote en el archivo de ejemplo (si existe) o los documentos del proyecto. Necesitarás:
   - Credenciales de la DB
   - Claves de Cloudinary
   - Configuración de SMTP para correos

5. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run start:dev
   ```

## 🔗 Enlaces Relacionados
- [Repositorio Frontend](../frontend)

---
Desarrollado para **Orgullo Austral**.
