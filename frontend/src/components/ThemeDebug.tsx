import { useTheme } from "@/components/theme-provider"

export function ThemeDebug() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card rounded-lg shadow-lg">
      <p>Current theme: {theme}</p>
      <p>localStorage theme: {localStorage.getItem('vite-ui-theme')}</p>
      <p>HTML class: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</p>
      <div className="mt-2 space-x-2">
        <button onClick={() => setTheme('light')} className="p-2 bg-primary text-primary-foreground rounded">Light</button>
        <button onClick={() => setTheme('dark')} className="p-2 bg-primary text-primary-foreground rounded">Dark</button>
        <button onClick={() => setTheme('system')} className="p-2 bg-primary text-primary-foreground rounded">System</button>
      </div>
    </div>
  )
} 