// We are migrating from Gemini to Cohere due to rate limits while maintaining the old export names so the app doesn't break.
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY || "YOUR_COHERE_API_KEY";

const SAARTHI_PREAMBLE = `You are a helpful AI assistant for SAARTHI, an AI-powered travel safety platform.
SAARTHI provides real-time risk assessment, community-driven safety intelligence, interactive safety maps,
incident reporting, and emergency response features for travelers worldwide. 

Please provide helpful, accurate, and relevant responses about travel safety, the platform features, 
or general travel assistance. Keep responses concise and friendly.`;

export class GeminiService {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          model: 'command-r-08-2024', // Update to the specific active model
          preamble: SAARTHI_PREAMBLE
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Cohere Error:", response.status, errText);
        throw new Error(`Cohere API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.text || "Sorry, I couldn't generate a response. Please try again.";
    } catch (error: any) {
      console.error('Error generating response:', error);
      throw new Error(`Failed to generate response: ${error?.message || 'Unknown error'}`);
    }
  }

  // Fallback streaming that just returns the full text instantly (because Chatbot.tsx uses generic generateResponse anyway)
  async generateStreamResponse(prompt: string): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const fullText = await this.generateResponse(prompt);
      async function* streamGenerator() {
        yield fullText;
      }
      return streamGenerator();
    } catch (error) {
      console.error('Error generating stream response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();