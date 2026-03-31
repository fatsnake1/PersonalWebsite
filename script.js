// --- STATE & CONFIG ---
let soundEnabled = false;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// --- SOUND ENGINE ---
function playKeystroke() {
    if (!soundEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
}

function playEnter() {
    if (!soundEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Toggle sound
document.getElementById('sound-toggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.innerText = soundEnabled ? '[SOUND: ON]' : '[SOUND: OFF]';
    if(soundEnabled && audioCtx.state === 'suspended') audioCtx.resume();
});

// Play sound on typing in CLI/Form
document.addEventListener('keydown', (e) => {
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if(e.key !== 'Enter') playKeystroke();
    }
});

// --- BOOT SEQUENCE ---
const bootLines =[
    "BIOS Date 03/24/26 12:08:00 Ver 08.00.15",
    "CPU: Pentium Shitbox Unit 0.01 GHz",
    "Downloading Ram... Successful",
    "Coding kernel in html... Success",
    "Volkswagen passat rev.. 400kbps",
    "Starting user session...",
];

const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');
const mainContent = document.getElementById('main-content');

async function runBootSequence() {
    for (let line of bootLines) {
        let div = document.createElement('div');
        div.innerText = line;
        bootText.appendChild(div);
        if(soundEnabled) playKeystroke();
        await new Promise(r => setTimeout(r, 50 + Math.random() * 200));
    }
    
    bootScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    startHeroTyping();
}

// --- TYPING EFFECT (HERO) ---
const heroData = {
    name: "MIKHEIL JURULI",
    role: "// Bio:",
    bio: "> Studying history of art. Semiological reasearcher. 3D modelling & design enthusiast. My goal is to research the visual vocabularies of ancient cultures and implement it into modern design.",
    Email: "> mishojuruli@gmail.com"
};

async function typeText(elementId, text, speed = 0.1) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    for (let char of text) {
        el.innerHTML += char;
        if(soundEnabled) playKeystroke();
        await new Promise(r => setTimeout(r, speed + Math.random() * 0.1));
    }
}

async function startHeroTyping() {
    await typeText('hero-name', heroData.name, 60);
    await new Promise(r => setTimeout(r, 200));
    await typeText('hero-role', heroData.role, 40);
    await new Promise(r => setTimeout(r, 200));
    await typeText('hero-bio', heroData.bio, 20);
    await new Promise(r => setTimeout(r, 200));
    await typeText('hero-Email', heroData.Email, 20);
}

// Start Boot
window.onload = () => {
    // Small delay before boot starts
    setTimeout(runBootSequence, 500);
};

// --- INTERACTIVE NAVIGATION (SCROLL SPY) ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(sec => observer.observe(sec));

// --- PORTFOLIO MODAL LOGIC ---
const modal = document.getElementById('tui-modal');
const modalCloseBtn = document.getElementById('modal-close');
const portfolioItems = document.querySelectorAll('.portfolio-item');

const projectDatabase = {
    "1": { title: "project_1.exe", name: "Electric Fanduri", desc: "First ever magnetic pick-up electric rendition of the traditional Georgian Instrument Fanduri" },
    "2": { title: "project_2.exe", name: "Plastic 22.", desc: "Schematics, models and build plans for an additively manufactured lever action rifle chambered in 22. LR" },
    "3": { title: "project_3.exe", name: "'Tsromi' church digital reconstruction", desc: "A digitally rebuilt rendition of a historic Georgian church. Model was built according to the original era-specific schematics." }
};

portfolioItems.forEach(item => {
    item.addEventListener('click', (e) => {
        playEnter();
        const id = e.target.getAttribute('data-id');
        const data = projectDatabase[id];
        
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-proj-name').innerText = "> " + data.name;
        document.getElementById('modal-proj-desc').innerText = data.desc;
        
        modal.classList.remove('hidden');
    });
});

function closeModal() {
    modal.classList.add('hidden');
    playEnter();
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// --- CONTACT FORM LOGIC ---
const contactForm = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    playEnter();
    
    const inputs = contactForm.querySelectorAll('input, textarea, button');
    inputs.forEach(i => i.disabled = true);
    
    formResponse.classList.remove('hidden');
    formResponse.innerHTML = '> establishing secure connection...<br>';
    
    await new Promise(r => setTimeout(r, 800));
    formResponse.innerHTML += '> transmitting payload...<br>';
    
    await new Promise(r => setTimeout(r, 1000));
    formResponse.innerHTML += '<span class="amber">> MESSAGE DELIVERED SUCCESSFULLY.</span>';
    
    contactForm.reset();
    setTimeout(() => {
        inputs.forEach(i => i.disabled = false);
        formResponse.classList.add('hidden');
        formResponse.innerHTML = '';
    }, 4000);
});

// --- CLI INPUT LOGIC ---
const cliInput = document.getElementById('cli-input');

cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        playEnter();
        const cmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        executeCommand(cmd);
    }
});

function executeCommand(cmd) {
    const validSections =['home', 'experience', 'portfolio', 'skills', 'projects', 'contact'];
    
    if (cmd === 'help') {
        alert("AVAILABLE COMMANDS:\n- go [section]\n- cd [section]\n- clear\n\nSECTIONS:\n" + validSections.join(", "));
    } 
    else if (cmd === 'clear') {
        // Just aesthetic visual clear
        window.scrollTo(0,0);
    }
    else {
        let target = cmd.replace('go ', '').replace('cd ', '');
        if (validSections.includes(target)) {
            document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
        } else if (cmd !== '') {
            alert(`bash: ${cmd}: command not found. Type 'help'.`);
        }
    }
}