import express from 'express';
import {analyzeSEO, scrapeMeta, getSitemap} from '../controllers/index.js';
const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "SEO Analysis API"
    })
})

router.get('/analyze', analyzeSEO);
router.get('/scrape-meta', scrapeMeta);
router.get('/sitemap', getSitemap);


export default router;