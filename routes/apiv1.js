const express = require('express');
const router = express.Router();

// Fall back, display some info
router.all('*', function (req, res) {
    res.status(200);
    res.json({
        "description": "Movie API version 1, please use api V2"
    });
});

module.exports = router;