const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./to-do-f57e4-firebase-adminsdk-znox1-9110e1b4fd.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://to-do-f57e4.firebaseio.com' // Replace <YOUR_PROJECT_ID> with your actual project ID
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { text, completed = false } = req.body; // Set default value for completed
    const docRef = db.collection('tasks').doc(); // Create a new document reference

    await docRef.set({
      text,
      completed,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).send({ id: docRef.id });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Error creating task');
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').get();
    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.send(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

// Update a task
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const docRef = db.collection('tasks').doc(id);
    await docRef.update({
      text,
      completed
    });

    res.send('Task updated');
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task');
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('tasks').doc(id);
    await docRef.delete();

    res.send('Task deleted');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
  }
});

app.listen(3010, '0.0.0.0', () => {
  console.log('Server is running on https://975d-103-80-12-159.ngrok-free.app');
});
