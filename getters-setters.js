require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// connect to the databes two different method
// const seqInstance = new Sequelize("postgresql://localhost:5432/joco");
const seqInstance = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

const User = seqInstance.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        // we use this.getDataValue('username') instead of this.username because
        // this.username calls the get() function which creates an infinite loop
        const rawValue = this.getDataValue("username");
        return rawValue.toUpperCase();
      },
    },
    password: {
      type: DataTypes.STRING,
      // Currently SETTERS && GETTERS don't support asynchronous functions
      set(value) {
        const hashedPassword = value.toUpperCase();
        this.setDataValue("password", hashedPassword);
      },
    },
    // Virtual fields aren't saved into the database but they are used to get a derived state/value
    // based on the rest of the data saved in the DB
    aboutUser: {
      type: DataTypes.VIRTUAL,
      get() {
        // return `${this.username} ${this.description}`
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
