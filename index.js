const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://socialMedia:0ecElOREQnUXzk8O@cluster0.hesma7h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db('socialMediaDB').collection('posts');
        const usersCollection = client.db('socialMediaDB').collection('users');

        app.post('/posts/new', async (req, res) => {
            const response = await postCollection.insertOne(req.body);
            res.send(response);
        });

        app.get('/posts', async (req, res) => {
            const result = await postCollection.find({}).toArray();
            const storedResult = result.sort((a, b) => b.love - a.love);
            res.send(storedResult);
        });

        app.post('/users/new', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const result = await usersCollection.findOne({ email: email });
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updateuser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateuser, option);
            res.send(result);
        });

        app.get('/detail/:id', async (req, res) => {
            const postId = req.params.id;
            const response = await postCollection.findOne({ _id: ObjectId(postId) });
            res.json(response);
        });

    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('social media server is running');
});

app.listen(port, () => console.log(`Social media running on ${port}`));