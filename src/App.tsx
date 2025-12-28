import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentPreviewRouter } from './components/ComponentPreview';
import { useAuth } from './context/AuthContext';

/*-krisspy-code-start*/
// Auto-generated imports from manifest
import DesignSystemTest from '/src/pages/DesignSystemTest.tsx';
import Dashboard from '/src/pages/Dashboard.tsx';
import Ideas from '/src/pages/Ideas.tsx';
import Login from '/src/pages/Login.tsx';
import Register from '/src/pages/Register.tsx';
import Settings from '/src/pages/Settings.tsx';
import ContentBuilder from '/src/pages/ContentBuilder.tsx';
import Editor from '/src/pages/Editor.tsx';
import KnowledgeBase from '/src/pages/KnowledgeBase.tsx';
import Library from '/src/pages/Library.tsx';
import Publisher from '/src/pages/Publisher.tsx';
import AdminDashboard from '/src/pages/AdminDashboard.tsx';
import Analytics from '/src/pages/Analytics.tsx';
import ContentAnalysis from '/src/pages/ContentAnalysis.tsx';


// Auth guard component
function AuthGuard({ children, requiresAuth = false }: { children: React.ReactNode, requiresAuth?: boolean }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiresAuth && isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Layout wrapper component
function PageWithLayout({ 
  page: Page, 
  layouts = [] 
}: { 
  page: React.ComponentType, 
  layouts?: React.ComponentType<{ children: React.ReactNode }>[] 
}) {
  if (!layouts.length) {
    return <Page />;
  }
  
  // Render nested layouts from outermost to innermost
  return layouts.reduceRight(
    (acc, Layout) => <Layout>{acc}</Layout>, 
    <Page />
  );
}
/*-krisspy-code-end*/

export default function App() {
  return (
    <Router>
      <Routes>
        {/*-krisspy-code-start*/}
        {/* Auto-generated routes from manifest */}
        <Route path="/design-system" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={DesignSystemTest} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Dashboard} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/ideas" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Ideas} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/login" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Login} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/register" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Register} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/settings" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Settings} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/builder" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={ContentBuilder} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/editor" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Editor} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/knowledge-base" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={KnowledgeBase} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/library" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Library} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/publisher" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Publisher} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/admin" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={AdminDashboard} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/analytics" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={Analytics} layouts={[]} />
          </AuthGuard>
        } />

        <Route path="/analysis" element={
          <AuthGuard requiresAuth={false}>
            <PageWithLayout page={ContentAnalysis} layouts={[]} />
          </AuthGuard>
        } />
        {/*-krisspy-code-end*/}
        
        <Route path="/_component/*" element={<ComponentPreviewRouter />} />
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
              Go back to home
            </a>
          </div>
        } />
      </Routes>
    </Router>
  );
}