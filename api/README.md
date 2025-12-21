# 1. Set Up Your Project

```npm init -y```

# 2. Install TypeScript and other dependencies:

```
npm install typescript ts-node express body-parser cors dotenv
npm install --save-dev @types/node @types/express @types/body-parser @types/cors
```

# 3 Install Prisma and Database Driver

```
npm install prisma @prisma/client mysql2
npx prisma init
```

## 3.1 Migration with Prisma
```
npx prisma migrate dev --name init
```
## 3.2 Seed with Prisma 
Create /seed.ts manualy
Add this one to package.json
```"
prisma": {
    "seed": "ts-node prisma\\seed.ts"
}
```
then run this cli statement
```
npx prisma db seed
```

## 3.3 Generate model from ```/scheme.prisma``` to PrismaClient (typescript class...)
```
npx prisma generate
```

# 3.4 Seed sample data (Exams/Questions/Rooms/Attempts)
```
npx prisma db seed
```

# 4. Generate API Documentation Automatically with TSOA, Prisma and Swagger-UI-Express
## 4.0 Config of tsconfig.json for this feature 
```json
{
  "compilerOptions": {
    /* Basic Options */
    "incremental": true,
    "target": "ES2023",
    "module": "commonjs",
    "outDir": "./dist",

    /* Strict Type-Checking Options */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

     /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Module Resolution Options */
    "moduleResolution": "node",
    "baseUrl": ".",
    "esModuleInterop": true,

    /* Experimental Options */
    "experimentalDecorators": true,
    // emitDecoratorMetadata is not needed by tsoa (unless you are using Custom Middlewares)

    /* Advanced Options */
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true,
    "types": ["node"],
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*.ts",  
    ],
  "exclude": ["node_modules", "dist"],
}
```

## 4.1 Working with TSOA 
### 4.1.1 Install and Setup 
- Create ```/tsoa.json``` file :
```json
    {
    "entryFile": "src/index.ts",
    "noImplicitAdditionalProperties": "throw-on-extras",
    "controllerPathGlobs": [
        "src/controllers/*Controller.ts"
    ],
    "spec": {
        "outputDirectory": "swagger",
        "specVersion": 3,
        "title": "QUIZZZ API Documentation",
        "version": "1.0.0",
        "description": "A description of QUIZZZ API",
        "basePath": "/api"
    },
    "routes": {
        "basePath": "/api",
        "routesDir": "src/routes"
    }
}
```

### 4.1.2 Intergrate Prisma Model to TSOA Controller for decornation API document
- Example ```controllers/UserController.ts```
```typescript
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import {
  Get,
  Route,
  Tags,
  Path,
  Post,
  Body,
  Controller,
  Response,
  SuccessResponse,
} from "tsoa";

const prisma = new PrismaClient();

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Get("/")
  public async getUsers(): Promise<PrismaUser[]> {
    return await prisma.user.findMany();
  }

  @Get("{id}")
  @Response<null>(404, "User not found")
  public async getUserById(@Path() id: number): Promise<PrismaUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.setStatus(404);
      return null;
    }

    return user;
  }

  @Post("/")
  @SuccessResponse("201", "User created")
  public async createUser(
    @Body()
    body: {
      username: string;
      fullname: string;
      hashPwd: string;
      email: string;
      phone: string;
    }
  ): Promise<{ message: string; user: PrismaUser }> {
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        fullname: body.fullname,
        hashPwd: body.hashPwd,
        email: body.email,
        phone: body.phone,
      },
    });
    this.setStatus(201);
    return { message: "User created", user: newUser };
  }
}
```
### 4.1.3 Gennerate route and Specification Swagger.json statements
- After define and decorate api doc for controllers run this statements to generate the ```routes/routes.ts``` file 
```cli
npx tsoa routes
```
- Run this statement to generate ```/swagger/swagger.json``` file
```cli
npx tsoa spec
```
## 4.2 Intergrate TSOA's routes and Swagger UI to Restful API Express

```typescript
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";

const app = express();

RegisterRoutes(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```


## 5. API Routes (schema v2)
- Auth
  - POST `/auth/login` body `{ email, password }`
- Exams
  - GET `/exams?subject&authorId&page&pageSize`
  - GET `/exams/{id}`
  - POST `/exams` (TEACHER) body `{ title, description, subject }`
  - PUT `/exams/{id}` (TEACHER owner/ADMIN) body `{ title?, description?, subject? }`
  - DELETE `/exams/{id}` (TEACHER owner/ADMIN)
- Questions
  - GET `/questions?examId&page&pageSize`
  - GET `/questions/{id}` includes choices
  - POST `/questions` (TEACHER/ADMIN) `{ examId, text, explanation?, type?, subject?, choices: [{content,isCorrect,order?}], points? }`
  - PUT `/questions/{id}` (TEACHER owner/ADMIN) `{ text?, explanation?, type? }`
  - DELETE `/questions/{id}` (TEACHER owner/ADMIN)
- Choices
  - GET `/choices?questionId&page&pageSize` (STUDENT will not see `isCorrect`)
  - GET `/choices/{id}` (STUDENT hides `isCorrect`)
  - POST `/choices` (TEACHER/ADMIN) `{ questionId, content, isCorrect?, order? }`
  - PUT `/choices/{id}` (TEACHER owner/ADMIN)
  - DELETE `/choices/{id}` (TEACHER owner/ADMIN)
- Rooms
  - GET `/rooms?examId&page&pageSize`
  - GET `/rooms/{id}`
  - POST `/rooms` (TEACHER/ADMIN) `{ examId, code?, openAt?, closeAt?, durationSec?, shuffleQuestions?, shuffleChoices?, maxAttempts? }`
- Attempts
  - GET `/attempts?examId&page&pageSize` (role-aware filtering)
  - GET `/attempts/{id}`
  - POST `/attempts` (STUDENT) `{ roomId, answers: [{ questionId, selectedChoiceId }] }`
  - DELETE `/attempts/{id}` (TEACHER owner/ADMIN)
- Attempt Answers
  - GET `/attempt-answers?attemptId`
  - GET `/attempt-answers/{id}`

Controllers filenames follow route names:
- `ExamsController.ts`, `QuestionsController.ts`, `ChoicesController.ts`, `RoomsController.ts`, `AttemptsController.ts`, `AttemptAnswersController.ts`, `UsersController.ts`, `AuthController.ts`.

To regenerate routes and OpenAPI spec after changes:
```
npx tsoa spec-and-routes
```


# TIPs
- list and write struct folders and files :
  - exclude node_module  ```tree /F /A /I | findstr /V "node_modules" > directory_structure.txt```
  - exclude many folder : ```tree /F /A | findstr /V "node_modules" | findstr /V "dist" > directory_structure.txt```

## Allow domain access to API
  - Client : change ```localhost``` to ```<new domain>``` name
  - Server :
    - Add CORS :
      ```js
        app.use(
          cors({
            origin: "http://192.168.1.3:5173",
          })
        );
      ```
    - Change vite.config.ts: 
      ```js
      server: {
        host: "0.0.0.0",
      }
      ```

## Allow other domain access to Database
  - Check white list to main :
    ```sql
    SELECT Host, User FROM mysql.user WHERE User = 'root';
    ```
  - Grant new domain to access MySQL 5.0 : 
    ```sql
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.1.3' IDENTIFIED BY 'admin';
    ```
 - Grant new domain to access MySQL 8.0 : 
    ```sql
    CREATE USER 'root'@'192.168.1.20' IDENTIFIED BY 'admin';
      GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.1.20' WITH GRANT OPTION;
      FLUSH PRIVILEGES;
   ```


## Production
1. Hosting config CPanel
   1.1 Setup DB
    Namechaeap missed Remote Access, using SSH instead
    - `npx prisma db push` push whole db to hosting without migration
   1.2 Setup Node App
    Search : Manage Shell -> Enable SSH access
    Use Terminal on web UI : will limit RAM for prisma generate, so switch to Putty SSH to generate prisma client
    Use Putty access by SSH need config key for local, detail here : https://www.youtube.com/watch?v=uP7Vo_tUAjs
   1.3 Restart Node App : change node version and npm install then wait 5 minute restart app will take effect
```shell 
source /home/minifuoh/nodevenv/that/22/bin/activate
which node
node -v
which npm
npm -v
```
