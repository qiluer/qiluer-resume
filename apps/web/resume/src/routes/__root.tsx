import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

export const Route = createRootRouteWithContext()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 antialiased">
      <Outlet />
    </div>
  );
}
