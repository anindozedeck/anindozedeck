const defaultProfile = {
  name: 'Melkzadeck Anindo',
  education: '',
  location: 'Mombasa, Kenya',
  bio: 'I enjoy the space where software, data, and everyday human behavior meet. My work is guided by a simple question: can this be made clearer, faster, or more useful?'
};

const profile = { ...defaultProfile, ...(JSON.parse(localStorage.getItem('melkzadeck-profile') || 'null') || {}) };
const dialog = document.querySelector('#profileDialog');
const form = document.querySelector('#profileForm');

function updateProfileView() {
  document.querySelector('#displayName').textContent = profile.name;
  document.querySelector('#educationValue').textContent = profile.education || 'Tell me your education level →';
  document.querySelector('#educationSignal').textContent = profile.education || 'Add your education';
  document.querySelector('#locationValue').textContent = profile.location;
  document.querySelector('#bioValue').textContent = profile.bio;
}

function fillForm() {
  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
updateProfileView();
document.querySelector('#editProfile').addEventListener('click', () => { fillForm(); dialog.showModal(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  Object.assign(profile, values);
  localStorage.setItem('melkzadeck-profile', JSON.stringify(profile));
  updateProfileView();
  dialog.close();
});
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(navItem => navItem.classList.remove('active'));
  item.classList.add('active');
}));

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-item')];
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const matching = navItems.find(item => item.getAttribute('href') === `#${entry.target.id}`);
  if (matching) {
    navItems.forEach(item => item.classList.remove('active'));
    matching.classList.add('active');
  }
}), { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(section => observer.observe(section));
