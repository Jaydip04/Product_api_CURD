import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
const app = express();
import products from "./product.js";

dotenv.config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGOURI;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Product API CRUD");
});

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database connected successfully");

    ///****** Post api ******///
    app.post("/api/add_product", async (req, res) => {
      res.send('PONG')
      console.log("Result", req.body);

      let data = products(req.body);
      try {
        let dataToStore = await data.save();
        res.status(200).json(dataToStore);
        console.log(dataToStore);
      } catch (error) {
        res.status(400).json({
          status: error.message,
        });
      }
    });

    ///****** Get api ******///
    app.get("/api/get_product", async (req, res) => {
      try {
        let data = await products.find();
        res.status(200).send({
          status_code: 200,
          message: "Product get successfully",
          product: data,
        });
        // res.status(200).json(data);
      } catch (e) {
        res.status(500).json(e.message);
      }
    });

    ///****** Update api ******///

    app.patch("/api/update/:id", async (req, res) => {
      let id = req.params.id;
      let updatedData = req.body;
      let options = { new: true };

      try {
        const data = await products.findByIdAndUpdate(id, updatedData, options);
        res.send(data);
      } catch (e) {
        res.send(e.message);
      }
    });

    ///****** Delete api ******///

    app.delete("/api/delete/:id", async (req, res) => {
      let id = req.params.id;
      try {
        const data = await products.findByIdAndDelete(id);
        res.json({
          status: "Deleted the product ${data.name} from database",
        });
      } catch (e) {
        res.json(e.message);
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
}

connectDB();

// app.listen(2000, () => {
//   console.log("Connected to server 2000");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
