const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
    const files = [
        './dist/wickeyappstorejs/runtime.js',
        './dist/wickeyappstorejs/polyfills.js',
        './dist/wickeyappstorejs/scripts.js',
        './dist/wickeyappstorejs/main.js',
    ]

    await fs.ensureDir('elements')

    await concat(files, 'elements/wickeyappstore.js');

    await fs.copyFile('./dist/wickeyappstorejs/styles.css', 'elements/styles.css')

    // await fs.copy('./dist/wickeyappstorejs/assets/', 'elements/assets/' )

})()
