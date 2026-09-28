// Optional abstraction: used ONLY when Backend needs an AI call that does not
// go through an n8n workflow (per the approved architecture, n8n is the default
// path for AI/SEO/Affiliate orchestration - this is the exception, not the rule).
const axios = require('axios');

async function generateProductCopy({ titleAr, titleEn, features = [] }) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `اكتب وصف تسويقي جذاب بالعربية والإنجليزية لمنتج بعنوان "${titleAr}" / "${titleEn}" بالمزايا التالية: ${features.join(
            ', '
          )}. رد بصيغة JSON: {"ar": "...", "en": "..."}`,
        },
      ],
    },
    {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
    }
  );

  const textBlock = response.data.content.find((c) => c.type === 'text');
  return JSON.parse(textBlock.text);
}

module.exports = { generateProductCopy };
