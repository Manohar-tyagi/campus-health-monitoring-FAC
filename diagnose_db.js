import db from './server/db.js';

async function diagnose() {
    try {
        const students = await db('students').select('*');
        const appointments = await db('appointments').select('*');
        console.log(`Total Students: ${students.length}`);
        console.log(`Total Appointments: ${appointments.length}`);
        if (appointments.length > 0) {
            console.log('Sample Appointment:', appointments[0]);
        }
    } catch (err) {
        console.error('Diagnosis Failed:', err);
    } finally {
        process.exit();
    }
}

diagnose();
