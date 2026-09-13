const learners = [
  ['Amina Wanjiku', 'YW-0841'], ['Brian Otieno', 'YW-0842'], ['Chloe Njeri', 'YW-0843'], ['Daniel Kiptoo', 'YW-0844'],
  ['Elijah Mwangi', 'YW-0845'], ['Fatima Hassan', 'YW-0846'], ['Grace Akinyi', 'YW-0847'], ['Hassan Ali', 'YW-0848'],
  ['Ivy Chebet', 'YW-0849'], ['Jonah Maina', 'YW-0850'], ['Liam Kamau', 'YW-0851'], ['Maya Wambui', 'YW-0852']
];
const statuses = ['present', 'late', 'absent', 'empty'];
const labels = { present: 'Present', late: 'Late', absent: 'Absent', empty: 'Not marked' };
let attendance = JSON.parse(localStorage.getItem('rollcall-attendance') || 'null') || learners.map(() => ['present', 'present', 'empty', 'empty']);

function initials(name) { return name.split(' ').map(part => part[0]).join(''); }
function save() { localStorage.setItem('rollcall-attendance', JSON.stringify(attendance)); updateSummary(); }
function nextStatus(current) { return statuses[(statuses.indexOf(current) + 1) % statuses.length]; }
function render() {
  const query = document.querySelector('#searchInput').value.toLowerCase().trim();
  const body = document.querySelector('#registerBody');
  body.innerHTML = '';
  learners.forEach((learner, learnerIndex) => {
    if (query && !learner[0].toLowerCase().includes(query) && !learner[1].toLowerCase().includes(query)) return;
    const row = document.createElement('tr');
    row.innerHTML = `<td><div class="learner"><span class="learner-avatar">${initials(learner[0])}</span><span><span class="learner-name">${learner[0]}</span><span class="learner-id">${learner[1]}</span></span></div></td>`;
    attendance[learnerIndex].forEach((status, lessonIndex) => {
      const cell = document.createElement('td');
      const button = document.createElement('button');
      button.className = `status-button status-${status}`;
      button.innerHTML = `<i class="status-dot ${status}-dot"></i>${labels[status]}`;
      button.setAttribute('aria-label', `${learner[0]}, lesson ${lessonIndex + 1}: ${labels[status]}. Click to change.`);
      button.addEventListener('click', () => { attendance[learnerIndex][lessonIndex] = nextStatus(status); save(); render(); });
      cell.append(button); row.append(cell);
    });
    body.append(row);
  });
  document.querySelector('#shownCount').textContent = `Showing ${body.children.length} of ${learners.length} learners`;
  updateSummary();
}
function updateSummary() {
  const marked = attendance.flat().filter(status => status !== 'empty');
  const present = attendance.flat().filter(status => status === 'present').length;
  const attention = attendance.flat().filter(status => status === 'late' || status === 'absent').length;
  const complete = [0, 1, 2, 3].filter(lesson => attendance.every(learner => learner[lesson] !== 'empty')).length;
  document.querySelector('#presentCount').textContent = present;
  document.querySelector('#presentPercent').textContent = `${marked.length ? Math.round((present / marked.length) * 100) : 0}%`;
  document.querySelector('#presentProgress').style.width = `${marked.length ? (present / marked.length) * 100 : 0}%`;
  document.querySelector('#lessonsComplete').innerHTML = `${complete} <small>/ 4</small>`;
  document.querySelector('#attentionCount').textContent = attention;
}
document.querySelector('#searchInput').addEventListener('input', render);
document.querySelector('#markAllButton').addEventListener('click', () => { attendance = attendance.map(learner => learner.map(() => 'present')); save(); render(); });
document.querySelector('#todayButton').addEventListener('click', () => { document.querySelector('.eyebrow').textContent = 'Tuesday · 14 May 2024'; });
document.querySelector('#prevDay').addEventListener('click', () => { document.querySelector('.eyebrow').textContent = 'Monday · 13 May 2024'; });
document.querySelector('#nextDay').addEventListener('click', () => { document.querySelector('.eyebrow').textContent = 'Wednesday · 15 May 2024'; });
document.querySelector('#exportButton').addEventListener('click', () => {
  const csv = [['Learner', 'ID', 'Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4'], ...learners.map((learner, index) => [learner[0], learner[1], ...attendance[index].map(status => labels[status])])].map(row => row.join(',')).join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'rollcall-attendance.csv'; link.click(); URL.revokeObjectURL(link.href);
});
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); } });
render();