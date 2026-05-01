import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import Footer from "./components/Footer";
import { useLocalStorage, useDebounce } from "./hooks";

function App() {
  // 使用 useLocalStorage 自定义 Hook 管理课程数据持久化
  const [courses, setCourses] = useLocalStorage("react-courses", [
    {
      id: 1,
      title: "React 基础教程",
      desc: "学习 React 的核心概念，包括组件、状态管理和生命周期。",
      category: "前端开发",
      isStudying: false
    },
    {
      id: 2,
      title: "JavaScript ES6+",
      desc: "掌握现代 JavaScript 语法特性，箭头函数、解构赋值等。",
      category: "编程语言",
      isStudying: true
    },
    {
      id: 3,
      title: "CSS Flexbox 布局",
      desc: "学习使用 Flexbox 创建灵活的响应式网页布局。",
      category: "前端开发",
      isStudying: false
    }
  ]);

  const [newCourse, setNewCourse] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("前端开发");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [error, setError] = useState("");

  // 使用 useRef 获取输入框 DOM 引用，用于自动聚焦
  const courseInputRef = useRef(null);

  // 使用 useDebounce 自定义 Hook 实现搜索防抖
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories = ["全部", "前端开发", "后端开发", "编程语言", "数据科学"];

  // 使用 useCallback 优化事件处理函数，避免不必要的重新渲染
  const handleLearn = useCallback((id) => {
    setCourses(courses =>
      courses.map(course =>
        course.id === id
          ? { ...course, isStudying: !course.isStudying }
          : course
      )
    );
  }, [setCourses]);

  const handleAddCourse = useCallback(() => {
    if (!newCourse.trim()) {
      setError("课程名称不能为空！");
      // 使用 useRef 使输入框获得焦点
      courseInputRef.current?.focus();
      return;
    }

    if (!newCourseDesc.trim()) {
      setError("课程简介不能为空！");
      return;
    }

    setCourses(prevCourses => {
      const newId = Math.max(...prevCourses.map(c => c.id), 0) + 1;
      const course = {
        id: newId,
        title: newCourse.trim(),
        desc: newCourseDesc.trim(),
        category: newCourseCategory,
        isStudying: false
      };
      return [...prevCourses, course];
    });

    setNewCourse("");
    setNewCourseDesc("");
    setNewCourseCategory("前端开发");
    setError("");

    // 添加课程后自动聚焦到输入框
    setTimeout(() => {
      courseInputRef.current?.focus();
    }, 0);
  }, [newCourse, newCourseDesc, newCourseCategory, setCourses]);

  const handleDeleteCourse = useCallback((id) => {
    setCourses(courses => courses.filter(course => course.id !== id));
  }, [setCourses]);

  const handleEditCourse = useCallback((id, updatedCourse) => {
    setCourses(courses =>
      courses.map(course =>
        course.id === id ? { ...course, ...updatedCourse } : course
      )
    );
  }, [setCourses]);

  // 使用 useMemo 缓存筛选后的课程列表，仅在课程列表或搜索关键词变化时重新计算
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           course.desc.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "全部" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, debouncedSearchTerm, selectedCategory]);

  // 使用 useEffect 在页面首次加载时聚焦到输入框
  useEffect(() => {
    courseInputRef.current?.focus();
  }, []);

  return (
    <div className="app">
      <Header title="React 课程管理系统" />

      <div className="stats-container">
        <div className="stat-card">
          <h3>总课程数</h3>
          <p className="stat-number">{courses.length}</p>
        </div>
        <div className="stat-card">
          <h3>学习中</h3>
          <p className="stat-number">{courses.filter(c => c.isStudying).length}</p>
        </div>
        <div className="stat-card">
          <h3>已完成</h3>
          <p className="stat-number">{courses.filter(c => !c.isStudying).length}</p>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="add-section">
        <h2>添加新课程</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="add-form">
          <input
            ref={courseInputRef}
            type="text"
            placeholder="课程名称"
            value={newCourse}
            onChange={(e) => {
              setNewCourse(e.target.value);
              setError("");
            }}
          />

          <textarea
            placeholder="课程简介"
            value={newCourseDesc}
            onChange={(e) => {
              setNewCourseDesc(e.target.value);
              setError("");
            }}
            rows="3"
          />

          <select
            value={newCourseCategory}
            onChange={(e) => setNewCourseCategory(e.target.value)}
          >
            {categories.filter(cat => cat !== "全部").map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button onClick={handleAddCourse} className="add-btn">添加课程</button>
        </div>
      </div>

      <CourseList
        courses={filteredCourses}
        onLearn={handleLearn}
        onDelete={handleDeleteCourse}
        onEdit={handleEditCourse}
        categories={categories}
      />

      <Footer />
    </div>
  );
}

export default App;