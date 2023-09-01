const express = require("express");
const router = express.Router();
const Controller = require(`${__dirname}/../controller/home.controller`);

router.get("/home", Controller.home);
router.get("/dasbroad", Controller.dasbroad);
router.get("/status", Controller.status);
router.get("/getDashBroad", Controller.getDashBroad);
router.post("/getDay", Controller.getDay);
module.exports = router;
