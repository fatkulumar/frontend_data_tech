
<template>
    <div>
        <ClientOnly>
          <template #fallback>
            <p class="left-1/2 top-1/2 absolute">Loading...</p>
          </template>
        </ClientOnly>
        <main>
          <slot />
        </main>
    </div>
  </template>

<style>
  body {
    background-color: #F2F7FF;
  }
</style>