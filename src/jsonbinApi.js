const BIN_ID = "689f0b0b43b1c97be91ee4eb"; // your actual bin ID
const API_KEY = "$2a$10$gIm5YhpFRa.UzFf9UYuOyuGI8Rpb91wRyRCApyn/23RudpbhTTyl."; // optional — only needed if private

export async function fetchUsers() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: API_KEY ? { "X-Master-Key": API_KEY } : {}
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await res.json();
  return data.record.user;
}
