const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");

const userLogin = (req, res) => {
    res.json({status:"success", data: {
        userId: "1"
    }});
};

const getUser = (req, res) => {
    res.json({status:"success", data: {
        userId: "1",
        name: "James Smith"
    }});
};

module.exports = {
	userLogin,
	getUser
};