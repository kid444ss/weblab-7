import { useState } from "react";

function CourseCard({ id, title, desc, category, isStudying, onLearn, onDelete, onEdit, categories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(desc);
  const [editCategory, setEditCategory] = useState(category);

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert("课程名称不能为空！");
      return;
    }
    if (!editDesc.trim()) {
      alert("课程简介不能为空！");
      return;
    }

    onEdit(id, {
      title: editTitle.trim(),
      desc: editDesc.trim(),
      category: editCategory
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDesc(desc);
    setEditCategory(category);
    setIsEditing(false);
  };

  const getCategoryColor = (cat) => {
    const colors = {
      "前端开发": "#4CAF50",
      "后端开发": "#2196F3",
      "编程语言": "#FF9800",
      "数据科学": "#9C27B0"
    };
    return colors[cat] || "#607D8B";
  };

  return (
    <div className={`course-card ${isStudying ? 'studying' : ''}`}>
      <div className="card-header">
        <span
          className="category-tag"
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          {category}
        </span>
        <div className="card-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-btn"
          >
            {isEditing ? '取消' : '编辑'}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="delete-btn"
          >
            删除
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="课程名称"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="课程简介"
            rows="3"
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            {categories.filter(cat => cat !== "全部").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={handleSave} className="save-btn">保存</button>
        </div>
      ) : (
        <>
          <h3 className="course-title">{title}</h3>
          <p className="course-desc">{desc}</p>

          <div className="card-footer">
            <button
              onClick={() => onLearn(id)}
              className={`learn-btn ${isStudying ? 'studying' : ''}`}
            >
              {isStudying ? '✓ 正在学习' : '开始学习'}
            </button>

            <div className="status-indicator">
              {isStudying ? (
                <span className="studying-text">学习中</span>
              ) : (
                <span className="completed-text">待学习</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CourseCard;