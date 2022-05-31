const express = require("express");

const app = express();

app.use(express.static("."));

app.listen(1000, () => {
	console.log("running on 1000\nhttp://localhost:1000");
});
