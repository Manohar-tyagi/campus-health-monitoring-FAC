export const generateMockData = () => {
    // 1. Users (100 Students + Staff)
    const users = [];
    const boyNames = [
        "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
        "Shaurya", "Atharv", "Rohan", "Dhruv", "Kabir", "Rahul", "Amit", "Karan", "Vikram", "Raj",
        "Suresh", "Ramesh", "Anil", "Sunil", "Ashok", "Siddharth", "Manish", "Deepak", "Ravi", "Vijay"
    ];
    const girlNames = [
        "Anaya", "Diya", "Myra", "Saanvi", "Aadhya", "Kiara", "Pari", "Anvi", "Riya", "Vanya",
        "Sarah", "Prisha", "Fatima", "Samaira", "Zara", "Priya", "Sneha", "Simran", "Neha", "Pooja",
        "Geeta", "Seema", "Meena", "Reena", "Kavita", "Anjali", "Sushma", "Rekha", "Suman", "Anita"
    ];
    const lastNames = [
        "Sharma", "Gupta", "Singh", "Kumar", "Reddy", "Das", "Malhotra", "Iyer", "Verma", "Jain",
        "Mishra", "Mehta", "Patel", "Joshi", "Kapoor", "Khan", "Nair", "Rao", "Sen", "Choudhury",
        "Saxena", "Biswas", "Trivedi", "Dsouza", "Bhat", "Sheikh", "Agarwal", "Bansal", "Chopra", "Dutta"
    ];

    for (let i = 1; i <= 100; i++) {
        const isBoy = Math.random() > 0.5;
        const firstName = isBoy
            ? boyNames[Math.floor(Math.random() * boyNames.length)]
            : girlNames[Math.floor(Math.random() * girlNames.length)];
        const lastName = lastNames[i % lastNames.length];

        const id = `niit${String(i).padStart(3, '0')}`;
        const name = `${firstName} ${lastName}`;

        const boyHostels = ['UG1', 'UG2'];
        const girlHostels = ['PG1', 'PG2'];
        const hostel = isBoy
            ? boyHostels[Math.floor(Math.random() * boyHostels.length)]
            : girlHostels[Math.floor(Math.random() * girlHostels.length)];

        const room = `${(i % 4) + 1}0${(i % 10)}`;

        let status = 'Healthy';
        const rand = Math.random();
        if (rand < 0.10) status = 'Infected';
        else if (rand < 0.25) status = 'Recovered';

        // Extended Profile Data
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

        const allergiesList = [
            'None', 'None', 'None', 'None',
            'Peanuts', 'Dust Mites', 'Pollen', 'Penicillin', 'Dairy', 'Shellfish', 'Soy', 'Latex'
        ];

        const conditions = [
            'None', 'None', 'None', 'None', 'None',
            'Mild Asthma', 'Diabetes Type 1', 'Migraine', 'Anemia', 'Hypothyroid',
            'Previous Fracture (Arm)', 'Lactose Intolerance', 'Seasonal Allergies'
        ];

        const branches = ['CSE', 'ECE', 'BT', 'DS', 'AI', 'CyberSec'];
        const batches = ['2022', '2023', '2024', '2025'];

        users.push({
            id,
            name,
            email: `${id}@st.niituniversity.in`,
            role: i <= 2 ? 'Admin' : 'Student',
            hostel,
            room,
            status,
            // Extended Fields
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            age: 17 + Math.floor(Math.random() * 6), // 17-23
            bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
            allergies: allergiesList[Math.floor(Math.random() * allergiesList.length)],
            medicalHistory: conditions[Math.floor(Math.random() * conditions.length)],

            // Academic & Emergency
            branch: branches[Math.floor(Math.random() * branches.length)],
            batch: batches[Math.floor(Math.random() * batches.length)],
            emergencyContact: {
                name: `${lastNames[Math.floor(Math.random() * lastNames.length)]} Parent`,
                phone: `+91 ${9000000000 + Math.floor(Math.random() * 1000000000)}`
            }
        });
    }

    // 2. Inventory with varied Thresholds
    // Default threshold logic:
    // Medicine: 20
    // Equipment: 3
    // Consumables: 50
    // Supplements: 40

    const inventory = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Fever', stock: 45, threshold: 50 },
        { id: 2, name: 'Cetirizine 10mg', category: 'Allergy', stock: 100, threshold: 30 },
        { id: 3, name: 'Bandages (Small)', category: 'First Aid', stock: 12, threshold: 25 },
        { id: 4, name: 'ORS Packets', category: 'Dehydration', stock: 200, threshold: 75 },
        { id: 5, name: 'Cough Syrup', category: 'Cold/Flu', stock: 8, threshold: 15 },
        { id: 6, name: 'Betadine Ointment', category: 'Antiseptic', stock: 40, threshold: 15 },
        { id: 7, name: 'Dolo 650', category: 'Fever', stock: 25, threshold: 50 },
        { id: 8, name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 80, threshold: 30 },
        { id: 9, name: 'Vicks Vaporub', category: 'Cold/Flu', stock: 25, threshold: 15 },
        { id: 10, name: 'Thermometer', category: 'Equipment', stock: 4, threshold: 5 },
        { id: 11, name: 'N95 Masks', category: 'Protection', stock: 500, threshold: 200 },
        { id: 12, name: 'Hand Sanitizer', category: 'Hygiene', stock: 50, threshold: 30 },
        { id: 13, name: 'Cotton Rolls', category: 'First Aid', stock: 5, threshold: 15 },
        { id: 14, name: 'Azithromycin 500', category: 'Antibiotic', stock: 60, threshold: 20 },
        { id: 15, name: 'Pudin Hara', category: 'Digestion', stock: 30, threshold: 15 },
        { id: 16, name: 'Volini Spray', category: 'Pain Relief', stock: 18, threshold: 10 },
        { id: 17, name: 'Crepe Bandage', category: 'First Aid', stock: 15, threshold: 10 },
        { id: 18, name: 'Oximeter', category: 'Equipment', stock: 3, threshold: 5 },
        { id: 24, name: 'Inhaler', category: 'Respiratory', stock: 5, threshold: 5 },
        { id: 25, name: 'Eye Drops', category: 'Eye Care', stock: 15, threshold: 10 },
    ].map(item => ({
        ...item,
        status: item.stock <= item.threshold ? 'LOW' : 'OK'
    }));

    // 3. Appointments
    const appointments = [];
    const symptoms = [
        "Headache", "Fever", "Cough", "Common Cold", "Stomach Ache", "Injury (Knee)", "Sprain",
        "Migraine", "Eye Infection", "Skin Allergy", "Food Poisoning", "Viral Flu",
        "Back Pain", "Sore Throat", "Dizziness", "Nausea", "Fatigue", "Anxiety", "Insomnia", "Cut/Wound"
    ];

    // Increase weight of Viral symptoms for testing AI
    const viralBoost = ["Viral Flu", "Common Cold", "Fever"];

    for (let i = 1; i <= 300; i++) { // Increased to 300 to hit 20 threshold
        const user = users[Math.floor(Math.random() * users.length)];

        let symptom;
        if (Math.random() > 0.6) { // 40% chance of viral for testing
            symptom = viralBoost[Math.floor(Math.random() * viralBoost.length)];
        } else {
            symptom = symptoms[Math.floor(Math.random() * symptoms.length)];
        }

        let priority = 'Low';
        if (["Fever", "Viral Flu", "Food Poisoning", "Injury (Knee)", "Migraine"].includes(symptom)) priority = 'High';
        else if (["Stomach Ache", "Sprain", "Back Pain", "Sore Throat"].includes(symptom)) priority = 'Medium';

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const dateStr = date.toISOString().split('T')[0];

        const slots = [];
        for (let h = 10; h < 22; h++) {
            slots.push(`${h}:00`, `${h}:15`, `${h}:30`, `${h}:45`);
        }
        slots.push('22:00');

        const time = slots[Math.floor(Math.random() * slots.length)];

        appointments.push({
            id: i,
            email: user.email,
            date: dateStr,
            time,
            symptom,
            priority,
            status: Math.random() > 0.5 ? 'Completed' : 'Pending'
        });
    }

    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. SIR Data
    const sirHistory = [];
    for (let i = 0; i <= 30; i++) {
        const peak = 15;
        const value = Math.floor(100 * Math.exp(-Math.pow(i - peak, 2) / (2 * Math.pow(5, 2))));
        sirHistory.push({ time: `${i}`, I: value });
    }

    return { users, inventory, appointments, sirHistory };
};
