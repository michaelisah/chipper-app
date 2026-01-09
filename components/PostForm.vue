<script setup>
import { usePosts } from '~/stores/posts'
import { ref } from 'vue'

const postStore = usePosts()
const title = ref('')
const body = ref('')
const isSubmitting = ref(false)
const { showErrorModal } = useHelpers()

async function submit() {
  if (!title.value || !body.value) return

  try {
    isSubmitting.value = true
    await postStore.createPost({ title: title.value, body: body.value })
    
    // Clear the form after successful submission
    title.value = ''
    body.value = ''
  } catch (error) {
    showErrorModal(error, 'Failed to create post. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <input
      v-model="title"
      placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>
    <button 
      class="bg-blue-600 text-white px-8 py-4 rounded-lg"
      :disabled="isSubmitting">
      {{ isSubmitting ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>