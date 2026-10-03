const errorBox = document.getElementById('errorBox');
const infoBox = document.getElementById('infoBox');
const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logoutBtn');

const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const studentTableBody = document.getElementById('studentTableBody');
const emptyState = document.getElementById('emptyState');

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    infoBox.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showInfo(message) {
    infoBox.textContent = message;
    infoBox.classList.remove('hidden');
    errorBox.classList.add('hidden');
    setTimeout(() => infoBox.classList.add('hidden'), 3000);
}

function clearAlerts() {
    errorBox.classList.add('hidden');
    infoBox.classList.add('hidden');
}

// ---------- Auth check ----------
// Runs as soon as the dashboard loads. If the session is not valid,
// the user is bounced back to the login page.
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();
        welcomeMsg.textContent = `Welcome, ${data.username}!`;
        loadStudents();
    } catch (err) {
        window.location.href = 'login.html';
    }
}

// ---------- Logout ----------
logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
        window.location.href = 'login.html';
    }
});

// ---------- Load & render students ----------
async function loadStudents() {
    try {
        const response = await fetch('/api/students', { credentials: 'include' });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        const students = await response.json();
        renderStudents(students);
    } catch (err) {
        showError('Failed to load students.');
    }
}

function renderStudents(students) {
    studentTableBody.innerHTML = '';

    if (!students || students.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${student.age}</td>
            <td>${escapeHtml(student.course)}</td>
            <td>
                <button class="btn btn-secondary btn-small" data-action="edit" data-id="${student.id}">Edit</button>
                <button class="btn btn-danger btn-small" data-action="delete" data-id="${student.id}">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---------- Add / Edit form submit ----------
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlerts();

    const student = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: parseInt(ageInput.value, 10),
        course: courseInput.value.trim()
    };

    const editingId = studentIdInput.value;
    const isEditing = editingId !== '';

    const url = isEditing ? `/api/students/${editingId}` : '/api/students';
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(student)
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.message || Object.values(data)[0] || 'Something went wrong.';
            showError(errorMessage);
            return;
        }

        showInfo(isEditing ? 'Student updated successfully.' : 'Student added successfully.');
        resetForm();
        loadStudents();
    } catch (err) {
        showError('Failed to save student.');
    }
});

// ---------- Edit / Delete button clicks (event delegation) ----------
studentTableBody.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'edit') {
        startEdit(id);
    } else if (action === 'delete') {
        deleteStudent(id);
    }
});

async function startEdit(id) {
    clearAlerts();
    try {
        const response = await fetch(`/api/students/${id}`, { credentials: 'include' });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        const student = await response.json();

        studentIdInput.value = student.id;
        nameInput.value = student.name;
        emailInput.value = student.email;
        ageInput.value = student.age;
        courseInput.value = student.course;

        formTitle.textContent = 'Edit Student';
        submitBtn.textContent = 'Update Student';
        cancelEditBtn.classList.remove('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        showError('Failed to load student for editing.');
    }
}

cancelEditBtn.addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    formTitle.textContent = 'Add Student';
    submitBtn.textContent = 'Add Student';
    cancelEditBtn.classList.add('hidden');
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    clearAlerts();

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            const data = await response.json();
            showError(data.message || 'Failed to delete student.');
            return;
        }

        showInfo('Student deleted successfully.');
        loadStudents();
    } catch (err) {
        showError('Failed to delete student.');
    }
}

// Kick everything off.
checkAuth();
