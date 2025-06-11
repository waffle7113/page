// 게시글 데이터를 저장할 배열
let posts = [];

// 게시글 추가 함수
function addPost() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    
    // 입력값 검증
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 새 게시글 객체 생성
    const newPost = {
        id: Date.now(), // 고유 ID 생성
        title: titleInput.value,
        content: contentInput.value,
        date: new Date().toLocaleString()
    };

    // 게시글 배열에 추가
    posts.unshift(newPost); // 최신 글이 위에 오도록 배열 앞에 추가

    // 입력 필드 초기화
    titleInput.value = '';
    contentInput.value = '';

    // 화면 업데이트
    renderPosts();
}

// 게시글 삭제 함수
function deletePost(id) {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        posts = posts.filter(post => post.id !== id);
        renderPosts();
    }
}

// 게시글 렌더링 함수
function renderPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="date">작성일: ${post.date}</div>
            <button class="delete-btn" onclick="deletePost(${post.id})">삭제</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

// 페이지 로드 시 초기 렌더링
renderPosts(); 