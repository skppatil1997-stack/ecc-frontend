export default function PageContainer({ title, children }) {
  return (
    <div className="page-container">
      {title && (
        <h2 className="mb-6 text-slate-900">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
