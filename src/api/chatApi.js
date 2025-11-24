import axios from "axios";

export const sendChatMessage = async (sessionId, question) => {
  const res = await axios.post("http://127.0.0.1:8000/chat", {
    session_id: sessionId,
    question,
  });

  console.log(res.data);

  return res.data.answer; // returns only answer
};
