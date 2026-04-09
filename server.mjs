//Conected to LaunchDarkly SDK for Node.js
//Feature flag set to true
import * as LaunchDarkly from "@launchdarkly/node-server-sdk";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Inicializar cliente de LaunchDarkly
const client = LaunchDarkly.init(process.env.LD_SDK_KEY);

// Contexto del usuario para evaluación de flags
const context = {
  kind: "user",
  key: "user-key-123abcde",
  email: "test@example.com",
};

client.once("ready", function () {
  console.log("SDK successfully initialized!");

  app.get("/", async (req, res) => {
    // Tracking de eventos
    client.track(process.env.LD_EVENT_KEY, context);

    // Evaluación del feature flag
    client.variation(
      "feat-new-menu",
      context,
      false, // Valor por defecto si el flag no existe
      function (err, showFeature) {
        if (showFeature) {
          console.log("feature true");
          res.send("🎉 Feature flag is ON - New menu active!");
        } else {
          console.log("feature false");
          res.send("Feature flag is OFF - Original menu");
        }
      }
    );
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});