# Admin Layout System

This directory contains the reusable admin layout components that provide a consistent sidebar and layout for all admin routes.

## Components

### AdminLayout
The main layout component that wraps all admin pages. It includes:
- Sidebar with navigation
- Header with breadcrumbs
- Content area with proper spacing

### AppSidebar
The sidebar component that contains:
- Brand header
- Main navigation menu
- User profile section

## Usage

The admin layout is automatically applied to all routes under `/admin/*` through the layout route system. You don't need to import or wrap anything!

To create a new admin page, simply create a route file:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/your-route')({
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Page Title</h1>
        <p className="text-muted-foreground">
          Your page description here.
        </p>
      </div>
      
      {/* Your page content here */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Your Content</h3>
        <p>Your content goes here.</p>
      </div>
    </div>
  ),
})
```

## Navigation

The sidebar navigation is automatically configured with the following sections:
- **Dashboard** - Main admin dashboard
- **Competitions** - Manage competitions and contests
- **Users** - User management
- **Settings** - Admin settings and configuration

## Adding New Navigation Items

To add new navigation items, update the `data.navMain` array in `src/components/admin/sidebar/app-sidebar.tsx`:

```tsx
{
  title: "Your Section",
  url: "/admin/your-route",
  icon: YourIcon,
  items: [
    {
      title: "Sub Item 1",
      url: "/admin/your-route/sub-1",
    },
    {
      title: "Sub Item 2", 
      url: "/admin/your-route/sub-2",
    },
  ],
}
```

## Benefits

- **Consistent UI**: All admin pages have the same layout and navigation
- **Easy to maintain**: Changes to the sidebar affect all admin pages
- **Simple to create new pages**: Just create a route file - no imports needed!
- **Automatic layout**: Layout is applied automatically through TanStack Router's layout system
- **Proper routing**: Uses TanStack Router for client-side navigation
- **Responsive**: Works on both desktop and mobile devices
