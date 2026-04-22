import db, { initDb } from './server/db.js';

async function reset() {
    try {
        console.log("Starting Database Reset...");
        const tables = ['students', 'inventory', 'appointments', 'contacts', 'global_metrics', 'pathogen_metadata', 'daily_illness', 'opd_report', 'health_records'];
        for (const t of tables) {
            await db.schema.dropTableIfExists(t);
        }
        await initDb();
        console.log("Base Database Initialized (All Students Healthy, No Appointments).");
        console.log("Database reset complete.");
        process.exit(0);
    } catch (err) {
        console.error("Reset Failed:", err);
        process.exit(1);
    }
}

reset();
