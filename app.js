/* ======= DATA: edit topics/chapters here =======
   Keep the structure: subjects -> chapters -> topics (array of strings)
*/
const DATA = [
  {
    id: 'physics',
    title: 'Physics',
    chapters: [
      { title: 'Electric Charges & Fields', topics: [
          'Electric charge & Coulomb’s law',
          'Electric field & field lines',
          'Gauss’s law — applications'
      ]},
      { title: 'Electrostatic Potential & Capacitance', topics: [
          'Electric potential',
          'Capacitance and dielectrics',
          'Energy stored in capacitors'
      ]},
      { title: 'Current Electricity', topics: [
          'Ohm’s law, resistivity',
          'Kirchhoff’s rules & circuits',
          'Wheatstone bridge'
      ]},
      { title: 'Magnetism & Moving Charges', topics: [
          'Biot–Savart & Ampere’s law',
          'Force on moving charge',
          'Magnetic dipole & torque'
      ]},
      { title: 'Optics (Ray & Wave)', topics: [
          'Reflection/refraction, lenses',
          'Young’s double slit — interference',
          'Diffraction & polarization'
      ]},
      { title: 'Modern Physics', topics: [
          'Photoelectric effect',
          'Bohr model of atom',
          'Nuclear reactions, radioactivity'
      ]}
      // add more physics chapters / topics as needed
    ]
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    chapters: [
      { title: 'Solutions', topics: ['Concentration terms', 'Raoult’s law', 'Colligative properties']},
      { title: 'Electrochemistry', topics: ['Galvanic cells', 'Nernst equation', 'Conductance']},
      { title: 'Chemical Kinetics', topics: ['Rate laws', 'Order and molecularity', 'Arrhenius eqn']},
      { title: 'd- and f-Block Elements', topics: ['Electronic config', 'Oxidation states', 'Important compounds']},
       { title: 'p-Block Elements', topics: ['Electronic config', 'Oxidation states', 'Important compounds']},
      { title: 'Organic Chemistry', topics: [
          'Haloalkanes & Haloarenes',
          'Alcohols, Phenols & Ethers',
          'Aldehydes, Ketones, Acids',
          'Amines & Diazonium chemistry'
      ]},
      { title: 'Biomolecules', topics: ['Carbohydrates', 'Proteins & enzymes', 'Vitamins & nucleic acids'] }
      // add more chemistry chapters as needed
    ]
  },
  {
    id: 'math',
    title: 'Mathematics',
    chapters: [
      { title: 'Relations & Functions', topics: ['Types of relations', 'Injective/Surjective', 'Inverse functions']},
      { title: 'Calculus', topics: ['Continuity & differentiability', 'Applications of derivatives', 'Integrals & applications']},
      { title: 'Matrices & Determinants', topics: ['Matrix operations', 'Inverse & applications', 'Determinants']},
      { title: 'Vectors & 3D Geometry', topics: ['Vector algebra', 'Lines and planes in 3D', 'Skew lines & distance']},
      { title: 'Probability & Linear Programming', topics: ['Conditional probability', 'Bayes theorem', 'LP graphical method']},
      { title: 'Differential Equations', topics: ['First order linear', 'Separable equations', 'Applications']}
    ]
  }
];

/* ======= END OF DATA ======= */

const subjectsContainer = document.getElementById('subjects');
const subjectFilter = document.getElementById('subject-filter');
const searchInput = document.getElementById('search');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');

function createId(subjectId, chapIndex, topicIndex){
  return `${subjectId}_c${chapIndex}_t${topicIndex}`;
}

/* Build UI from DATA */
function buildUI(){
  subjectsContainer.innerHTML = '';
  DATA.forEach(subject => {
    const card = document.createElement('section');
    card.className = 'subject-card';
    card.id = `card-${subject.id}`;

    const h2 = document.createElement('h2');
    h2.textContent = subject.title;
    card.appendChild(h2);

    const chapterList = document.createElement('div');
    chapterList.className = 'chapter-list';

    subject.chapters.forEach((chap, ci) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.innerHTML = `${chap.title} <span class="small-muted"></span>`;
      details.appendChild(summary);

      const ul = document.createElement('ul');
      chap.topics.forEach((topic, ti) => {
        const id = createId(subject.id, ci, ti);
        const li = document.createElement('li');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;

        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = topic;

        li.appendChild(cb);
        li.appendChild(lbl);
        ul.appendChild(li);
      });

      details.appendChild(ul);
      chapterList.appendChild(details);
    });

    card.appendChild(chapterList);
    subjectsContainer.appendChild(card);
  });

  wireUpControls();
  restoreState();
  updateProgress(); 
}

/* Add listeners */
function wireUpControls(){
  // toggling checkbox saves state to localStorage
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      localStorage.setItem(cb.id, cb.checked ? 'true' : 'false');
      updateProgress();
    });
  });

  // subject filter
  subjectFilter.addEventListener('change', () => {
    const val = subjectFilter.value;
    DATA.forEach(s => {
      const el = document.getElementById(`card-${s.id}`);
      el.style.display = (val === 'all' || val === s.id) ? '' : 'none';
    });
  });

  // search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    filterBySearch(q);
  });

  // theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

/* Restore from localStorage */
function restoreState(){
  // theme
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') document.body.classList.add('dark');

  // checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const val = localStorage.getItem(cb.id);
    if(val === 'true') cb.checked = true;
  });
}

/* Update progress bar */
function updateProgress(){
  const all = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const total = all.length || 1;
  const done = all.filter(x => x.checked).length;
  const pct = Math.round((done / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = `${pct}% done`;
}

/* Search filter implementation */
function filterBySearch(q){
  const labels = Array.from(document.querySelectorAll('.chapter-list li'));
  if(!q){
    labels.forEach(li => li.style.display = '');
    // show all subject cards
    DATA.forEach(s => document.getElementById(`card-${s.id}`).style.display = '');
    return;
  }
  labels.forEach(li => {
    const txt = li.textContent.toLowerCase();
    li.style.display = txt.includes(q) ? '' : 'none';
  });
  // Also collapse/hide subject cards that have no visible items
  DATA.forEach(s => {
    const card = document.getElementById(`card-${s.id}`);
    const anyVisible = card.querySelectorAll('li:not([style*="display: none"])').length > 0;
    card.style.display = anyVisible ? '' : 'none';
  });
}

/* Initialize app */
buildUI();

/* Optional: keyboard shortcut "/" to focus search */
document.addEventListener('keydown', (e) => {
  if(e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
    e.preventDefault();
    searchInput.focus();
  }
});