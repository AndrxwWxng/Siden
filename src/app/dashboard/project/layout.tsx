import ProjectThemeWrapper from './ProjectThemeWrapper';

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProjectThemeWrapper>{children}</ProjectThemeWrapper>;
} 