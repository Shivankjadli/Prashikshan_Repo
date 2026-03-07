import axios from 'axios';

async function test() {
  try {
    // 1. Login as Recruiter
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'recruiter@example.com', // Let's guess the email or we can read the DB
      password: 'password123'
    });
    const token = loginRes.data.token;
    
    // We don't know the exact recruiter email. 
  } catch (err) {
    console.error(err);
  }
}
test();
