import express from 'express';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import FormData from 'form-data';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use('/animations', express.static('animations'));

// Ensure animations directory exists
if (!fs.existsSync('animations')) {
  fs.mkdirSync('animations');
}

// Supported AI Animation Services
const ANIMATION_SERVICES = {
  RUNWAY: {
    url: 'https://api.runwayml.com/v1/generate-animation',
    apiKey: process.env.RUNWAY_API_KEY,
  }
};

app.post('/animate', upload.array('images', 2), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length !== 2) {
      return res.status(400).json({ error: 'Two images are required' });
    }

    const [image1, image2] = files;
    const animationType = req.body.animationType || 'morph';

    // Choose AI service (in a real app, you might add logic to select or rotate services)
    const service = ANIMATION_SERVICES.RUNWAY;
    console.log(service.apiKey, service.url);

    // Create FormData for the API request
    const formData = new FormData();
    formData.append('image1', fs.createReadStream(image1.path));
    formData.append('image2', fs.createReadStream(image2.path));
    formData.append('animationType', animationType);

    // Call the selected AI service API
    const response = await axios.post(service.url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${service.apiKey}`,
      },
    });

    // Extract animation URL from the response
    const animationUrl = response.data.animationUrl;

    // Download the generated animation to the server
    const animationPath = `animations/${Date.now()}_animation.gif`;
    const animationResponse = await axios.get(animationUrl, { responseType: 'stream' });

    const writer = fs.createWriteStream(animationPath);
    animationResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Clean up uploaded images
    fs.unlinkSync(image1.path);
    fs.unlinkSync(image2.path);

    res.json({
      animationUrl: `/${animationPath}`,
      serviceUsed: 'Runway ML',
    });
  } catch (error) {
    console.error('Animation generation error:', error);
    res.status(500).json({ error: 'Failed to generate animation' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
