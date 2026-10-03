/* ===================================================================
   script.js  -  SmartHealth app logic (login screen, tabs, AI chat,
   telemedicine, prescription, history, payment)
   Needs firebase.js loaded first.
   =================================================================== */

/* ============================================================
   DATA (doctors, AI rules, medicines, prices)
   ============================================================ */

const DOCTORS = [
    {
        name: 'Dr. Sarah Smith',
        specialty: 'General Physician',
        exp: '10 Years Exp • ⭐ 4.9',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. John Doe',
        specialty: 'Cardiologist',
        exp: '15 Years Exp • ⭐ 4.8',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Emily Chen',
        specialty: 'Pediatrician',
        exp: '9 Years Exp • ⭐ 4.9',
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Michael Rao',
        specialty: 'Dermatologist',
        exp: '12 Years Exp • ⭐ 4.7',
        photo: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Priya Nair',
        specialty: 'Gynecologist',
        exp: '14 Years Exp • ⭐ 4.9',
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Alan Fischer',
        specialty: 'Orthopedic Surgeon',
        exp: '18 Years Exp • ⭐ 4.8',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Meera Iyer',
        specialty: 'Psychiatrist',
        exp: '11 Years Exp • ⭐ 4.9',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Dr. Robert Kim',
        specialty: 'ENT Specialist',
        exp: '13 Years Exp • ⭐ 4.7',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
        callBg: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80'
    }
];

const AI_RULES = [
    {
        keywords: ['chest pain', 'chest tightness', "can't breathe", 'cant breathe', 'difficulty breathing', 'shortness of breath'],
        reply: "⚠️ Chest pain or trouble breathing can be serious. Please treat this as urgent — if it's severe, sudden, or you also feel dizzy, sweaty, or nauseous, contact your nearest emergency room right away. Otherwise, please start a video call with our Cardiologist, Dr. John Doe, from the Telemedicine tab so he can assess you properly."
    },
    {
        keywords: ['fever', 'high temperature', 'chills'],
        reply: "You mentioned a fever. Keep hydrated, rest, and you can take a fever reducer like paracetamol if needed. If your temperature stays above 102°F (39°C) for more than a day, or you have a rash, stiff neck, or trouble breathing, please book a video call with Dr. Sarah Smith (General Physician) so she can examine you."
    },
    {
        keywords: ['cough', 'sore throat', 'cold', 'runny nose', 'congestion'],
        reply: "For a cough, sore throat, or cold: warm fluids, steam inhalation, and rest usually help in the first couple of days. If symptoms last more than a week, you develop a high fever, or you have trouble swallowing, please consult Dr. Sarah Smith (General Physician) or Dr. Robert Kim (ENT Specialist) via video call."
    },
    {
        keywords: ['headache', 'migraine', 'head pain'],
        reply: "For occasional headaches, rest in a dark quiet room, stay hydrated, and an over-the-counter pain reliever can help. If this is the worst headache of your life, comes on suddenly, or is paired with vision changes, confusion, or a stiff neck, please seek emergency care immediately. Otherwise, a video consult with Dr. Sarah Smith can help pin down the cause."
    },
    {
        keywords: ['stomach', 'abdominal pain', 'nausea', 'vomit', 'diarrhea', 'diarrhoea'],
        reply: "For stomach upset: sip clear fluids, eat light bland foods, and avoid dairy/spicy food for now. If you see blood, have severe pain, can't keep fluids down, or symptoms last more than 2 days, please start a video call with Dr. Sarah Smith (General Physician) right away."
    },
    {
        keywords: ['skin', 'rash', 'acne', 'itching', 'itchy', 'allergy', 'allergic'],
        reply: "Skin issues like rashes or itching are best evaluated visually. I'd recommend booking a video consultation with Dr. Michael Rao, our Dermatologist, from the Telemedicine tab — he can look at it directly over video and prescribe the right treatment."
    },
    {
        keywords: ['heart', 'palpitation', 'blood pressure', 'bp', 'cholesterol'],
        reply: "Heart-related concerns like palpitations, blood pressure, or cholesterol are best handled by our Cardiologist, Dr. John Doe. Please head to the Telemedicine tab to start a video call with him — bring any recent BP or lab readings you have."
    },
    {
        keywords: ['child', 'baby', 'infant', 'kid', 'toddler'],
        reply: "For concerns about a child's health, our Pediatrician Dr. Emily Chen is the right specialist. Please start a video consultation with her from the Telemedicine tab, and have the child's age, weight, and symptoms ready to share."
    },
    {
        keywords: ['stress', 'anxiety', 'depressed', 'depression', 'sleep', 'insomnia', 'mental health', 'panic'],
        reply: "Thank you for sharing that — mental health matters just as much as physical health. Dr. Meera Iyer, our Psychiatrist, is available for a confidential video consultation from the Telemedicine tab. If you're ever in crisis or feel unsafe, please contact your local emergency services or a crisis helpline right away."
    },
    {
        keywords: ['joint', 'knee', 'back pain', 'bone', 'fracture', 'sprain', 'muscle pain'],
        reply: "For joint, bone, or muscle pain, rest the area and apply ice if it's a recent injury. For ongoing pain, swelling, or if you suspect a fracture, please book a video call with Dr. Alan Fischer, our Orthopedic Surgeon."
    },
    {
        keywords: ['prescription', 'medicine', 'medication', 'refill'],
        reply: "I can't issue or modify prescriptions myself — only a doctor can do that after a consultation. Head to the Telemedicine tab, complete a video call with one of our doctors, and your official e-prescription will automatically appear in the 'My Prescriptions' tab afterward."
    },
    {
        keywords: ['thanks', 'thank you', 'thankyou'],
        reply: "You're welcome! 😊 Take care of yourself, and don't hesitate to reach out if anything else comes up."
    },
    {
        keywords: ['hi', 'hello', 'hey'],
        reply: "Hello! 👋 Tell me a bit about how you're feeling — for example, any pain, fever, cough, or other symptoms — and I'll point you toward the right next step."
    }
];

const MEDS_BY_SPECIALTY = {
    'Cardiologist': [
        { name: 'Aspirin 75mg', dose: '1 Tablet', freq: 'Once daily (Morning)', duration: '30 Days' },
        { name: 'Atorvastatin 20mg', dose: '1 Tablet', freq: 'Once daily (Night)', duration: '30 Days' }
    ],
    'Dermatologist': [
        { name: 'Cetirizine 10mg', dose: '1 Tablet', freq: 'Once daily (Night)', duration: '7 Days' },
        { name: 'Hydrocortisone Cream 1%', dose: 'Thin layer', freq: 'Twice daily on affected area', duration: '7 Days' }
    ],
    'Orthopedic Surgeon': [
        { name: 'Ibuprofen 400mg', dose: '1 Tablet', freq: 'Every 8 hours after food', duration: '5 Days' },
        { name: 'Calcium + Vitamin D3', dose: '1 Tablet', freq: 'Once daily', duration: '30 Days' }
    ],
    'Psychiatrist': [
        { name: 'Melatonin 3mg', dose: '1 Tablet', freq: 'Once daily (Bedtime)', duration: '14 Days' }
    ],
    'Pediatrician': [
        { name: 'Paracetamol Syrup (Pediatric)', dose: '5 ml', freq: 'Every 6-8 hours if fever', duration: '3 Days' },
        { name: 'Oral Rehydration Salts', dose: '1 Sachet', freq: 'As needed', duration: '3 Days' }
    ],
    'Gynecologist': [
        { name: 'Folic Acid 5mg', dose: '1 Tablet', freq: 'Once daily', duration: '30 Days' },
        { name: 'Mefenamic Acid 250mg', dose: '1 Tablet', freq: 'Every 8 hours if pain', duration: '3 Days' }
    ],
    'ENT Specialist': [
        { name: 'Azithromycin 250mg', dose: '1 Tablet', freq: 'Once daily', duration: '5 Days' },
        { name: 'Saline Nasal Spray', dose: '2 Sprays', freq: 'Twice daily', duration: '7 Days' }
    ]
};

// Default for General Physician (and any unlisted specialty)
const DEFAULT_MEDS = [
    { name: 'Paracetamol 500mg', dose: '1 Tablet', freq: 'Every 8 hours after food', duration: '3 Days' },
    { name: 'Azithromycin 250mg', dose: '1 Tablet', freq: 'Once daily', duration: '5 Days' },
    { name: 'Cough Syrup (Herbal)', dose: '10 ml', freq: 'Twice daily', duration: '5 Days' }
];

const PRESCRIPTION_PRICES = {
    'Cardiologist': 685,
    'Dermatologist': 420,
    'Orthopedic Surgeon': 560,
    'Psychiatrist': 250,
    'Pediatrician': 300,
    'Gynecologist': 390,
    'ENT Specialist': 360
};
const DEFAULT_PRICE = 340;

/* ============================================================
   AUTH
   ============================================================ */

let loginAttempts = 0;
let authMode = 'login'; // 'login' or 'signup'
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
let lockoutTimer = null;

function showLoginError(msg) {
    const errBox = document.getElementById('login-error-msg');
    errBox.textContent = msg;
    errBox.classList.add('show');
}
function clearLoginError() {
    const errBox = document.getElementById('login-error-msg');
    errBox.textContent = '';
    errBox.classList.remove('show');
}
function setFieldError(fieldId, hasError) {
    document.getElementById(fieldId).classList.toggle('input-error', hasError);
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    clearLoginError();
    setFieldError('email-field', false);
    setFieldError('password-field', false);
    document.getElementById('confirm-password-field').style.display = authMode === 'signup' ? 'block' : 'none';
    document.getElementById('confirm-password-field').value = '';
    document.getElementById('auth-subtitle').textContent = authMode === 'signup' ? 'Create your account' : 'Sign in to your account';
    document.getElementById('login-btn').textContent = authMode === 'signup' ? 'Create Account' : 'Login Securely';
    document.getElementById('toggle-text').textContent = authMode === 'signup' ? 'Already have an account?' : "Don't have an account?";
    document.getElementById('toggle-link').textContent = authMode === 'signup' ? 'Log in' : 'Sign up';
}

function firebaseErrorMessage(err) {
    const code = (err && err.code) || '';
    const messages = {
        'auth/email-already-in-use': '❌ An account with this email already exists. Please log in instead.',
        'auth/invalid-email': '⚠️ Please enter a valid email address.',
        'auth/weak-password': '⚠️ Password must be at least 6 characters.',
        'auth/user-not-found': '❌ No account found for this email. Please sign up first.',
        'auth/wrong-password': '❌ Invalid email or password.',
        'auth/invalid-credential': '❌ Invalid email or password.',
        'auth/too-many-requests': '🔒 Too many attempts. Please wait and try again.',
        'auth/network-request-failed': '⚠️ Network error. Check your internet connection and try again.',
        'auth/operation-not-supported-in-this-environment': '⚠️ Open this app through a web server (http://localhost or hosting), not by double-clicking the file.',
        'auth/unauthorized-domain': '⚠️ This domain is not authorized in Firebase Console → Authentication → Settings → Authorized domains.',
        'auth/operation-not-allowed': '⚠️ Email/Password sign-in is not enabled in Firebase Console → Authentication → Sign-in method.'
    };
    return messages[code] || ('⚠️ ' + ((err && err.message) || 'Something went wrong. Please try again.'));
}

async function handleAuth() {
    clearLoginError();
    const passwordField = document.getElementById('password-field');
    const confirmField = document.getElementById('confirm-password-field');
    const email = document.getElementById('email-field').value.trim().toLowerCase();
    const pass = passwordField.value;
    const loginBtn = document.getElementById('login-btn');

    if (loginBtn.disabled) return;
    setFieldError('email-field', false);
    setFieldError('password-field', false);

    if (email === '' || pass === '') {
        setFieldError('email-field', email === '');
        setFieldError('password-field', pass === '');
        showLoginError('⚠️ Email and password are required.');
        return;
    }
    if (!isValidEmail(email)) {
        setFieldError('email-field', true);
        showLoginError('⚠️ Please enter a valid email address.');
        return;
    }
    if (authMode === 'signup' && pass.length < 6) {
        setFieldError('password-field', true);
        showLoginError('⚠️ Password must be at least 6 characters.');
        return;
    }
    if (authMode === 'signup' && pass !== confirmField.value) {
        setFieldError('password-field', true);
        showLoginError('⚠️ Passwords do not match.');
        return;
    }

    const originalBtnText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = authMode === 'signup' ? 'Creating account...' : 'Logging in...';
    let keepDisabled = false;

    try {
        let result;
        if (authMode === 'signup') {
            result = await window.firebaseCreateAccount(email, pass);
            try {
                await window.firebaseSaveProfile(result.user.uid, {
                    email: email,
                    createdAt: new Date().toISOString()
                });
            } catch (profileErr) {
                console.warn('Could not save profile:', profileErr);
            }
        } else {
            result = await window.firebaseLogin(email, pass);
        }
        loginAttempts = 0;
        completeLogin(result.user);
    } catch (err) {
        console.error('Firebase authentication error:', err);
        if (err && (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password')) {
            loginAttempts++;
            setFieldError('email-field', true);
            setFieldError('password-field', true);
            passwordField.value = '';
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                keepDisabled = true;
                startLoginLockout();
            } else {
                const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts;
                showLoginError(`❌ Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`);
            }
        } else {
            showLoginError(firebaseErrorMessage(err));
        }
    } finally {
        if (!keepDisabled) {
            loginBtn.disabled = false;
            loginBtn.textContent = originalBtnText;
        }
    }
}

function startLoginLockout() {
    const loginBtn = document.getElementById('login-btn');
    let secondsLeft = LOCKOUT_SECONDS;
    loginBtn.disabled = true;
    document.getElementById('email-field').disabled = true;
    document.getElementById('password-field').disabled = true;
    showLoginError(`🔒 Too many failed attempts. Try again in ${secondsLeft}s.`);

    clearInterval(lockoutTimer);
    lockoutTimer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            showLoginError(`🔒 Too many failed attempts. Try again in ${secondsLeft}s.`);
        } else {
            clearInterval(lockoutTimer);
            loginAttempts = 0;
            loginBtn.disabled = false;
            loginBtn.textContent = authMode === 'signup' ? 'Create Account' : 'Login Securely';
            document.getElementById('email-field').disabled = false;
            document.getElementById('password-field').disabled = false;
            setFieldError('email-field', false);
            setFieldError('password-field', false);
            clearLoginError();
        }
    }, 1000);
}

/* ============================================================
   AI CHAT
   ============================================================ */

function getAIResponse(message) {
    const text = message.toLowerCase();
    for (const rule of AI_RULES) {
        if (rule.keywords.some(k => text.includes(k))) {
            return rule.reply;
        }
    }
    const shortMsg = message.length > 60 ? message.slice(0, 60) + '…' : message;
    return `Thanks for sharing that. Based on "${shortMsg}", I'd recommend describing when it started, how severe it is (mild/moderate/severe), and any other symptoms — that helps our doctors triage you faster. If it's ongoing or concerning, please start a video call from the Telemedicine tab so a real doctor can examine you.`;
}

function postChatExchange(inputId, boxId) {
    const inputField = document.getElementById(inputId);
    const message = inputField.value.trim();
    if (message === '') return;
    const chatBox = document.getElementById(boxId);
    chatBox.innerHTML += `<div class="message msg-user">${escapeHtml(message)}</div>`;
    inputField.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
        chatBox.innerHTML += `<div class="message msg-ai">${escapeHtml(getAIResponse(message))}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 700);
}

// Floating corner widget
function toggleChat() { document.getElementById('chat-widget').classList.toggle('active'); }
function sendMessage() { postChatExchange('chat-input', 'chat-box'); }

// Full-page AI tab
function sendTabMessage() { postChatExchange('ai-tab-chat-input', 'ai-tab-chat-box'); }

/* ===================================================================
   APP - tabs, telemedicine, prescription, history
   =================================================================== */
let currentPatientName = null;
let activeDoctorName = "";
let activeDoctorSpecialty = "";
let currentRx = null;
let selectedPaymentMethod = null;
let currentPayableAmount = 0;

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---------- Login / logout screen switching ----------
function completeLogin(user) {
    window.firebaseCurrentUser = user;
    currentPatientName = user.email || user.uid;
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-dashboard').style.display = 'flex';
    renderDoctorGrid();
    renderPrescription();
    switchTab('home-tab');
}

async function logout() {
    try { await window.firebaseLogout(); } catch (err) { console.error('Logout error:', err); }
    currentPatientName = null;
    currentRx = null;
    window.firebaseCurrentUser = null;
    loginAttempts = 0;
    if (authMode === 'signup') toggleAuthMode();
    document.getElementById('app-dashboard').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('email-field').value = '';
    document.getElementById('password-field').value = '';
    clearLoginError();
}

// ---------- Tabs ----------
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const navBtn = document.getElementById('nav-' + tabId);
    if (navBtn) navBtn.classList.add('active');
    if (tabId === 'video-tab') {
        document.getElementById('doctor-list-section').style.display = 'block';
        document.getElementById('active-call-section').style.display = 'none';
    }
    if (tabId === 'history-tab') renderHistory();
    window.scrollTo(0, 0);
}

// ---------- Telemedicine ----------
function renderDoctorGrid() {
    const grid = document.getElementById('doctor-grid');
    if (!grid) return;
    grid.innerHTML = DOCTORS.map((doc, i) => `
        <div class="doctor-card">
            <img src="${doc.photo}" alt="${doc.name}">
            <h4>${doc.name}</h4>
            <div class="specialty">${doc.specialty}</div>
            <div class="exp">${doc.exp}</div>
            <button class="btn" onclick="startCall(${i})">Video Call Now</button>
        </div>`).join('');
}

function startCall(index) {
    const doc = DOCTORS[index];
    activeDoctorName = doc.name;
    activeDoctorSpecialty = doc.specialty;
    document.getElementById('doctor-list-section').style.display = 'none';
    document.getElementById('active-call-section').style.display = 'block';
    const video = document.getElementById('main-video');
    video.innerHTML = `<h2>Connecting to ${doc.name}...</h2><div class="self-video"></div>`;
    setTimeout(() => {
        if (document.getElementById('active-call-section').style.display === 'block') {
            video.innerHTML = `
                <img src="${doc.callBg}" alt="Doctor" style="width:100%; height:100%; object-fit:cover;">
                <div class="self-video"></div>
                <div style="position:absolute; top:20px; left:20px; background:rgba(0,0,0,0.6); padding:5px 15px; border-radius:20px; color:white;">🔴 Live - ${doc.name}</div>`;
        }
    }, 1500);
}
function toggleMic() { alert("Microphone toggled"); }
function toggleCam() { alert("Camera toggled"); }

async function endCall() {
    document.getElementById('main-video').innerHTML = '';
    alert(`Call Ended. ${activeDoctorName} is automatically generating your medical prescription sheet...`);
    const meds = MEDS_BY_SPECIALTY[activeDoctorSpecialty] || DEFAULT_MEDS;
    currentRx = { date: new Date().toISOString(), doctor: activeDoctorName, specialty: activeDoctorSpecialty, meds: meds };
    renderPrescription();
    switchTab('med-tab');

    const user = window.firebaseCurrentUser;
    if (user) {
        try {
            await window.firebaseAddHistory(user.uid, {
                date: currentRx.date,
                doctor: activeDoctorName,
                specialty: activeDoctorSpecialty,
                meds: meds.map(m => m.name)
            });
        } catch (e) { console.error('Firebase history save error:', e); }
    }
}

// ---------- Prescription sheet ----------
function renderPrescription() {
    const container = document.getElementById('prescription-container');
    if (!currentRx) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 50px; margin-bottom: 15px;">📋</div>
                <h3>No Active Prescriptions</h3>
                <p>Go to the Telemedicine tab and consult a doctor. Once the call ends, your online prescription sheet will automatically generate here.</p>
            </div>`;
        return;
    }
    const dateStr = new Date(currentRx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const medsHTML = currentRx.meds.map(m =>
        `<tr><td>${m.name}</td><td>${m.dose}</td><td>${m.freq}</td><td>${m.duration}</td></tr>`).join('');
    container.innerHTML = `
        <div class="prescription-sheet">
            <div class="sheet-header">
                <div class="hospital-details">
                    <h2>SmartHealth e-Clinic</h2>
                    <p>123 Digital Health Way, Web City, 400101</p>
                    <p>Phone: +1 800 SMART MED</p>
                </div>
                <div class="patient-details">
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Patient ID:</strong> ${escapeHtml((currentPatientName || '').toUpperCase())}</p>
                    <p><strong>Prescribed By:</strong> ${currentRx.doctor}</p>
                    <p><strong>Specialty:</strong> ${currentRx.specialty}</p>
                </div>
            </div>
            <div class="rx-symbol">℞</div>
            <div class="med-table-wrap">
                <table class="med-table">
                    <thead><tr><th>Medicine Name</th><th>Dosage</th><th>Frequency &amp; Timing</th><th>Duration</th></tr></thead>
                    <tbody>${medsHTML}</tbody>
                </table>
            </div>
            <div class="sheet-footer">
                <div style="font-family:'Segoe UI',sans-serif; font-size:13px; color:#555;">
                    <p><strong>Note:</strong> This prescription is system-generated and locked.</p>
                    <p>Modifications by the patient are strictly disabled.</p>
                </div>
                <div class="doctor-signature">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Signature_of_John_Hancock.svg" alt="Signature">
                    <p style="border-top:1px solid #333; padding-top:5px; font-family:'Segoe UI',sans-serif; font-size:14px;"><strong>${currentRx.doctor}</strong></p>
                </div>
            </div>
            <button class="btn" style="width:100%; margin-top:30px; font-size:18px; background-color:var(--accent-color);" onclick="openPaymentModal()">🛒 Order Complete Prescription Online</button>
        </div>`;
}

// ---------- History (Firebase Realtime Database) ----------
async function renderHistory() {
    const container = document.getElementById('history-container');
    const user = window.firebaseCurrentUser;
    if (!container || !user) return;
    container.innerHTML = '<p style="color: var(--text-light);">Loading your history...</p>';
    let entries = [];
    try {
        const data = await window.firebaseGetHistory(user.uid);
        entries = Object.entries(data).map(([id, e]) => ({ id, ...e })).sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) { console.error('Firebase history read error:', e); }

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 50px; margin-bottom: 15px;">🗂️</div>
                <h3>No Past Consultations Yet</h3>
                <p>Once you complete a video consultation, it will be saved here so you can look back on it anytime.</p>
            </div>`;
        return;
    }
    container.innerHTML = '<div class="history-list">' + entries.map(e => {
        const d = new Date(e.date);
        const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="history-card">
                <div class="hc-left">
                    <div class="hc-icon">🩺</div>
                    <div>
                        <h4>${escapeHtml(e.doctor || 'Doctor')}</h4>
                        <div class="hc-meta">${escapeHtml(e.specialty || '')}</div>
                        <div class="hc-meds">Medicines: ${escapeHtml((e.meds || []).join(', '))}</div>
                    </div>
                </div>
                <div>
                    <div class="hc-badge">Completed</div>
                    <div class="hc-date">${dateStr}<br>${timeStr}</div>
                </div>
            </div>`;
    }).join('') + '</div>';
}


/* ============================================================
   PAYMENT (demo only)
   ============================================================ */
// ---------------- Payment (demo only) ----------------
function computePrescriptionAmount() {
    return PRESCRIPTION_PRICES[currentRx ? currentRx.specialty : ''] || DEFAULT_PRICE;
}

function openPaymentModal() {
    currentPayableAmount = computePrescriptionAmount();
    document.getElementById('payment-amount-display').textContent = '₹' + currentPayableAmount;
    selectedPaymentMethod = null;
    document.querySelectorAll('.payment-method-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('input[name="payMethod"]').forEach(el => el.checked = false);
    document.querySelectorAll('.payment-extra-field').forEach(el => el.classList.remove('show'));
    document.getElementById('upi-id-input').value = '';
    document.getElementById('card-number-input').value = '';
    document.getElementById('card-expiry-input').value = '';
    document.getElementById('card-cvv-input').value = '';
    document.getElementById('bank-select-input').value = '';

    document.getElementById('payment-select-view').style.display = 'block';
    document.getElementById('payment-processing-view').style.display = 'none';
    document.getElementById('payment-success-view').style.display = 'none';
    document.getElementById('payment-modal-overlay').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('payment-modal-overlay').classList.remove('active');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-method-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.method === method);
    });
    const upiField = document.getElementById('field-upi-id');
    const cardField = document.getElementById('field-card');
    const bankField = document.getElementById('field-netbanking');
    upiField.classList.remove('show');
    cardField.classList.remove('show');
    bankField.classList.remove('show');

    if (['upi', 'gpay', 'phonepe', 'paytm'].includes(method)) upiField.classList.add('show');
    else if (method === 'card') cardField.classList.add('show');
    else if (method === 'netbanking') bankField.classList.add('show');
}

function processPayment() {
    if (!selectedPaymentMethod) {
        alert('⚠️ Please select a payment method to continue.');
        return;
    }
    if (['upi', 'gpay', 'phonepe', 'paytm'].includes(selectedPaymentMethod)) {
        const upiId = document.getElementById('upi-id-input').value.trim();
        if (!upiId.includes('@') || upiId.length < 5) {
            alert('⚠️ Please enter a valid UPI ID (e.g. yourname@upi).');
            return;
        }
    } else if (selectedPaymentMethod === 'card') {
        const cardNum = document.getElementById('card-number-input').value.replace(/\s/g, '');
        const expiry = document.getElementById('card-expiry-input').value.trim();
        const cvv = document.getElementById('card-cvv-input').value.trim();
        if (cardNum.length < 12 || !expiry.includes('/') || cvv.length < 3) {
            alert('⚠️ Please enter valid card details.');
            return;
        }
    } else if (selectedPaymentMethod === 'netbanking') {
        if (!document.getElementById('bank-select-input').value) {
            alert('⚠️ Please select your bank.');
            return;
        }
    }

    document.getElementById('payment-select-view').style.display = 'none';
    document.getElementById('payment-processing-view').style.display = 'block';

    setTimeout(() => {
        const methodLabels = {
            upi: 'UPI', gpay: 'Google Pay', phonepe: 'PhonePe',
            paytm: 'Paytm', card: 'Credit/Debit Card', netbanking: 'Net Banking'
        };
        const txnId = 'TXN' + Date.now().toString().slice(-10);
        document.getElementById('payment-success-method').textContent =
            `Paid ₹${currentPayableAmount} via ${methodLabels[selectedPaymentMethod]}`;
        document.getElementById('payment-txn-id').textContent = 'Transaction ID: ' + txnId;
        document.getElementById('payment-processing-view').style.display = 'none';
        document.getElementById('payment-success-view').style.display = 'block';
    }, 1800);
}

// ---------------------------------------------------------------------
// Make every function reachable from onclick="..." in the HTML.
// (Needed when the file is loaded as type="module"; harmless otherwise.)
// ---------------------------------------------------------------------
Object.assign(window, {
    clearLoginError,
    closePaymentModal,
    completeLogin,
    computePrescriptionAmount,
    endCall,
    escapeHtml,
    fbReady,
    firebaseErrorMessage,
    getAIResponse,
    handleAuth,
    isValidEmail,
    logout,
    openPaymentModal,
    postChatExchange,
    processPayment,
    renderDoctorGrid,
    renderHistory,
    renderPrescription,
    selectPaymentMethod,
    sendMessage,
    sendTabMessage,
    setFieldError,
    showLoginError,
    startCall,
    startLoginLockout,
    switchTab,
    toggleAuthMode,
    toggleCam,
    toggleChat,
    toggleMic
});

// ---------- Start: if Firebase already has a logged-in user, skip login ----------
window.firebaseWaitForUser().then(user => { if (user) completeLogin(user); }).catch(e => console.warn(e.message));
