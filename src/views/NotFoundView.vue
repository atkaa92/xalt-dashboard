<template>
  <main
    class="min-h-dvh flex flex-col items-center justify-center text-center bg-[rgb(var(--color-global))] text-[rgb(var(--color-fg))] p-6"
  >
    <!-- 404 Label -->
    <h1 class="text-[6rem] font-extrabold text-fg leading-none">404</h1>

    <!-- Subtitle -->
    <h2 class="text-2xl font-semibold mb-2">Page Not Found</h2>

    <!-- Description -->
    <p class="text-[rgb(var(--color-muted))] max-w-md mb-8">
      Sorry, the page you’re looking for doesn’t exist or may have been moved.
    </p>

    <!-- Home Button -->
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 rounded-lg bg-fg px-5 py-2 font-medium text-main hover:bg-yellowish transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Dashboard
    </RouterLink>
  </main>
</template>
