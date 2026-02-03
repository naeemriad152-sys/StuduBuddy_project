 
/* Project: StudyBuddy SPA
   Student Name: [NAEEM RIAD SALEM]
   Student ID: [120222476]
*/


// --- 1. إدارة البيانات (State Management) ---
// جلب البيانات المخزنة من المتصفح أو إنشاء مصفوفة فارغة إذا كان المستخدم جديداً
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// --- 2. منطق التنقل في التطبيق (SPA Navigation) ---
// اختيار جميع عناصر القائمة والأقسام للتحكم في ظهورها
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // منع المتصفح من إعادة تحميل الصفحة عند الضغط على الرابط
        const target = item.getAttribute('data-section');

        // حلقة تكرارية لإخفاء جميع الأقسام بإضافة كلاس hidden
        sections.forEach(s => s.classList.add('hidden'));
        // إظهار القسم الذي تم النقر عليه فقط
        document.getElementById(target).classList.remove('hidden');

        // تحديث شكل الزر النشط في القائمة
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // تحديث البيانات تلقائياً عند الانتقال بين الصفحات
        if(target === 'tasks') renderTasks();
        if(target === 'habits') renderHabits();
        if(target === 'resources') loadResources();
        updateDashboard();
    });
});

// --- 3. إدارة المهام (Tasks CRUD) ---
// فتح وإغلاق نموذج إضافة المهمة
document.getElementById('add-task-btn').addEventListener('click', () => {
    document.getElementById('task-form-container').classList.toggle('hidden');
});

// حفظ المهمة الجديدة عند إرسال النموذج
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(), // استخدام الوقت الحالي كمعرف فريد
        title: document.getElementById('task-title').value,
        dueDate: document.getElementById('task-date').value,
        priority: document.getElementById('task-priority').value,
        category: document.getElementById('task-category').value,
        completed: false
    };
    tasks.push(newTask); // إضافة المهمة للمصفوفة
    saveData(); // حفظ في التخزين المحلي
    renderTasks(); // إعادة رسم القائمة
    e.target.reset(); // تنظيف الحقول
    document.getElementById('task-form-container').classList.add('hidden');
});

// عرض المهام في الصفحة
function renderTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = tasks.map(t => `
        <div class="task-card card priority-${t.priority.toLowerCase()}">
            <h3>${t.title}</h3>
            <p>${t.dueDate} | ${t.category}</p>
            <button onclick="toggleTask(${t.id})">${t.completed ? '↩️' : '✅'}</button>
            <button onclick="deleteTask(${t.id})">🗑️</button>
        </div>
    `).join('');
}

// تغيير حالة المهمة (مكتملة / غير مكتملة)
window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveData(); renderTasks(); updateDashboard();
};

// حذف المهمة مع رسالة تأكيد
window.deleteTask = (id) => {
    if(confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
        tasks = tasks.filter(t => t.id !== id);
        saveData(); renderTasks(); updateDashboard();
    }
};

// --- 4. جلب المصادر الخارجية (Fetch API) ---
async function loadResources() {
    try {
        const res = await fetch('./resources.json'); // جلب ملف JSON
        const data = await res.json();
        document.getElementById('resources-list').innerHTML = data.map(r => `
            <div class="card"><h4>${r.title}</h4><a href="${r.link}" target="_blank">رابط المصدر</a></div>
        `).join('');
    } catch (e) { console.error("خطأ في تحميل ملف JSON"); }
}

// --- 5. وظائف عامة ---
// حفظ البيانات في ذاكرة المتصفح الدائمة (LocalStorage)
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("habits", JSON.stringify(habits));
}

// تحديث الإحصائيات في لوحة التحكم (Dashboard)
function updateDashboard() {
    const done = tasks.filter(t => t.completed).length;
    document.getElementById('completed-count').innerText = done;
    document.getElementById('due-soon-count').innerText = tasks.length - done;
    // حساب نسبة الإنجاز لشريط التقدم
    const prog = tasks.length ? (done / tasks.length) * 100 : 0;
    document.getElementById('main-progress-bar').style.width = prog + "%";
}

// تبديل الوضع الليلي
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// مسح جميع البيانات وتصفير التطبيق
document.getElementById('reset-data').addEventListener('click', () => {
    if(confirm("هل تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة.")) {
        localStorage.clear();
        location.reload();
    }
});

// تشغيل تحديث الإحصائيات عند فتح التطبيق لأول مرة
updateDashboard();


/* Project: StudyBuddy SPA
   Student Name: [NAEEM RIAD SALEM]
   Student ID: [120222476]
*/