import fetch from "node-fetch";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("dotenv").config();
const fs = require("fs");

export async function get_uuid(voice, text) {
  const url = "https://api.uberduck.ai/speak";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "uberduck-id": "anonymous",
      "Content-Type": "application/json",
      Authorization: `${process.env.AUTHORIZATION}`,
    },
    body: JSON.stringify({ voice: voice, pace: 1, speech: text }),
  };

  let res = await fetch(url, options);
  let json = await res.json();

  return json.uuid;
}

export function get_path(uuid) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const url = `https://api.uberduck.ai/speak-status?uuid=${uuid}`;
      const options = {
        method: "GET",
        headers: { Accept: "application/json" },
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          if (json.path == null) {
            get_path(uuid).then((path) => {
              resolve(path);
            });
          } else {
            resolve(json.path);
          }
        });
    }, 1000);
  });
}
