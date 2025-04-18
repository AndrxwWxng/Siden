import ProjectWithSidebar from './ProjectWithSidebar';

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProjectWithSidebar>{children}</ProjectWithSidebar>;
} 