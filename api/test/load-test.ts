
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// This data generation logic mimics the database seed script:
// api/prisma/seeders/userSeeder.ts
// api/prisma/seeders/subjectSeeder.ts
const students = new SharedArray('students', function () {
    const SUBJECT_CODES = [
        "THCB", "THNC", "TH03L", "TH04L", "TH05L", "TH06L", "TH07L", "TH08",
        "TH09L", "TH10L", "TH11L", "TH12L", "SCRA", "PYTH", "MOSW", "MOSE", "MOSP"
    ];

    const users = [];
    const totalStudents = 150;
    const subjectCounters = new Map();
    SUBJECT_CODES.forEach(code => subjectCounters.set(code, 0));

    for (let i = 1; i <= totalStudents; i++) {
        const subjectCode = SUBJECT_CODES[(i - 1) % SUBJECT_CODES.length];
        const currentCount = (subjectCounters.get(subjectCode) || 0) + 1;
        subjectCounters.set(subjectCode, currentCount);

        const userCodeNumber = String(currentCount).padStart(3, '0');
        const userCode = `HV${subjectCode}${userCodeNumber}`;

        users.push({
            identifier: userCode,
            password: 'Thu#$3',
        });
    }
    return users;
});

export const options = {
    vus: 50, // 50 virtual users
    duration: '30s', // for 30 seconds
    // scenarios: {
    //     ramping: {
    //         executor: 'ramping-vus',
    //         startVUs: 0,
    //         stages: [
    //             { duration: '10s', target: 50 },
    //             { duration: '10s', target: 50 },
    //             { duration: '10s', target: 0 },
    //         ],
    //         gracefulRampDown: '5s',
    //     },
    // },
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
    },
};

const BASE_URL = 'https://miniweb.cloud/api';

export default function () {
    // 1. Pick a random student
    const student = students[Math.floor(Math.random() * students.length)];
    const identifier = student.identifier;
    const password = student.password;

    // 2. Login
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        identifier: identifier,
        password: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    check(loginRes, {
        'login successful': (r) => r.status === 200,
        'has access token': (r) => r.json('accessToken') !== '',
    });

    if (loginRes.status !== 200) {
        console.error(`Login failed for ${identifier}: ${loginRes.body}`);
        return;
    }

    const accessToken = loginRes.json('accessToken');
    const authHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    // 3. Get Dashboard to find a room
    const dashboardRes = http.get(`${BASE_URL}/student/dashboard`, { headers: authHeaders });

    check(dashboardRes, {
        'dashboard fetch successful': (r) => r.status === 200,
        'has open rooms': (r) => {
            try {
                const body = JSON.parse(r.body);
                return Array.isArray(body.openRooms) && body.openRooms.length > 0;
            } catch (e) {
                return false;
            }
        },
    });

    if (dashboardRes.status !== 200) {
        console.error(`Failed to fetch dashboard for ${identifier}: ${dashboardRes.body}`);
        return;
    }

    const openRooms = dashboardRes.json('openRooms');
    if (!openRooms || openRooms.length === 0) {
        console.log(`No open rooms found for student ${identifier}`);
        return; // No rooms to test, so this VU is done.
    }

    // 4. Pick a random room and begin the attempt
    const room = openRooms[Math.floor(Math.random() * openRooms.length)];
    const roomId = room.id;
    const roomPassword = room.isProtected ? 'YOUR_ROOM_PASSWORD' : undefined; // <-- IMPORTANT: SET ROOM PASSWORD IF NEEDED

    const beginAttemptPayload = {
        roomId: roomId,
        activate: true,
        ...(roomPassword && { password: roomPassword }),
    };

    const beginAttemptRes = http.post(`${BASE_URL}/attempts/begin`, JSON.stringify(beginAttemptPayload), { headers: authHeaders });

    check(beginAttemptRes, {
        'begin attempt successful': (r) => r.status === 200 || r.status === 201, // API might return 200 or 201
        'has attempt data': (r) => r.json('id') !== '',
    });

    if (beginAttemptRes.status !== 200 && beginAttemptRes.status !== 201) {
        console.error(`Failed to begin attempt for ${identifier} in room ${roomId}: ${beginAttemptRes.body}`);
        return;
    }

    const attempt = beginAttemptRes.json();
    const questions = attempt.questions;

    if (!questions || questions.length === 0) {
        console.log(`Room ${roomId} has no questions. Submitting immediately.`);
    }

    // 5. Prepare answers (randomly select one choice per question)
    const answers = questions.map((q) => {
        const selectedChoice = q.choices && q.choices.length > 0
            ? q.choices[Math.floor(Math.random() * q.choices.length)]
            : null;

        return {
            questionId: q.id,
            selectedChoiceId: selectedChoice ? selectedChoice.id : null,
        };
    });

    // 6. Submit the attempt after a short "thinking" time
    sleep(Math.random() * 5 + 5); // Simulate user taking 5-10 seconds to answer

    const submitPayload = {
        roomId: roomId,
        answers: answers,
    };

    const submitRes = http.post(`${BASE_URL}/attempts`, JSON.stringify(submitPayload), { headers: authHeaders });

    check(submitRes, {
        'submission successful': (r) => r.status === 200 || r.status === 201,
        'submission has result': (r) => r.json('id') !== '',
    });

    if (submitRes.status !== 200 && submitRes.status !== 201) {
        console.error(`Failed to submit attempt for ${identifier} in room ${roomId}: ${submitRes.body}`);
    } else {
        console.log(`Student ${identifier} successfully submitted attempt for room ${roomId}`);
    }

    sleep(1); // Small sleep at the end of the iteration
}
