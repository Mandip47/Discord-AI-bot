import Replicate from "replicate";
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;
const channelID = process.env.DISCORD_CHANNEL_ID;

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`);
  });
  
  const replicateFunction = async (userMessage) => {
    try {
        const channel = bot.channels.cache.get(channelID);
        if (channel) {
            channel.sendTyping();
        }

      const output = await replicate.run(
        "meta/llama-2-70b-chat:2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
        {
          input: {
            debug: false,
            top_p: 1,
            prompt: userMessage, // Set the prompt to the user's message
            temperature: 0.5,
            system_prompt:
              "You are a helpful, respectful, and honest assistant tailored for Class 12 Science Group students following the NEB (National Examination Board) syllabus in Nepal. Always provide assistance in a concise, accurate, and learning-focused manner and of less then 7 sentences. Your answers should align with the curriculum, promoting positive learning experiences. Avoid including any harmful, unethical, or inappropriate content. If a question is unclear or lacks coherence, kindly explain the issue rather than providing inaccurate information. If you are unsure about an answer, refrain from sharing false information. Your goal is to support students in their academic journey within the scope of the NEB Class 12 Science Group syllabus.",
            max_new_tokens: 500,
            min_new_tokens: -1,
          },
        }
      );
  
      console.log(output.join(''));
      
      
      if (channel) {
        channel.sendTyping();
        channel.send(output.join(''));
      }

    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  
  // Assuming 'bot' is your Discord.js Client
  bot.on('messageCreate', (message) => {
    // Ignore messages from other bots
    if (message.author.bot) return;
  
    // Call the function with the user's message as the prompt
    replicateFunction(message.content);
  });
  

bot.login(discordToken);
