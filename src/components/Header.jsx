function Header({ title }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>{title}</h1>
        <p className="subtitle">轻松管理您的学习课程，追踪学习进度</p>
      </div>
    </header>
  );
}

export default Header;