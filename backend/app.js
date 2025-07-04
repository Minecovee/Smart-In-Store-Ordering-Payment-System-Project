const express = require('express');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// เส้นทางทดสอบง่ายๆ
app.get('/', (req, res) => {
  res.send('📡 Server is running...');
});

// เชื่อมต่อฐานข้อมูลและเริ่มเซิร์ฟเวอร์
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to the database successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });
