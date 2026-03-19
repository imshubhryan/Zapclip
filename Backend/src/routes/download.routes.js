const express = require('express')
const {getVideoInfo,downloadVideo} = require('../controllers/download.controller')
const router = express.Router()



router.post('/info',getVideoInfo )
router.get('/download', downloadVideo);



module.exports = router