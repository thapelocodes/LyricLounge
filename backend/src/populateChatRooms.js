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

const prepopulateChatrooms = async () => {
  await mongoose.connect("mongodb://localhost:27017/lyriclounge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  for (let genre of genres) {
    await ChatRoom.create({
      name: genre,
      description: `A chatroom for ${genre} enthusiasts.`,
      users: [],
    });
  }

  console.log("Chatrooms prepopulated");
  mongoose.disconnect();
};

prepopulateChatrooms();
