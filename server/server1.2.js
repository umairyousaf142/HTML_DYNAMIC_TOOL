// import express from 'express';
// import fs from 'fs/promises';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// // Create __filename and __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the path to the data file
// const dataFilePath = path.join(__dirname, 'newData.js');

// // Load initial data
// let newData;
// try {
//     newData = (await import('./newData.js')).newData;
// } catch (err) {
//     console.error('Error loading initial data:', err);
//     process.exit(1);  // Exit the process if data cannot be loaded
// }

// const app = express();
// const PORT = process.env.PORT || 3000; // Provide a default port if not defined

// // Middleware setup
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
// }));

// app.use(bodyParser.json());

// // Serve static files from the public folder
// app.use(express.static(path.join(__dirname, 'inde')));

// // Helper function to save the updated newData to file
// const saveNewDataToFile = async (updatedData) => {
//     const newFileContent = `const newData = ${JSON.stringify(updatedData, null, 2)};\nexport { newData };`;

//     try {
//         await fs.writeFile(dataFilePath, newFileContent, 'utf8');
//     } catch (err) {
//         console.error('Error writing file:', err);
//         throw new Error('Error updating data');
//     }
// };
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// // Endpoint to update query data
// app.post('/update-data', async (req, res) => {
//     const { updatedQuestions } = req.body;

//     if (!Array.isArray(updatedQuestions) || updatedQuestions.length === 0) {
//         return res.status(400).json({ success: false, message: 'Invalid data' });
//     }

//     try {
//         updatedQuestions.forEach((updatedQuestion) => {
//             const { id, question, phrase, isPositive } = updatedQuestion;
//             const questionIndex = newData.findIndex((item) => item.id === id);

//             if (questionIndex !== -1) {
//                 newData[questionIndex] = {
//                     ...newData[questionIndex],
//                     question: question || newData[questionIndex].question,
//                     phrase: phrase || newData[questionIndex].phrase,
//                     isPositive: typeof isPositive === 'boolean' ? isPositive : newData[questionIndex].isPositive
//                 };
//             } else {
//                 console.warn(`Question with id ${id} not found, skipping.`);
//             }
//         });

//         await saveNewDataToFile(newData);
//         res.json({ success: true, message: 'Data updated successfully' });
//     } catch (err) {
//         console.error('Error processing update:', err);
//         res.status(500).json({ success: false, message: 'Error processing update' });
//     }
// });

// // Endpoint to add a new question
// app.post('/add-question', async (req, res) => {
//     const { newQuestion, newPhrase, isPositive, index } = req.body;

//     if (!newQuestion || !newPhrase || typeof isPositive === 'undefined' || typeof index !== 'number') {
//         return res.status(400).json({ success: false, message: 'Invalid input data' });
//     }

//     // Find the next available ID
//     const existingIds = newData.map(item => item.id);
//     let newId = 1;
//     while (existingIds.includes(newId)) {
//         newId++;
//     }

//     const newQuestionObject = {
//         question: newQuestion,
//         phrase: newPhrase,
//         isPositive,
//         id: newId
//     };

//     try {
//         newData.splice(index, 0, newQuestionObject);
//         await saveNewDataToFile(newData);
//         res.json({ success: true, message: 'Question added successfully' });
//     } catch (err) {
//         console.error('Error processing add question:', err);
//         res.status(500).json({ success: false, message: 'Error adding question' });
//     }
// });

// // Endpoint to fetch data
// // app.get('/api/data', (req, res) => {
// //     // res.json(newData);
// //     res.end("this one ")
// // });
// app.get('/api/data', (req, res) => {
//     const sampleData = {
//         id: 1,
//         name: 'Sample Item',
//         description: 'This is a sample item.',
//         available: true
//     };

//     res.json(sampleData);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;



// API endpoint to get a welcome message
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello, welcome to my Express app!' });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

