
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});



export async function getEmbedding(text: string): Promise<number[] > {
  const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config:{
          outputDimensionality: 768
        }
         
    });

    const embeddings = response.embeddings![0].values

    if(!embeddings){
      throw new Error("No embeddings returned from Gemini");
    }
    else{
      return embeddings;
    }

  
}
