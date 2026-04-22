import db from './server/db.js';

const symptomsPool = ['High Fever', 'Dry Cough', 'Fatigue', 'Sore Throat', 'Body Ache', 'Chills', 'Headache', 'Loss of Taste', 'Congestion', 'Sneezing'];
const severities = ['Routine', 'Urgent', 'Emergency'];
const names = [
    'Aadhya Saini', 'Aaditya Srivastava', 'Aadrika R Khusharia', 'Aanya Singh', 'Aarav Patel',
    'Abhay Pratap Singh Rathore', 'Abhist Sen Vaidya', 'Aditi', 'Aditya Singh', 'Akshat Raj',
    'Ankan Chatterjee', 'Arpit Gupta', 'Aryan Verma', 'Atharva Apte', 'Ayush Singh',
    'Bhavishay Singla', 'Daksh Srivastava', 'Devansh Rai', 'Dharmik Sabharwal', 'Dhruv Yadav',
    'Divyanshi Kant', 'Doyel Agarwal', 'Ekansh Pandey', 'Gargi Chauhan', 'Gaurav Sharma',
    'Geet Khandelwal', 'Granth Vats', 'Harsh Gupta', 'Harshit Thakur', 'Hemant Roy',
    'Hiten Singh', 'Hridhan Sharma', 'Ishita Prasad', 'Janvi Bhardwaj', 'Jeet Mishra',
    'Kamna Kumari', 'Kartik Virmani', 'Keshav Kumar', 'Khushi Rani', 'Komal Gupta',
    'Krish Sansanwal', 'Kuldeep Pant', 'Kunal Roshan'
];

async function seedAppointments() {
    try {
        const students = await db('students').select('*');
        const appointments = [];
        const date = '2026-03-04'; // Fixing to current simulation date/today

        for (let i = 0; i < 43; i++) {
            const student = students[Math.floor(Math.random() * students.length)];
            const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 9 PM
            const min = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = (hour > 12 ? hour - 12 : hour).toString().padStart(2, '0');
            const displayMin = min.toString().padStart(2, '0');
            const time = `${displayHour}:${displayMin} ${ampm}`;

            appointments.push({
                id: `APT-SEED-${i}-${Date.now()}`,
                patientId: student.id,
                studentId: student.id,
                name: student.name,
                email: student.email,
                severity: severities[Math.floor(Math.random() * severities.length)],
                symptoms: symptomsPool[Math.floor(Math.random() * symptomsPool.length)],
                date: date,
                time: time,
                status: 'Upcoming'
            });
        }

        await db('appointments').insert(appointments);
        console.log(`Successfully seeded 43 appointments for ${date}`);
    } catch (err) {
        console.error('Seeding Failed:', err);
    } finally {
        process.exit();
    }
}

seedAppointments();
