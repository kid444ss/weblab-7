import { memo } from "react";
import CourseCard from "./CourseCard";

function CourseList({ courses, onLearn, onDelete, onEdit, categories }) {
  if (courses.length === 0) {
    return (
      <div className="course-list">
        <div className="empty-state">
          <h3>暂无课程</h3>
          <p>请添加您的第一门课程开始学习之旅！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-list">
      <h2 className="section-title">课程列表 ({courses.length})</h2>
      <div className="courses-grid">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            desc={course.desc}
            category={course.category}
            isStudying={course.isStudying}
            onLearn={onLearn}
            onDelete={onDelete}
            onEdit={onEdit}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}

// 使用 memo 优化子组件，避免不必要的重新渲染
export default memo(CourseList);