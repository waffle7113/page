// Google Sheets API 인스턴스 생성
const sheetsAPI = new SheetsAPI();

// 데이터 관리
let students = [];
let assignments = [];
let materials = {
    lectures: [],
    references: []
};

// 학생 추가
async function addStudent() {
    const nameInput = document.getElementById('studentName');
    const name = nameInput.value.trim();
    
    if (name) {
        const student = {
            id: Date.now(),
            name: name,
            attendance: []
        };
        
        students.push(student);
        await saveStudents();
        await updateStudentList();
        nameInput.value = '';
    }
}

// 학생 목록 업데이트
async function updateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>
                <select onchange="updateAttendance(${student.id}, this.value)">
                    <option value="present">출석</option>
                    <option value="late">지각</option>
                    <option value="absent">결석</option>
                </select>
            </td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>
                <button onclick="deleteStudent(${student.id})">삭제</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// 출석 상태 업데이트
async function updateAttendance(studentId, status) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.attendance.push({
            date: new Date().toLocaleDateString(),
            status: status
        });
        await saveStudents();
    }
}

// 학생 삭제
async function deleteStudent(studentId) {
    students = students.filter(s => s.id !== studentId);
    await saveStudents();
    await updateStudentList();
}

// 학생 데이터 저장
async function saveStudents() {
    await sheetsAPI.saveStudents(students);
}

// 과제 추가
async function addAssignment() {
    const titleInput = document.getElementById('assignmentTitle');
    const dueDateInput = document.getElementById('dueDate');
    
    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    
    if (title && dueDate) {
        const assignment = {
            id: Date.now(),
            title: title,
            dueDate: dueDate,
            completed: false
        };
        
        assignments.push(assignment);
        await saveAssignments();
        await updateAssignmentList();
        
        titleInput.value = '';
        dueDateInput.value = '';
    }
}

// 과제 목록 업데이트
async function updateAssignmentList() {
    const assignmentList = document.getElementById('assignmentList');
    assignmentList.innerHTML = '';
    
    assignments.forEach(assignment => {
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment-item';
        assignmentElement.innerHTML = `
            <h3>${assignment.title}</h3>
            <p>마감일: ${new Date(assignment.dueDate).toLocaleDateString()}</p>
            <label>
                <input type="checkbox" 
                       ${assignment.completed ? 'checked' : ''} 
                       onchange="toggleAssignment(${assignment.id})">
                완료
            </label>
            <button onclick="deleteAssignment(${assignment.id})">삭제</button>
        `;
        assignmentList.appendChild(assignmentElement);
    });
}

// 과제 완료 상태 토글
async function toggleAssignment(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.completed = !assignment.completed;
        await saveAssignments();
    }
}

// 과제 삭제
async function deleteAssignment(assignmentId) {
    assignments = assignments.filter(a => a.id !== assignmentId);
    await saveAssignments();
    await updateAssignmentList();
}

// 과제 데이터 저장
async function saveAssignments() {
    await sheetsAPI.saveAssignments(assignments);
}

// 학습 자료 추가
async function addMaterial(type, title, url) {
    const material = {
        id: Date.now(),
        title: title,
        url: url
    };
    
    materials[type].push(material);
    await saveMaterials();
    await updateMaterialsList();
}

// 학습 자료 목록 업데이트
async function updateMaterialsList() {
    const lectureMaterials = document.getElementById('lectureMaterials');
    const referenceMaterials = document.getElementById('referenceMaterials');
    
    lectureMaterials.innerHTML = '';
    referenceMaterials.innerHTML = '';
    
    materials.lectures.forEach(material => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${material.url}" target="_blank">${material.title}</a>`;
        lectureMaterials.appendChild(li);
    });
    
    materials.references.forEach(material => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${material.url}" target="_blank">${material.title}</a>`;
        referenceMaterials.appendChild(li);
    });
}

// 학습 자료 저장
async function saveMaterials() {
    await sheetsAPI.saveMaterials(materials);
}

// 초기 데이터 로드
async function loadInitialData() {
    try {
        students = await sheetsAPI.getStudents();
        assignments = await sheetsAPI.getAssignments();
        materials = await sheetsAPI.getMaterials();
        
        await updateStudentList();
        await updateAssignmentList();
        await updateMaterialsList();
    } catch (error) {
        console.error('초기 데이터 로드 오류:', error);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', loadInitialData); 