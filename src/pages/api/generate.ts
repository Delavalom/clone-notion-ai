// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";


type Data = {
  message: string;
  data?: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const prompt = req.body.prompt
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}:\n`,
      temperature: 0.8,
      max_tokens: 250,
    });
    console.log("resolve completion")
    const output = completion.data.choices.pop()?.text;
    res.status(200).json({ data: output, message: "succeded" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "please try again, something failed" });
  }
}
