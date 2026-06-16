import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://digitaleliteservices2025_db_user:QUgQ6JuQJsM47ukz@cluster0.q6cp84t.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("Connected successfully");
} catch (err) {
  console.error(err);
}
