// Package Modules
import Sequelize from "sequelize";

// Custom Modules
import { User } from "./users.js";
import { Post } from "./post.js";
import { Hashtag } from "./hashtag.js";
import Config from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export const db = {};
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

export default db;
