# Lucid Contributions

## Description

Lucid Contributions visualizes contributor-recipient networks in political campaign contribution data.

Born out of Bellingcat's OSINT Tools Hackathon 23-25 September 2022.

## Installation

1. Install node: `https://docs.npmjs.com/downloading-and-installing-node-js-and-npm`

2. Download lucid-contributions:

        git clone git@github.com:shubaly/lucid-contributions.git

3. Move to the tool's source directory and install the tool

        cd lucid-contributions
        cd src
        npm install
        npm start

4. Open in browser

        http://localhost:3000/ 

## Usage

- Download campaign contribution datasets,
  e.g. `https://www.elections.ca/content.aspx?section=fin&dir=oda&document=index&lang=e`
    - Copy data to `./public/data.csv`
    - Required fields: `Recipient,Political Party of Recipient,Contributor name,Monetary amount`
- Sample visualizaton:
  ![Lucid Contributions Screenshot](screenshot.png)

### Additional Information

- Next Steps
    - ~~Fix packaging/installation~~
    - Make this work with any jurisdiction's data without code changes!

- Enhancements
    - Make nodes draggable so researchers can reposition
    - Size nodes based on contribution value (+ sum for recipients)
    - Add ability to search for contributor / recipient

- Built with [Sigma.js](https://www.sigmajs.org/)
