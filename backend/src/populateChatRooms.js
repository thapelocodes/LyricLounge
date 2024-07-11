const mongoose = require("mongoose");
const ChatRoom = require("./models/ChatRoom");

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

async function populateChatRooms() {
  await mongoose.connect("mongodb://localhost:27017/lyriclounge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const chatRooms = genres.map((genre) => ({
      name: genre,
      description: `${genre} music discussion`,
      users: [],
    }));

    await ChatRoom.insertMany(chatRooms);
    console.log("Chat rooms populated successfully");
  } catch (error) {
    console.error("Error populating chat rooms:", error);
  } finally {
    await mongoose.disconnect();
  }
}

prepopulateChatrooms();
