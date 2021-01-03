import app from './server';

// Start the application by listening to specific port
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.info('application started on port: ' + port);
});

