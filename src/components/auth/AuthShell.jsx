import { PageContainer } from '../layout/PageContainer';

export function AuthShell({ title, description, children, aside }) {
  return (
    <PageContainer className="auth-shell">
      <div className="auth-shell__content card">
        <span className="eyebrow">Welcome to Contractor Connect</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
      <div className="auth-shell__aside card">{aside}</div>
    </PageContainer>
  );
}
