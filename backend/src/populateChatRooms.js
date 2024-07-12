const mongoose = require("mongoose");
const ChatRoom = require("./models/ChatRoom");
require("dotenv").config();

const genres = [
  "Hip-Hop",
  "Pop",
  "RnB",
  "Jazz",
  "Classical",
  "Alternative",
  "Rock",
  "Soul",
  "Funk",
  "Dance",
  "House",
  "Electronic",
  "Reggae",
  "Country",
  "Folk",
  "Disco",
  "Blues",
  "Indie",
  "Amapiano",
  "Kwaito",
  "Gospel",
  "Barcadi",
];

const prepopulateChatRooms = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const chatRooms = genres.map((genre) => ({
      name: genre,
      description: `${genre} music discussion`,
      creator: null,
      users: [],
    }));

    await ChatRoom.insertMany(chatRooms);
    console.log("Chat rooms populated successfully");
  } catch (error) {
    console.error("Error populating chat rooms:", error);
  } finally {
    await mongoose.connection.close();
  }
};

prepopulateChatRooms();
