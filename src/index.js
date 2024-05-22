"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
import { routes } from "./routes";
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(
  (0, cors_1.default)({
    origin: [
      "http://localhost:4200",
      "https://localhost:8080",
      "https://localhost:3000",
    ],
    credentials: true,
  })
);
const MONGODB_URI = process.env.MONGODB_URI;
mongoose_1.default
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("MongoDB'ye bağlantı başarılı");
  })
  .catch((err) => {
    console.error("MongoDB'ye bağlanırken hata oluştu:", err);
    process.exit(1);
  });
(0, routes)(app);
app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
