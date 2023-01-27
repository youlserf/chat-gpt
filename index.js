let API_KEY = "your key";

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const configuration = new Configuration({
  organization: "org-vHm1BBvs59LOf9aubQpI1nhg",
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;
  console.log("message:", message);
  const response = await openai.createCompletion({
    model: `${currentModel}`, //"text-davinci-003",
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });

  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`Hello express port${port}}`);
});
