import { exec } from 'child_process';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import axios from 'axios';
import xml2js from 'xml2js';

export const analyzeSEO = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }
  try {
    exec(
      `npx lighthouse ${url} --output=json --quiet`,
      (err, stdout, stderr) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        const lighthouseData = JSON.parse(stdout);
        const {
          lighthouseVersion,
          requestedUrl,
          mainDocumentUrl,
          finalDisplayedUrl,
          finalUrl,
          fetchTime,
          categories,
        } = lighthouseData;
        const { id, score } = categories.seo;
        return res.json({
          success: true,
          lighthouseVersion,
          requestedUrl,
          mainDocumentUrl,
          finalDisplayedUrl,
          finalUrl,
          fetchTime,
          id,
          score,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const scrapeMeta = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }
  try {
    const { data: html } = await axios.get(url);
    const meta = await metascraper([
      metascraperTitle(),
      metascraperDescription(),
    ])({ html, url });
    return res.status(200).json({ success: true, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getSitemap = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }
  try {
    const { data: xml } = await axios.get(url);
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
      }
      return res.status(200).json({ success: true, result });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
