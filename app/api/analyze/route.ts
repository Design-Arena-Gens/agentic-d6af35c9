import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
})

export async function POST(request: NextRequest) {
  try {
    const { image, mealType } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Vercel environment variables.' },
        { status: 500 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a nutrition analysis expert specialized in identifying food items from photos and estimating protein content.

Your task:
1. Identify all visible food items in the image
2. Estimate the quantity/portion size for each food item
3. Calculate the protein content in grams for each item based on standard nutritional data
4. Provide accurate estimates based on Indian and international dietary references

Response format (JSON only):
{
  "foods": [
    {
      "name": "Food name",
      "quantity": "Estimated quantity with unit (e.g., 150g, 1 cup, 2 pieces)",
      "protein": 25.5
    }
  ],
  "totalProtein": 50.5,
  "confidence": "high/medium/low"
}

Be conservative with estimates. If unsure about quantity, provide a reasonable range. Focus on accuracy over precision.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this ${mealType} meal and estimate the protein content for each food item visible.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Extract JSON from the response (handling markdown code blocks)
    let jsonStr = content.trim()
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7)
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3)
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3)
    }

    const analysis = JSON.parse(jsonStr.trim())

    return NextResponse.json({
      foods: analysis.foods,
      totalProtein: analysis.totalProtein,
      confidence: analysis.confidence,
    })
  } catch (error) {
    console.error('Error analyzing meal:', error)
    return NextResponse.json(
      { error: 'Failed to analyze meal' },
      { status: 500 }
    )
  }
}
