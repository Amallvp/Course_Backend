#Educational Platform API
Overview
This is a REST API built with Node.js and Express.js, allowing users to manage courses and quizzes.
It supports CRUD operations for both courses and quizzes and includes quiz-taking functionality.

#Features
CRUD operations for courses
CRUD operations for quizzes linked to courses
Submit answers and fetch quiz results
API documentation using Swagger/Postman
Error handling and validation

#Tech Stack
Backend: Node.js, Express.js
Database: PostgreSQL / MongoDB
Authentication: JWT 
API Documentation: Postman


#Installation & Setup

#Clone the Repository
git clone https://github.com/Amallvp/Course_Backend.git
cd educational-platform-api

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables
Create a .env file in the root directory and add:

MONGO_URI="mongodb+srv://newUser:newUser%401212@cluster0.xlvsd.mongodb.net/"
JWT_SECRET="smartpath@123123"
PORT=5000

4️⃣ Start the Serve
nodemon index.js
Server will run on http://localhost:5000.

5️⃣ API Documentation
Import the Postman Collection: will be attaching with mail

📌 Contribution
Fork the repo
Create a new branch (git checkout -b feature-branch)
Commit changes (git commit -m "Added new feature")
Push (git push origin feature-branch)
Open a Pull Request






