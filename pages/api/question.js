import db from "../../lib/db"; // Neon/Postgres connection

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { subject, question, options, correctOption } = req.body;

    if (!subject || !question || !options || !correctOption) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      await db`
        INSERT INTO questions (subject, question, option1, option2, option3, option4, correct_option)
        VALUES (${subject}, ${question}, ${options[0]}, ${options[1]}, ${options[2]}, ${options[3]}, ${correctOption})
      `;

      return res.status(200).json({ success: true, message: "Question added successfully" });
    } catch (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ success: false, message: "Database error", error: error.message });
    }

  } else if (req.method === "GET") {
    try {
      const rows = await db`SELECT * FROM questions`;

      const questions = rows.map(q => ({
        id: q.id,
        subject: q.subject,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        correctOption: q.correct_option
      }));

      return res.status(200).json({ success: true, questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      return res.status(500).json({ success: false, message: "Database fetch failed" });
    }

  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
