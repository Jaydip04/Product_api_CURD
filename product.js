import mongoose from "mongoose";

let dataSchema = new mongoose.Schema({
  pname: String,
  pprice: String,
  pdesc: String,
});

export default mongoose.model("node_js", dataSchema);
