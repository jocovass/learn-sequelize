require("dotenv").config();
const { Sequelize, DataTypes, Op } = require("sequelize");

const SI = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

const Student = SI.define(
  "student",
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20],
      },
    },
    favorite_class: {
      type: DataTypes.STRING(25),
      defaultValue: "Computer Science",
    },
    school_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subscribed_to_wittcode: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // By defualt it goes on the public schema
    // schema: "public",
    freezeTableName: true,
    timestamps: false,
  }
);

Student.sync({ alter: true })
  .then((data) => {
    // console.log(data);
    // return Student.bulkCreate(
    //   [
    //     {
    //       name: "Student 1",
    //       favorite_class: "Math",
    //       school_year: 1993,
    //       subscribed_to_wittcode: false,
    //     },
    //     {
    //       name: "Student 2",
    //       school_year: 2003,
    //       subscribed_to_wittcode: true,
    //     },
    //     {
    //       name: "Student 3",
    //       favorite_class: "English",
    //       school_year: 1999,
    //     },
    //     {
    //       name: "Student 4",
    //       favorite_class: "History",
    //       school_year: 2012,
    //       subscribed_to_wittcode: false,
    //     },
    //   ],
    //   { validate: true }
    // );
    // return null;
  })
  .then((students) => {
    console.log("Model synced successfully!");

    // get the name that matches the condition
    // return Student.findAll({
    //   attributes: ["name"],
    //   where: {
    //     [Op.or]: [
    //       { favorite_class: "Computer Science" },
    //       { subscribed_to_wittcode: true },
    //     ],
    //   },
    // });

    // group students by school year
    return Student.findAll({
      attributes: [
        "school_year",
        [SI.fn("COUNT", SI.col("school_year")), "num_students"],
      ],
      group: "school_year",
    });
  })
  .then((data) => console.log(data.forEach((d) => console.log(d.toJSON()))))
  .catch((error) => console.log(error));
