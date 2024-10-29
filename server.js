const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { scrapper } = require('./src/scrapper');

const app = express();
app.use(cors());

const port = process.env.PORT || 3030;

const config = {
    url: 'https://www.manageo.fr/secteurs',
    classes: '.FamilyList__ListUl-sc-1oilj10-1 li'
};

app.get('/activities', (req, res) => {
    scrapper({ url: config.url }, config.classes, (data) => {
        res.json(data);
    })
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));