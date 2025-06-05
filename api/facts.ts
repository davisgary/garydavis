export async function handler(event: any) {
  const topics = [
    "artificial intelligence", "robotics", "quantum physics", "cybersecurity", "smart devices",
    "machine learning", "virtual reality", "blockchain", "future tech", "space exploration",
    "nature", "animals", "ocean", "trees", "plants", "gardening",
    "sustainable energy", "time travel", "memes", "deep sea creatures", "neural networks",
    "future trends", "fashion", "sports", "pop culture", "movies",
    "self-help", "productivity", "office structure", "focus", "cooking"
  ];

  const shuffledTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 20);

  try {
    const factPromises = shuffledTopics.map(async (topic) => {
      const prompt = `Give me a unique, clever, short, and lighthearted fact. Make it about ${topic}.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 1.2,
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim();
    });

    const facts = await Promise.all(factPromises);
    return {
      statusCode: 200,
      body: JSON.stringify(facts.filter(Boolean)),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}