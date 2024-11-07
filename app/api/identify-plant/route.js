import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = "Identifica esta planta y proporciona una breve descripción de sus características principales y cuidados básicos."
    
    const result = await model.generateContent([
      prompt, 
      { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
    ])
    const response = await result.response

    return NextResponse.json({ result: response.text() })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    )
  }
}