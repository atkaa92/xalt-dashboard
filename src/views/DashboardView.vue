<template>
  <section class="grid grid-cols-1 gap-4">
    <ProjectItem
      v-for="project in projects"
      :key="project.id"
      :project="project"
      class="p-4 rounded-xl bg-secondary shadow-sm flex items-center gap-6"
    />
  </section>
</template>

<script setup lang="ts">
import ProjectItem from '@/components/project/ProjectItem.vue';
import { projects } from '@/utilities/data';
</script>
