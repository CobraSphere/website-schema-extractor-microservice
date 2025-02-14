'use strict';

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

module.exports = async function (fastify, opts) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string', format: 'uri' },
          },
        },
      },
    },
    async function (request, reply) {
      const { url } = request.query;

      try {
        console.log(`🚀 Extracting JSON-LD from: ${url}`);
        const structuredData = await extractJsonLd(url);

        if (!structuredData.length) {
          return reply.status(404).send({
            success: false,
            message: 'No schema.org JSON-LD data found.',
          });
        }

        return reply.send({
          success: true,
          url,
          extracted: structuredData.length,
          data: structuredData,
        });
      } catch (error) {
        console.error('❌ Error fetching schema:', error);
        return reply.status(500).send({
          success: false,
          message: 'Failed to extract schema data.',
          error: error.message,
        });
      }
    }
  );
};

// ✅ Puppeteer Function to Extract JSON-LD
async function extractJsonLd(url) {
  console.debug(`🚀 Fetching JSON-LD from: ${url}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // '--disable-http2'
    ],
  });

  const page = await browser.newPage();

  // Force HTTP/1.1 headers
  // await page.setExtraHTTPHeaders({
  //   'Upgrade-Insecure-Requests': '1',
  // });

  // await page.setExtraHTTPHeaders({ 'Upgrade-Insecure-Requests': '1' });
  // await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // ✅ Fetch schema.org JSON-LD
  const jsonLdData = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(script => script.innerText)
      .filter(Boolean);
  });

  await browser.close();

  // ✅ Parse JSON safely & only return valid `schema.org` data
  const parsedData = jsonLdData
    .map((json) => {
      try {
        const data = JSON.parse(json);
        return data['@context']?.includes('schema.org') ? data : null;
      } catch (e) {
        console.error('❌ Failed to parse JSON:', json);
        return null;
      }
    })
    .filter(Boolean);

  console.debug(`✅ Extracted ${parsedData.length} JSON-LD objects`);
  console.debug(JSON.stringify(parsedData, null, 2));

  return parsedData;
}
