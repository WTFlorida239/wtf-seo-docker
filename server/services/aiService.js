const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAltText(productTitle) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in e-commerce. Your task is to write a concise, descriptive, and keyword-rich alt text for a product image. Do not include phrases like 'Image of' or 'A picture of'. Focus on describing the product clearly."
        },
        {
          role: "user",
          content: `Generate alt text for an image of the following product: "${productTitle}"`
        }
      ],
      max_tokens: 25,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating alt text from OpenAI:', error);
    throw new Error('Failed to generate alt text.');
  }
}

async function generateSeoTitle(productTitle, productDescription) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in e-commerce. Your task is to write a compelling, SEO-optimized title tag for a product. It should be under 60 characters and include the main keyword naturally. Do not use quotes in the output."
        },
        {
          role: "user",
          content: `Generate an SEO title tag for a product titled "${productTitle}" with the description: "${productDescription.substring(0, 200)}..."`
        }
      ],
      max_tokens: 20,
    });
    return response.choices[0].message.content.replace(/"/g, '').trim();
  } catch (error) {
    console.error('Error generating SEO title from OpenAI:', error);
    throw new Error('Failed to generate SEO title.');
  }
}

async function generateSeoDescription(productTitle, productDescription) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in e-commerce. Your task is to write a compelling, SEO-optimized meta description for a product. It should be under 160 characters, include a call-to-action, and use keywords naturally. Do not use quotes in the output."
        },
        {
          role: "user",
          content: `Generate an SEO meta description for a product titled "${productTitle}" with the description: "${productDescription.substring(0, 400)}..."`
        }
      ],
      max_tokens: 50,
    });
    return response.choices[0].message.content.replace(/"/g, '').trim();
  } catch (error) {
    console.error('Error generating SEO description from OpenAI:', error);
    throw new Error('Failed to generate SEO description.');
  }
}

module.exports = {
  generateAltText,
  generateSeoTitle,
  generateSeoDescription,
};
