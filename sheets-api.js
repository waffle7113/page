class SheetsAPI {
    constructor() {
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // 데이터 읽기
    async readData(range) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${CONFIG.SPREADSHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`
            );
            const data = await response.json();
            return data.values || [];
        } catch (error) {
            console.error('데이터 읽기 오류:', error);
            return [];
        }
    }

    // 데이터 쓰기
    async writeData(range, values) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${CONFIG.SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED&key=${CONFIG.API_KEY}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: values
                    })
                }
            );
            return await response.json();
        } catch (error) {
            console.error('데이터 쓰기 오류:', error);
            throw error;
        }
    }

    // 학생 데이터 관리
    async getStudents() {
        const data = await this.readData(CONFIG.SHEET_NAMES.STUDENTS);
        return data.slice(1).map((row, index) => ({
            id: index + 1,
            name: row[0],
            attendance: JSON.parse(row[1] || '[]')
        }));
    }

    async saveStudents(students) {
        const values = [
            ['이름', '출석 기록'],
            ...students.map(student => [
                student.name,
                JSON.stringify(student.attendance)
            ])
        ];
        await this.writeData(CONFIG.SHEET_NAMES.STUDENTS, values);
    }

    // 과제 데이터 관리
    async getAssignments() {
        const data = await this.readData(CONFIG.SHEET_NAMES.ASSIGNMENTS);
        return data.slice(1).map((row, index) => ({
            id: index + 1,
            title: row[0],
            dueDate: row[1],
            completed: row[2] === 'TRUE'
        }));
    }

    async saveAssignments(assignments) {
        const values = [
            ['제목', '마감일', '완료여부'],
            ...assignments.map(assignment => [
                assignment.title,
                assignment.dueDate,
                assignment.completed ? 'TRUE' : 'FALSE'
            ])
        ];
        await this.writeData(CONFIG.SHEET_NAMES.ASSIGNMENTS, values);
    }

    // 학습 자료 관리
    async getMaterials() {
        const data = await this.readData(CONFIG.SHEET_NAMES.MATERIALS);
        const materials = {
            lectures: [],
            references: []
        };
        
        data.slice(1).forEach(row => {
            const material = {
                id: row[0],
                title: row[1],
                url: row[2],
                type: row[3]
            };
            if (material.type === 'lecture') {
                materials.lectures.push(material);
            } else {
                materials.references.push(material);
            }
        });
        
        return materials;
    }

    async saveMaterials(materials) {
        const values = [
            ['ID', '제목', 'URL', '유형'],
            ...materials.lectures.map(material => [
                material.id,
                material.title,
                material.url,
                'lecture'
            ]),
            ...materials.references.map(material => [
                material.id,
                material.title,
                material.url,
                'reference'
            ])
        ];
        await this.writeData(CONFIG.SHEET_NAMES.MATERIALS, values);
    }
} 